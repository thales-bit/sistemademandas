import type { Cliente, Demanda, Cobranca } from "./types";

// Dados de exemplo (mock). No protótipo eles vivem em memória.
// Quando o sistema for para produção, esta camada é trocada por um banco
// de dados real (ex.: PostgreSQL) sem mudar as telas.

export const clientes: Cliente[] = [
  {
    id: "cli-001",
    nome: "Construtora Horizonte Ltda.",
    tipo: "PJ",
    documento: "12.345.678/0001-90",
    email: "financeiro@horizonte.com.br",
    telefone: "(11) 3322-1100",
    desde: "2023-02-15",
  },
  {
    id: "cli-002",
    nome: "Mariana Alves Pereira",
    tipo: "PF",
    documento: "321.654.987-00",
    email: "mariana.alves@email.com",
    telefone: "(11) 99876-5432",
    desde: "2024-06-01",
  },
  {
    id: "cli-003",
    nome: "TechNova Sistemas S.A.",
    tipo: "PJ",
    documento: "98.765.432/0001-10",
    email: "juridico@technova.com",
    telefone: "(11) 4002-8922",
    desde: "2022-11-20",
  },
  {
    id: "cli-004",
    nome: "Roberto Carlos Menezes",
    tipo: "PF",
    documento: "147.258.369-00",
    email: "roberto.menezes@email.com",
    telefone: "(21) 98123-4567",
    desde: "2025-01-10",
  },
];

export const demandas: Demanda[] = [
  {
    id: "dem-1001",
    clienteId: "cli-001",
    titulo: "Ação de cobrança contra fornecedor inadimplente",
    numeroProcesso: "1002345-67.2024.8.26.0100",
    area: "Empresarial",
    status: "Em andamento",
    responsavel: "Dra. Helena Souza",
    abertaEm: "2024-09-12",
    prazo: "2026-07-10",
    descricao:
      "Cobrança de R$ 480.000,00 referente a contrato de fornecimento de materiais não entregues. Aguardando réplica após contestação.",
    resumoIA:
      "Processo movido contra fornecedor por descumprimento de contrato de fornecimento (R$ 480 mil). Réu apresentou contestação alegando caso fortuito. Próximo passo: protocolar réplica até 10/07. Provas documentais (notas e e-mails) já anexadas.",
    arquivos: [
      { id: "arq-1", nome: "peticao-inicial.pdf", tipo: "pdf", tamanhoKb: 842, enviadoEm: "2024-09-12", enviadoPor: "Dra. Helena Souza" },
      { id: "arq-2", nome: "contrato-fornecimento.pdf", tipo: "pdf", tamanhoKb: 1204, enviadoEm: "2024-09-12", enviadoPor: "Dra. Helena Souza" },
      { id: "arq-3", nome: "contestacao-reu.pdf", tipo: "pdf", tamanhoKb: 655, enviadoEm: "2025-03-04", enviadoPor: "Sistema (PJe)" },
    ],
    andamentos: [
      { data: "2024-09-12", descricao: "Distribuição da ação.", autor: "Dra. Helena Souza" },
      { data: "2025-01-20", descricao: "Citação do réu efetivada.", autor: "Sistema" },
      { data: "2025-03-04", descricao: "Juntada de contestação.", autor: "Sistema" },
    ],
  },
  {
    id: "dem-1002",
    clienteId: "cli-002",
    titulo: "Reclamação trabalhista — verbas rescisórias",
    numeroProcesso: "1009876-54.2025.5.02.0010",
    area: "Trabalhista",
    status: "Aguardando prazo",
    responsavel: "Dr. Paulo Ribeiro",
    abertaEm: "2025-04-22",
    prazo: "2026-07-05",
    descricao:
      "Pleito de verbas rescisórias não pagas, horas extras e adicional noturno após demissão sem justa causa.",
    resumoIA:
      "Reclamação trabalhista por verbas rescisórias, horas extras e adicional noturno. Audiência inicial realizada sem acordo. Aguardando apresentação de defesa pela reclamada até 05/07.",
    arquivos: [
      { id: "arq-4", nome: "ctps-digital.pdf", tipo: "pdf", tamanhoKb: 320, enviadoEm: "2025-04-22", enviadoPor: "Mariana Alves" },
      { id: "arq-5", nome: "holerites-2024.pdf", tipo: "pdf", tamanhoKb: 980, enviadoEm: "2025-04-22", enviadoPor: "Mariana Alves" },
    ],
    andamentos: [
      { data: "2025-04-22", descricao: "Ajuizamento da reclamação.", autor: "Dr. Paulo Ribeiro" },
      { data: "2025-06-15", descricao: "Audiência inicial sem acordo.", autor: "Dr. Paulo Ribeiro" },
    ],
  },
  {
    id: "dem-1003",
    clienteId: "cli-003",
    titulo: "Revisão de contratos de licenciamento de software",
    area: "Empresarial",
    status: "Aguardando cliente",
    responsavel: "Dra. Helena Souza",
    abertaEm: "2025-05-30",
    descricao:
      "Análise e revisão de 12 contratos de licenciamento SaaS, com foco em cláusulas de responsabilidade e LGPD.",
    resumoIA:
      "Revisão de 12 contratos SaaS com foco em limitação de responsabilidade e conformidade com a LGPD. 8 contratos revisados; aguardando o cliente enviar os 4 restantes.",
    arquivos: [
      { id: "arq-6", nome: "contrato-modelo-saas.docx", tipo: "docx", tamanhoKb: 145, enviadoEm: "2025-05-30", enviadoPor: "TechNova" },
    ],
    andamentos: [
      { data: "2025-05-30", descricao: "Recebimento dos contratos para análise.", autor: "Dra. Helena Souza" },
      { data: "2025-06-18", descricao: "Entrega da primeira leva de revisões.", autor: "Dra. Helena Souza" },
    ],
  },
  {
    id: "dem-1004",
    clienteId: "cli-004",
    titulo: "Ação de divórcio consensual",
    numeroProcesso: "1005544-33.2025.8.19.0001",
    area: "Família",
    status: "Concluída",
    responsavel: "Dr. Paulo Ribeiro",
    abertaEm: "2025-02-10",
    descricao: "Divórcio consensual com partilha de bens e guarda compartilhada.",
    resumoIA:
      "Divórcio consensual homologado em 1ª instância. Partilha e guarda compartilhada definidas. Processo concluído com êxito.",
    arquivos: [
      { id: "arq-7", nome: "acordo-divorcio.pdf", tipo: "pdf", tamanhoKb: 410, enviadoEm: "2025-02-10", enviadoPor: "Dr. Paulo Ribeiro" },
      { id: "arq-8", nome: "sentenca-homologatoria.pdf", tipo: "pdf", tamanhoKb: 290, enviadoEm: "2025-05-12", enviadoPor: "Sistema" },
    ],
    andamentos: [
      { data: "2025-02-10", descricao: "Protocolo da petição de divórcio.", autor: "Dr. Paulo Ribeiro" },
      { data: "2025-05-12", descricao: "Sentença homologatória publicada.", autor: "Sistema" },
    ],
  },
];

export const cobrancas: Cobranca[] = [
  {
    id: "cob-001",
    clienteId: "cli-001",
    demandaId: "dem-1001",
    descricao: "Honorários iniciais — Ação de cobrança",
    valor: 8000,
    parcela: 1,
    totalParcelas: 1,
    vencimento: "2024-09-20",
    status: "Paga",
    pagoEm: "2024-09-19",
  },
  {
    id: "cob-002",
    clienteId: "cli-001",
    demandaId: "dem-1001",
    descricao: "Honorários — êxito parcial (1ª parcela)",
    valor: 6000,
    parcela: 1,
    totalParcelas: 3,
    vencimento: "2026-07-15",
    status: "Em aberto",
  },
  {
    id: "cob-003",
    clienteId: "cli-002",
    demandaId: "dem-1002",
    descricao: "Honorários contratuais — Reclamação trabalhista",
    valor: 3500,
    parcela: 2,
    totalParcelas: 4,
    vencimento: "2026-06-10",
    status: "Atrasada",
  },
  {
    id: "cob-004",
    clienteId: "cli-003",
    demandaId: "dem-1003",
    descricao: "Consultoria — revisão contratual (mensal)",
    valor: 12000,
    parcela: 3,
    totalParcelas: 6,
    vencimento: "2026-07-05",
    status: "Em aberto",
  },
  {
    id: "cob-005",
    clienteId: "cli-004",
    demandaId: "dem-1004",
    descricao: "Honorários — Divórcio consensual",
    valor: 4500,
    parcela: 1,
    totalParcelas: 1,
    vencimento: "2025-05-20",
    status: "Paga",
    pagoEm: "2025-05-18",
  },
  {
    id: "cob-006",
    clienteId: "cli-003",
    descricao: "Consultoria — revisão contratual (mensal)",
    valor: 12000,
    parcela: 2,
    totalParcelas: 6,
    vencimento: "2026-06-05",
    status: "Atrasada",
  },
];

// ----- Helpers de consulta -----

export function getCliente(id: string) {
  return clientes.find((c) => c.id === id);
}

export function getDemanda(id: string) {
  return demandas.find((d) => d.id === id);
}

export function getDemandasDoCliente(clienteId: string) {
  return demandas.filter((d) => d.clienteId === clienteId);
}

export function getCobrancasDoCliente(clienteId: string) {
  return cobrancas.filter((c) => c.clienteId === clienteId);
}

export function nomeCliente(clienteId: string) {
  return getCliente(clienteId)?.nome ?? "—";
}

// Jornada de Boas-vindas: passo atual de cada cliente (1..6, 7 = concluída)
export const jornadas: { clienteId: string; passoAtual: number }[] = [
  { clienteId: "cli-001", passoAtual: 6 },
  { clienteId: "cli-002", passoAtual: 4 },
  { clienteId: "cli-003", passoAtual: 5 },
  { clienteId: "cli-004", passoAtual: 7 },
];

export function getPassoAtual(clienteId: string) {
  return jornadas.find((j) => j.clienteId === clienteId)?.passoAtual ?? 1;
}
