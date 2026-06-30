import { NextResponse } from "next/server";
import { getDemandaById } from "@/lib/db";
import { gerarResumo } from "@/lib/anthropic";

export async function POST(req: Request) {
  const { demandaId } = await req.json();
  const demanda = await getDemandaById(demandaId);
  if (!demanda) {
    return NextResponse.json({ erro: "Demanda não encontrada" }, { status: 404 });
  }
  try {
    const texto = await gerarResumo(demanda);
    return NextResponse.json({ texto });
  } catch (e) {
    return NextResponse.json(
      { erro: "Falha ao gerar resumo", detalhe: String(e) },
      { status: 500 }
    );
  }
}
