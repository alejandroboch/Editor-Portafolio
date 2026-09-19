import { NextResponse } from "next/server";
import { savePublished } from "@/lib/store";
import type { Portfolio } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const portfolio = (await request.json()) as Portfolio;
    if (!portfolio?.profile || !portfolio?.appearance) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    const publicId = await savePublished(portfolio);
    return NextResponse.json({ publicId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo publicar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
