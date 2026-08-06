import { NextResponse } from "next/server";

/**
 * Allow Expo web / mobile previews to call the API.
 * Authorization + device key are required for auth-bound routes (/me, /history).
 */
export function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization, X-Flipon-Device-Key",
  );
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}

export function corsPreflight() {
  return withCors(new NextResponse(null, { status: 204 }));
}
