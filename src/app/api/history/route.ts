import { NextResponse } from "next/server";
import { resolveDbUser } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import { getPrisma, hasDatabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET(req: Request) {
  if (!hasDatabase()) {
    return withCors(
      NextResponse.json({ error: "Base de données non configurée." }, { status: 503 }),
    );
  }

  const user = await resolveDbUser(req);
  if (!user) {
    return withCors(
      NextResponse.json({ error: "Non authentifié." }, { status: 401 }),
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return withCors(
      NextResponse.json({ error: "Base de données non configurée." }, { status: 503 }),
    );
  }

  const items = await prisma.historyItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return withCors(
    NextResponse.json({
      items: items.map((item) => ({
        id: item.sessionId,
        title: item.title,
        type: item.type === "GROUPE" ? "Groupe" : "Duo",
        durationMin: item.durationMin,
        status:
          item.status === "VALIDEE"
            ? "Validée"
            : item.status === "SANS_MATCH"
              ? "Sans match"
              : "Expirée",
        createdAt: item.createdAt.getTime(),
        planId: item.planId ?? undefined,
      })),
    }),
  );
}
