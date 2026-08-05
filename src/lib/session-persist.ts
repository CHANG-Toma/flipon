import {
  HistoryStatus,
  MemberRole,
  Prisma,
  SessionStatus,
  SessionType,
} from "@prisma/client";
import type { Constraints, Plan } from "@/data/plans";
import type { DuoRole, DuoRoom } from "@/lib/duo-rooms";
import { getPrisma } from "@/lib/db";

const ACTIVE_MS = 24 * 60 * 60 * 1000;

export async function persistSessionCreated(input: {
  room: DuoRoom;
  type?: "DUO" | "GROUPE";
  partySize?: number;
  hostUserId?: string | null;
  hostDeviceKey: string;
}) {
  const prisma = getPrisma();
  if (!prisma) return;

  const type = input.type === "GROUPE" ? SessionType.GROUPE : SessionType.DUO;
  const partySize = input.partySize ?? (type === SessionType.GROUPE ? 4 : 2);

  await prisma.session.upsert({
    where: { id: input.room.id },
    create: {
      id: input.room.id,
      hostUserId: input.hostUserId ?? null,
      type,
      partySize,
      status: SessionStatus.LOBBY,
      constraints: input.room.constraints as Prisma.InputJsonValue,
      deck: input.room.deck as Prisma.InputJsonValue,
      expiresAt: new Date(input.room.createdAt + ACTIVE_MS),
      members: {
        create: {
          deviceKey: input.hostDeviceKey,
          role: MemberRole.HOST,
          userId: input.hostUserId ?? null,
        },
      },
    },
    update: {
      constraints: input.room.constraints as Prisma.InputJsonValue,
      deck: input.room.deck as Prisma.InputJsonValue,
      status: SessionStatus.LOBBY,
      expiresAt: new Date(input.room.createdAt + ACTIVE_MS),
    },
  });
}

export async function persistGuestJoined(input: {
  sessionId: string;
  deviceKey: string;
  userId?: string | null;
}) {
  const prisma = getPrisma();
  if (!prisma) return;

  await prisma.sessionMember.upsert({
    where: {
      sessionId_deviceKey: {
        sessionId: input.sessionId,
        deviceKey: input.deviceKey,
      },
    },
    create: {
      sessionId: input.sessionId,
      deviceKey: input.deviceKey,
      role: MemberRole.GUEST,
      userId: input.userId ?? null,
    },
    update: {
      userId: input.userId ?? undefined,
    },
  });
}

export async function persistSessionStatus(
  sessionId: string,
  status: SessionStatus,
) {
  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.session.updateMany({
    where: { id: sessionId },
    data: { status },
  });
}

export async function persistVotesAndMaybeComplete(input: {
  room: DuoRoom;
  likedIds: string[];
  deviceKey: string;
  match: Plan | null;
}) {
  const prisma = getPrisma();
  if (!prisma) return;

  const member = await prisma.sessionMember.findUnique({
    where: {
      sessionId_deviceKey: {
        sessionId: input.room.id,
        deviceKey: input.deviceKey,
      },
    },
  });
  if (!member) return;

  await prisma.vote.upsert({
    where: {
      sessionId_memberId: {
        sessionId: input.room.id,
        memberId: member.id,
      },
    },
    create: {
      sessionId: input.room.id,
      memberId: member.id,
      likedPlanIds: input.likedIds,
    },
    update: {
      likedPlanIds: input.likedIds,
      submittedAt: new Date(),
    },
  });

  const bothVoted =
    input.room.hostLikes !== null && input.room.guestLikes !== null;
  if (!bothVoted) {
    await prisma.session.updateMany({
      where: { id: input.room.id },
      data: { status: SessionStatus.VOTING },
    });
    return;
  }

  await prisma.session.update({
    where: { id: input.room.id },
    data: {
      status: SessionStatus.DONE,
      completedAt: new Date(),
      resultPlanId: input.match?.id ?? null,
      resultSnapshot: input.match
        ? (input.match as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull,
    },
  });

  const session = await prisma.session.findUnique({
    where: { id: input.room.id },
    include: { members: true },
  });
  if (!session) return;

  const historyStatus = input.match
    ? HistoryStatus.VALIDEE
    : HistoryStatus.SANS_MATCH;
  const title = input.match?.title ?? "Sans match";
  const durationMin = input.match?.durationMin ?? 0;

  for (const m of session.members) {
    if (!m.userId) continue;
    await prisma.historyItem.upsert({
      where: {
        userId_sessionId: {
          userId: m.userId,
          sessionId: session.id,
        },
      },
      create: {
        userId: m.userId,
        sessionId: session.id,
        title,
        type: session.type,
        durationMin,
        status: historyStatus,
        planId: input.match?.id ?? null,
      },
      update: {
        title,
        durationMin,
        status: historyStatus,
        planId: input.match?.id ?? null,
      },
    });
  }
}

export async function persistSessionClosed(sessionId: string) {
  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.session.updateMany({
    where: { id: sessionId },
    data: { status: SessionStatus.EXPIRED },
  });
}

export async function loadRoomFromPostgres(
  sessionId: string,
): Promise<DuoRoom | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId.toUpperCase() },
    include: { members: true, votes: { include: { member: true } } },
  });
  if (!session) return null;
  if (
    session.expiresAt.getTime() < Date.now() &&
    session.status !== SessionStatus.DONE
  ) {
    return null;
  }

  const hostVote = session.votes.find((v) => v.member.role === MemberRole.HOST);
  const guestVote = session.votes.find((v) => v.member.role === MemberRole.GUEST);
  const guestJoined = session.members.some((m) => m.role === MemberRole.GUEST);

  return {
    id: session.id,
    createdAt: session.createdAt.getTime(),
    constraints: session.constraints as Constraints,
    deck: session.deck as Plan[],
    guestJoined,
    hostReady:
      session.status === SessionStatus.VOTING ||
      session.status === SessionStatus.DONE,
    guestReady:
      session.status === SessionStatus.VOTING ||
      session.status === SessionStatus.DONE,
    hostLikes: hostVote ? (hostVote.likedPlanIds as string[]) : null,
    guestLikes: guestVote ? (guestVote.likedPlanIds as string[]) : null,
    completedAt: session.completedAt?.getTime(),
  };
}
