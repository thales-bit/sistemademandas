import Anthropic from "@anthropic-ai/sdk";
import type { Demanda } from "./types";
import { getCliente, getDemandasDoCliente } from "./data";

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

export async function gerarKitBoasVindas(clienteId: string): Promise<string> {
  const cliente = getCliente(clienteId);
  if (!cliente) return "Cliente não encontrado.";
  const demandas = getDemandasDoCliente(clienteId);
  const contexto = [
    `Cliente: ${cliente.nome} (${cliente.tipo})`,
    `Contato: ${cliente.email} · ${cliente.telefone}`,
    demandas.length
      ? `Demandas: ${demandas.map((d) => `${d.titulo} (${d.area})`).join("; ")}`
      : "Sem demandas cadastradas ainda.",
  ].join("\n");

  const system =
    "Você é um assistente de um escritório de advocacia brasileiro. " +
    "Escreva uma mensagem de BOAS-VINDAS calorosa e profissional para um cliente que acabou de fechar, " +
    "pronta para enviar por WhatsApp ou e-mail. Em português, tom acolhedor e sério. " +
    "Inclua: agradecimento, o que esperar dos próximos passos, reforço de sigilo/transparência, " +
    "canais de contato e menção ao portal do cliente. Seja conciso (até ~180 palavras). " +
    "Use [colchetes] onde faltar informação.";

  const texto = await chamar(system, `Escreva o kit de boas-vindas para:\n\n${contexto}`);
  if (texto.startsWith("[modo simulado")) {
    return kitSimulado(cliente.nome);
  }
  return texto;
}

function kitSimulado(nome: string): string {
  return [
    `Olá, ${nome}! Seja muito bem-vindo(a) à SWZ Advogados. 🤝`,
    "",
    "É uma satisfação ter você conosco. A partir de agora, cuidaremos da sua demanda com total dedicação, sigilo e transparência.",
    "",
    "Próximos passos:",
    "• Você receberá acesso ao seu portal, onde acompanha tudo em um só lugar (demandas, documentos e cobranças).",
    "• Em breve, agendaremos uma breve reunião de alinhamento do seu caso.",
    "• Qualquer dúvida, fale com a gente pelo WhatsApp [número] ou por e-mail [e-mail].",
    "",
    "Conte conosco. Estamos à disposição!",
    "— Equipe SWZ Advogados",
    "",
    "[Mensagem de exemplo — configure a ANTHROPIC_API_KEY para a IA personalizar cada kit.]",
  ].join("\n");
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
