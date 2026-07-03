import { getSupabase } from "./supabase";
import * as mock from "./data";
import type { Cliente, Demanda, Cobranca, Arquivo, Andamento } from "./types";

// ============================================================================
// Camada de acesso a dados.
// Cada função consulta o Supabase quando configurado; caso contrário, retorna
// os dados de exemplo (mock). As telas chamam apenas estas funções, então a
// troca de "exemplo" para "banco real" é transparente.
// ============================================================================

// ----- Mapeadores: linha do banco (snake_case) -> tipo do app (camelCase) ---

function mapCliente(r: any): Cliente {
  return {
    id: r.id,
    nome: r.nome,
    tipo: r.tipo,
    documento: r.documento,
    email: r.email ?? "",
    telefone: r.telefone ?? "",
    desde: r.desde,
  };
}

function mapAndamento(r: any): Andamento {
  return { data: r.data, descricao: r.descricao, autor: r.autor ?? "" };
}

function mapArquivo(r: any): Arquivo {
  return {
    id: r.id,
    nome: r.nome,
    tipo: r.tipo ?? "",
    tamanhoKb: r.tamanho_kb ?? 0,
    enviadoEm: r.enviado_em,
    enviadoPor: r.enviado_por ?? "",
  };
}

function mapDemanda(r: any): Demanda {
  return {
    id: r.id,
    clienteId: r.cliente_id,
    titulo: r.titulo,
    numeroProcesso: r.numero_processo ?? undefined,
    area: r.area,
    status: r.status,
    responsavel: r.responsavel ?? "",
    abertaEm: r.aberta_em,
    prazo: r.prazo ?? undefined,
    descricao: r.descricao ?? "",
    resumoIA: r.resumo_ia ?? undefined,
    arquivos: (r.arquivos ?? []).map(mapArquivo),
    andamentos: (r.andamentos ?? [])
      .map(mapAndamento)
      .sort((a: Andamento, b: Andamento) => a.data.localeCompare(b.data)),
  };
}

function mapCobranca(r: any): Cobranca {
  return {
    id: r.id,
    clienteId: r.cliente_id,
    demandaId: r.demanda_id ?? undefined,
    descricao: r.descricao,
    valor: Number(r.valor),
    parcela: r.parcela,
    totalParcelas: r.total_parcelas,
    vencimento: r.vencimento,
    status: r.status,
    pagoEm: r.pago_em ?? undefined,
  };
}

// ----- Consultas -----------------------------------------------------------

export async function getClientes(): Promise<Cliente[]> {
  const sb = getSupabase();
  if (!sb) return mock.clientes;
  const { data, error } = await sb.from("clientes").select("*").order("nome");
  if (error) throw error;
  return (data ?? []).map(mapCliente);
}

export async function getDemandas(): Promise<Demanda[]> {
  const sb = getSupabase();
  if (!sb) return mock.demandas;
  const { data, error } = await sb
    .from("demandas")
    .select("*, arquivos(*), andamentos(*)")
    .order("aberta_em", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapDemanda);
}

export async function getDemandaById(id: string): Promise<Demanda | undefined> {
  const sb = getSupabase();
  if (!sb) return mock.getDemanda(id);
  const { data, error } = await sb
    .from("demandas")
    .select("*, arquivos(*), andamentos(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapDemanda(data) : undefined;
}

export async function getCobrancas(): Promise<Cobranca[]> {
  const sb = getSupabase();
  if (!sb) return mock.cobrancas;
  const { data, error } = await sb
    .from("cobrancas")
    .select("*")
    .order("vencimento");
  if (error) throw error;
  return (data ?? []).map(mapCobranca);
}

// Monta um mapa id -> nome do cliente, útil nas listagens.
export async function mapaNomesClientes(): Promise<Record<string, string>> {
  const clientes = await getClientes();
  return Object.fromEntries(clientes.map((c) => [c.id, c.nome]));
}

// Jornada de Boas-vindas: mapa clienteId -> passo atual (1..6, 7 = concluída).
export async function mapaPassoAtual(): Promise<Record<string, number>> {
  const sb = getSupabase();
  if (!sb) {
    return Object.fromEntries(mock.jornadas.map((j) => [j.clienteId, j.passoAtual]));
  }
  const { data, error } = await sb.from("boas_vindas").select("cliente_id, passo_atual");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r: any) => [r.cliente_id, r.passo_atual]));
}
