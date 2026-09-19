import { NextResponse } from "next/server";
import { getPublished } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const portfolio = await getPublished(id);
  if (!portfolio) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json(portfolio);
}
