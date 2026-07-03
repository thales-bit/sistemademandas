import { NextResponse } from "next/server";
import { gerarKitBoasVindas } from "@/lib/anthropic";

export async function POST(req: Request) {
  const { clienteId } = await req.json();
  if (!clienteId) {
    return NextResponse.json({ erro: "Cliente não informado" }, { status: 400 });
  }
  try {
    const texto = await gerarKitBoasVindas(clienteId);
    return NextResponse.json({ texto });
  } catch (e) {
    return NextResponse.json(
      { erro: "Falha ao gerar kit", detalhe: String(e) },
      { status: 500 }
    );
  }
}
