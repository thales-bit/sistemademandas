// Modelo de domínio do sistema de gestão de demandas jurídicas.

export type Perfil = "admin" | "equipe" | "cliente";

export type TipoPessoa = "PF" | "PJ";

export interface Cliente {
  id: string;
  nome: string;
  tipo: TipoPessoa;
  documento: string; // CPF ou CNPJ
  email: string;
  telefone: string;
  desde: string; // ISO date
}

export type StatusDemanda =
  | "Em andamento"
  | "Aguardando cliente"
  | "Aguardando prazo"
  | "Concluída"
  | "Arquivada";

export type AreaDireito =
  | "Cível"
  | "Trabalhista"
  | "Tributário"
  | "Empresarial"
  | "Família"
  | "Consumidor"
  | "Penal";

export interface Arquivo {
  id: string;
  nome: string;
  tipo: string; // pdf, docx, jpg...
  tamanhoKb: number;
  enviadoEm: string; // ISO date
  enviadoPor: string;
}

export interface Andamento {
  data: string; // ISO date
  descricao: string;
  autor: string;
}

export interface Demanda {
  id: string;
  clienteId: string;
  titulo: string;
  numeroProcesso?: string;
  area: AreaDireito;
  status: StatusDemanda;
  responsavel: string;
  abertaEm: string; // ISO date
  prazo?: string; // ISO date
  descricao: string;
  resumoIA?: string;
  arquivos: Arquivo[];
  andamentos: Andamento[];
}

export type StatusCobranca = "Paga" | "Em aberto" | "Atrasada";

export interface Cobranca {
  id: string;
  clienteId: string;
  demandaId?: string;
  descricao: string;
  valor: number; // em reais
  parcela: number;
  totalParcelas: number;
  vencimento: string; // ISO date
  status: StatusCobranca;
  pagoEm?: string; // ISO date
}
