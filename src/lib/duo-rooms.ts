import { Redis } from "@upstash/redis";
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
};

const TTL_MS = 45 * 60 * 1000;
const TTL_SEC = Math.floor(TTL_MS / 1000);
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const KEY_PREFIX = "flipon:duo:";

const globalStore = globalThis as typeof globalThis & {
  __fliponDuoRooms?: Map<string, DuoRoom>;
  __fliponRedis?: Redis | null;
  __fliponRedisChecked?: boolean;
};

function memoryRooms(): Map<string, DuoRoom> {
  if (!globalStore.__fliponDuoRooms) {
    globalStore.__fliponDuoRooms = new Map();
  }
  return globalStore.__fliponDuoRooms;
}

function getRedis(): Redis | null {
  if (globalStore.__fliponRedisChecked) {
    return globalStore.__fliponRedis ?? null;
  }
  globalStore.__fliponRedisChecked = true;

  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    globalStore.__fliponRedis = null;
    return null;
  }

  globalStore.__fliponRedis = new Redis({ url, token });
  return globalStore.__fliponRedis;
}

/** True when a shared store is available (required on Vercel multi-instance). */
export function hasDurableStore(): boolean {
  return getRedis() !== null;
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

function purgeExpiredMemory() {
  const now = Date.now();
  const map = memoryRooms();
  for (const [id, room] of map) {
    if (now - room.createdAt > TTL_MS) map.delete(id);
  }
}

async function saveRoom(room: DuoRoom): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(roomKey(room.id), room, { ex: TTL_SEC });
    return;
  }
  memoryRooms().set(room.id, room);
}

async function loadRoom(id: string): Promise<DuoRoom | undefined> {
  const code = id.toUpperCase();
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<DuoRoom>(roomKey(code));
    return data ?? undefined;
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
  await saveRoom(room);
  return room;
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
