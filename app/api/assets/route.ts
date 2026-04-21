import { NextRequest, NextResponse } from "next/server";
import { listAssets, addAsset } from "@/lib/assets";

export async function GET() {
  const assets = await listAssets();
  return NextResponse.json(assets);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const required = ["name", "platform", "type", "url"];
  if (!required.every((k) => k in body)) {
    return NextResponse.json(
      { error: "Missing required fields: name, platform, type, url" },
      { status: 400 }
    );
  }
  const asset = await addAsset(body.name, body.platform, body.type, body.url);
  return NextResponse.json(asset, { status: 201 });
}
