import Anthropic from "@anthropic-ai/sdk";
import type { Demanda } from "./types";
import { getCliente } from "./data";

// Modelo da Claude usado pelo assistente jurídico.
const MODELO = "claude-opus-4-8";

// Cria o cliente apenas se houver chave configurada. Sem chave, o sistema
// cai num modo simulado (mock) para o protótipo navegar sem configuração.
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

function contextoDaDemanda(d: Demanda): string {
  const cliente = getCliente(d.clienteId);
  const arquivos = d.arquivos.map((a) => `- ${a.nome}`).join("\n");
  const andamentos = d.andamentos
    .map((a) => `- ${a.data}: ${a.descricao}`)
    .join("\n");
  return [
    `Cliente: ${cliente?.nome ?? "—"}`,
    `Demanda: ${d.titulo}`,
    `Área do Direito: ${d.area}`,
    `Status: ${d.status}`,
    d.numeroProcesso ? `Nº do processo: ${d.numeroProcesso}` : "",
    `Descrição: ${d.descricao}`,
    arquivos ? `Documentos anexados:\n${arquivos}` : "",
    andamentos ? `Andamentos:\n${andamentos}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function chamar(system: string, prompt: string): Promise<string> {
  const client = getClient();
  if (!client) {
    return "[modo simulado — sem chave de API configurada]";
  }
  const resp = await client.messages.create({
    model: MODELO,
    max_tokens: 1500,
    system,
    messages: [{ role: "user", content: prompt }],
  });
  return resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export async function gerarResumo(d: Demanda): Promise<string> {
  const system =
    "Você é um assistente jurídico de um escritório de advocacia brasileiro. " +
    "Resuma o andamento de demandas de forma objetiva, em português, em até 4 frases. " +
    "Destaque a situação atual e o próximo passo. Não invente fatos além do contexto.";
  const texto = await chamar(system, `Resuma esta demanda:\n\n${contextoDaDemanda(d)}`);
  if (texto.startsWith("[modo simulado")) {
    return (
      d.resumoIA ??
      `Resumo automático (simulado) da demanda "${d.titulo}". Configure ANTHROPIC_API_KEY para gerar resumos reais com IA a partir dos documentos e andamentos.`
    );
  }
  return texto;
}

export async function gerarMinuta(d: Demanda, tipo: string): Promise<string> {
  const system =
    "Você é um assistente jurídico de um escritório de advocacia brasileiro. " +
    "Redija minutas de documentos em português formal, prontas para revisão de um advogado. " +
    "Use linguagem técnica adequada e deixe campos entre colchetes [assim] quando faltar informação.";
  const texto = await chamar(
    system,
    `Redija um(a) "${tipo}" referente à seguinte demanda:\n\n${contextoDaDemanda(d)}`
  );
  if (texto.startsWith("[modo simulado")) {
    return minutaSimulada(d, tipo);
  }
  return texto;
}

function minutaSimulada(d: Demanda, tipo: string): string {
  const cliente = getCliente(d.clienteId);
  return [
    `[MINUTA SIMULADA — ${tipo}]`,
    "",
    `Prezado(a),`,
    "",
    `Referente à demanda "${d.titulo}"${
      d.numeroProcesso ? ` (processo nº ${d.numeroProcesso})` : ""
    } do cliente ${cliente?.nome ?? "[cliente]"}, vimos por meio deste documento tratar do assunto em referência.`,
    "",
    `[Conteúdo gerado automaticamente seria inserido aqui. Configure a variável ANTHROPIC_API_KEY para que a IA redija a minuta completa com base no contexto da demanda.]`,
    "",
    `Atenciosamente,`,
    `${d.responsavel}`,
    `SWZ Advogados`,
  ].join("\n");
}
