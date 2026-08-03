import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  clear?: string;
  friction?: string;
  withWho?: string;
  email?: string;
};

export async function POST(req: NextRequest) {
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

  const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.FEEDBACK_TO_EMAIL;

  if (web3Key) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: web3Key,
        subject: "Retour démo FlipOn",
        from_name: "FlipOn Demo",
        email: email || "noreply@flipon.app",
        message,
        clear,
        friction,
        withWho,
      }),
    });
    const data = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok || !data.success) {
      return NextResponse.json(
        { error: data.message ?? "Envoi impossible (Web3Forms)" },
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
        from: process.env.FEEDBACK_FROM_EMAIL || "FlipOn <onboarding@resend.dev>",
        to: [toEmail],
        subject: "Retour démo FlipOn",
        text: message,
        reply_to: email || undefined,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Envoi impossible (Resend): ${errText}` },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    {
      error:
        "Feedback non configuré. Ajoute WEB3FORMS_ACCESS_KEY (ou RESEND_API_KEY + FEEDBACK_TO_EMAIL) sur Vercel.",
    },
    { status: 503 },
  );
}
