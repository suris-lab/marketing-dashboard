import { NextRequest, NextResponse } from "next/server";
import { deleteAsset } from "@/lib/assets";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = await deleteAsset(params.id);
  if (deleted) return NextResponse.json({ deleted: params.id });
  return NextResponse.json({ error: "Asset not found" }, { status: 404 });
}
