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
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const globalStore = globalThis as typeof globalThis & {
  __fliponDuoRooms?: Map<string, DuoRoom>;
};

function rooms(): Map<string, DuoRoom> {
  if (!globalStore.__fliponDuoRooms) {
    globalStore.__fliponDuoRooms = new Map();
  }
  return globalStore.__fliponDuoRooms;
}

function makeCode(): string {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

function purgeExpired() {
  const now = Date.now();
  const map = rooms();
  for (const [id, room] of map) {
    if (now - room.createdAt > TTL_MS) map.delete(id);
  }
}

export function createRoom(constraints: Constraints): DuoRoom {
  purgeExpired();
  const map = rooms();
  let id = makeCode();
  while (map.has(id)) id = makeCode();

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
  map.set(id, room);
  return room;
}

export function getRoom(id: string): DuoRoom | undefined {
  purgeExpired();
  return rooms().get(id.toUpperCase());
}

export function joinRoom(id: string): DuoRoom | null {
  const room = getRoom(id);
  if (!room) return null;
  room.guestJoined = true;
  return room;
}

export function setReady(id: string, role: DuoRole): DuoRoom | null {
  const room = getRoom(id);
  if (!room) return null;
  if (role === "host") room.hostReady = true;
  else {
    if (!room.guestJoined) return null;
    room.guestReady = true;
  }
  return room;
}

export function submitVotes(
  id: string,
  role: DuoRole,
  likedIds: string[],
): DuoRoom | null {
  const room = getRoom(id);
  if (!room) return null;
  if (!room.hostReady || !room.guestReady) return null;
  if (role === "host") room.hostLikes = likedIds;
  else room.guestLikes = likedIds;
  return room;
}

export function computeMatch(room: DuoRoom): Plan | null {
  if (!room.hostLikes || !room.guestLikes) return null;
  const guestSet = new Set(room.guestLikes);
  const intersection = room.hostLikes.filter((id) => guestSet.has(id));
  const byId = new Map(room.deck.map((p) => [p.id, p]));
  for (const id of intersection) {
    const plan = byId.get(id);
    if (plan) return plan;
  }
  // Fallback: first deck item both saw if intersection empty — return null
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

