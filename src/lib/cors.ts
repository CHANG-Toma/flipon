import { NextResponse } from "next/server";

/** Allow Expo web / mobile previews to call the duo API. */
export function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Accept");
  return res;
}

export function corsPreflight() {
  return withCors(new NextResponse(null, { status: 204 }));
}
