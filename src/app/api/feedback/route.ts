import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  clear?: string;
  friction?: string;
  withWho?: string;
  email?: string;
};

async function readJsonSafe(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { message: text.slice(0, 200) };
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: Body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
    }

    const clear = (body.clear ?? "").trim();
    const friction = (body.friction ?? "").trim();
    const withWho = (body.withWho ?? "").trim();
    const email = (body.email ?? "").trim();

    if (!clear && !friction && !withWho) {
      return NextResponse.json(
        { error: "Écris au moins un retour dans un des champs." },
        { status: 400 },
      );
    }

    const message = [
      "Retour démo FlipOn (/test)",
      "",
      `Ce qui était clair : ${clear || "—"}`,
      `Ce qui a freiné : ${friction || "—"}`,
      `Je l’utiliserais avec : ${withWho || "—"}`,
      `Email testeur : ${email || "non renseigné"}`,
      "",
      `Date : ${new Date().toISOString()}`,
    ].join("\n");

    const web3Key = process.env.WEB3FORMS_ACCESS_KEY?.trim();
    const resendKey = process.env.RESEND_API_KEY?.trim();
    const toEmail = process.env.FEEDBACK_TO_EMAIL?.trim();

    if (web3Key) {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3Key,
          subject: "Retour démo FlipOn",
          from_name: "FlipOn Demo",
          name: "FlipOn testeur",
          email: email || "noreply@flipon.app",
          message,
        }),
      });
      const data = await readJsonSafe(res);
      const ok = data.success === true || res.ok;
      if (!ok) {
        return NextResponse.json(
          {
            error:
              (typeof data.message === "string" && data.message) ||
              "Envoi impossible (Web3Forms). Vérifie ta clé d’accès.",
          },
          { status: 502 },
        );
      }
      return NextResponse.json({ ok: true });
    }

    if (resendKey && toEmail) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.FEEDBACK_FROM_EMAIL ||
            "FlipOn <onboarding@resend.dev>",
          to: [toEmail],
          subject: "Retour démo FlipOn",
          text: message,
          reply_to: email || undefined,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json(
          { error: `Envoi impossible (Resend): ${errText.slice(0, 200)}` },
          { status: 502 },
        );
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      {
        error:
          "Feedback non configuré. Ajoute WEB3FORMS_ACCESS_KEY sur Vercel, puis redeploy.",
      },
      { status: 503 },
    );
  } catch (err) {
    console.error("[feedback]", err);
    return NextResponse.json(
      { error: "Erreur serveur pendant l’envoi. Réessaie." },
      { status: 500 },
    );
  }
}
