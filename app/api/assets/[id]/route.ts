import { NextRequest, NextResponse } from "next/server";
import { deleteAsset } from "@/lib/assets";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteAsset(id);
  if (deleted) return NextResponse.json({ deleted: id });
  return NextResponse.json({ error: "Asset not found" }, { status: 404 });
}
