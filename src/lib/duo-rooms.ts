import { createClient, type RedisClientType } from "redis";
import { buildDeck, type Constraints, type Plan } from "@/data/plans";
import type { DuoPublicSnapshot, DuoRole } from "@/lib/duo-types";

export type { DuoPublicSnapshot, DuoRole };

export type DuoRoom = {
  id: string;
  createdAt: number;
  constraints: Constraints;
  deck: Plan[];
  guestJoined: boolean;
  hostReady: boolean;
  guestReady: boolean;
  hostLikes: string[] | null;
  guestLikes: string[] | null;
  /** Set when both have voted - room will expire soon after. */
  completedAt?: number;
};

/** Absolute max lifetime (cleanup safety net). */
const MAX_AGE_MS = 2 * 24 * 60 * 60 * 1000;
/** TTL while the session is still in progress. */
const ACTIVE_TTL_SEC = 24 * 60 * 60;
/** After match: keep briefly so both phones can poll, then drop. */
const COMPLETED_TTL_SEC = 15 * 60;

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const KEY_PREFIX = "flipon:duo:";

const globalStore = globalThis as typeof globalThis & {
  __fliponDuoRooms?: Map<string, DuoRoom>;
  __fliponRedisClient?: RedisClientType | null;
  __fliponRedisReady?: Promise<RedisClientType | null>;
};

function memoryRooms(): Map<string, DuoRoom> {
  if (!globalStore.__fliponDuoRooms) {
    globalStore.__fliponDuoRooms = new Map();
  }
  return globalStore.__fliponDuoRooms;
}

function redisUrl(): string | undefined {
  return (
    process.env.REDIS_URL ||
    process.env.KV_URL ||
    process.env.REDIS_TLS_URL ||
    undefined
  );
}

/** True when a shared store is available (required on Vercel multi-instance). */
export function hasDurableStore(): boolean {
  return Boolean(redisUrl()) || Boolean(process.env.DATABASE_URL?.trim());
}

async function getRedis(): Promise<RedisClientType | null> {
  const url = redisUrl();
  if (!url) return null;

  if (globalStore.__fliponRedisClient?.isOpen) {
    return globalStore.__fliponRedisClient;
  }

  if (!globalStore.__fliponRedisReady) {
    globalStore.__fliponRedisReady = (async () => {
      const client = createClient({ url }) as RedisClientType;
      client.on("error", () => {
        /* avoid unhandled error spam in serverless */
      });
      await client.connect();
      globalStore.__fliponRedisClient = client;
      return client;
    })().catch(() => {
      globalStore.__fliponRedisReady = undefined;
      globalStore.__fliponRedisClient = null;
      return null;
    });
  }

  return globalStore.__fliponRedisReady;
}

function roomKey(id: string) {
  return `${KEY_PREFIX}${id.toUpperCase()}`;
}

function makeCode(): string {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

function isPastMaxAge(room: DuoRoom): boolean {
  return Date.now() - room.createdAt > MAX_AGE_MS;
}

function ttlFor(room: DuoRoom): number {
  const ageLeftSec = Math.floor(
    (room.createdAt + MAX_AGE_MS - Date.now()) / 1000,
  );
  if (ageLeftSec <= 0) return 1;

  const bothDone = room.hostLikes !== null && room.guestLikes !== null;
  if (bothDone) return Math.min(COMPLETED_TTL_SEC, ageLeftSec);
  return Math.min(ACTIVE_TTL_SEC, ageLeftSec);
}

function purgeExpiredMemory() {
  const now = Date.now();
  const map = memoryRooms();
  for (const [id, room] of map) {
    if (now - room.createdAt > MAX_AGE_MS) {
      map.delete(id);
      continue;
    }
    if (
      room.completedAt &&
      now - room.completedAt > COMPLETED_TTL_SEC * 1000
    ) {
      map.delete(id);
    }
  }
}

async function deleteRoomKey(id: string): Promise<void> {
  const code = id.toUpperCase();
  const redis = await getRedis();
  if (redis) {
    await redis.del(roomKey(code));
    return;
  }
  memoryRooms().delete(code);
}

async function saveRoom(room: DuoRoom): Promise<void> {
  if (isPastMaxAge(room)) {
    await deleteRoomKey(room.id);
    return;
  }

  const redis = await getRedis();
  if (redis) {
    await redis.set(roomKey(room.id), JSON.stringify(room), {
      EX: ttlFor(room),
    });
    return;
  }
  memoryRooms().set(room.id, room);
}

/** Restaure une room (ex. depuis Postgres) si absente du store hot. */
export async function saveRoomIfMissing(room: DuoRoom): Promise<void> {
  const existing = await loadRoom(room.id);
  if (existing) return;
  await saveRoom(room);
}

async function loadRoom(id: string): Promise<DuoRoom | undefined> {
  const code = id.toUpperCase();
  const redis = await getRedis();

  if (redis) {
    const raw = await redis.get(roomKey(code));
    if (!raw) return undefined;
    let data: DuoRoom;
    try {
      data = typeof raw === "string" ? JSON.parse(raw) : (raw as DuoRoom);
    } catch {
      await deleteRoomKey(code);
      return undefined;
    }
    if (isPastMaxAge(data)) {
      await deleteRoomKey(code);
      return undefined;
    }
    if (
      data.completedAt &&
      Date.now() - data.completedAt > COMPLETED_TTL_SEC * 1000
    ) {
      await deleteRoomKey(code);
      return undefined;
    }
    return data;
  }

  purgeExpiredMemory();
  return memoryRooms().get(code);
}

export async function createRoom(constraints: Constraints): Promise<DuoRoom> {
  let id = makeCode();
  for (let i = 0; i < 8; i++) {
    const existing = await loadRoom(id);
    if (!existing) break;
    id = makeCode();
  }

  const room: DuoRoom = {
    id,
    createdAt: Date.now(),
    constraints,
    deck: buildDeck(constraints),
    guestJoined: false,
    hostReady: false,
    guestReady: false,
    hostLikes: null,
    guestLikes: null,
  };
  await saveRoom(room);
  return room;
}

export async function getRoom(id: string): Promise<DuoRoom | undefined> {
  return loadRoom(id);
}

export async function joinRoom(id: string): Promise<DuoRoom | null> {
  const room = await loadRoom(id);
  if (!room) return null;
  room.guestJoined = true;
  await saveRoom(room);
  return room;
}

export async function setReady(
  id: string,
  role: DuoRole,
): Promise<DuoRoom | null> {
  const room = await loadRoom(id);
  if (!room) return null;
  if (role === "host") room.hostReady = true;
  else {
    if (!room.guestJoined) return null;
    room.guestReady = true;
  }
  await saveRoom(room);
  return room;
}

export async function submitVotes(
  id: string,
  role: DuoRole,
  likedIds: string[],
): Promise<DuoRoom | null> {
  const room = await loadRoom(id);
  if (!room) return null;
  if (!room.hostReady || !room.guestReady) return null;
  if (role === "host") room.hostLikes = likedIds;
  else room.guestLikes = likedIds;

  if (room.hostLikes !== null && room.guestLikes !== null) {
    room.completedAt = Date.now();
  }

  await saveRoom(room);
  return room;
}

/** Immediate cleanup (e.g. user taps Recommencer after the match). */
export async function closeRoom(id: string): Promise<void> {
  await deleteRoomKey(id);
}

export function computeMatch(room: DuoRoom): Plan | null {
  if (!room.hostLikes || !room.guestLikes) return null;
  const guestSet = new Set(room.guestLikes);
  const intersection = room.hostLikes.filter((planId) => guestSet.has(planId));
  const byId = new Map(room.deck.map((p) => [p.id, p]));
  for (const planId of intersection) {
    const plan = byId.get(planId);
    if (plan) return plan;
  }
  return null;
}

export function toPublicSnapshot(
  room: DuoRoom,
  role: DuoRole,
): DuoPublicSnapshot {
  const youVoted =
    role === "host" ? room.hostLikes !== null : room.guestLikes !== null;
  const partnerVoted =
    role === "host" ? room.guestLikes !== null : room.hostLikes !== null;
  const bothVoted = room.hostLikes !== null && room.guestLikes !== null;

  return {
    id: room.id,
    constraints: room.constraints,
    deck: room.deck,
    guestJoined: room.guestJoined,
    hostReady: room.hostReady,
    guestReady: room.guestReady,
    bothReady: room.hostReady && room.guestReady,
    youVoted,
    partnerVoted,
    bothVoted,
    match: bothVoted ? computeMatch(room) : null,
  };
}
