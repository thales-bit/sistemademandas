// Jornada de Boas-vindas do cliente — a lógica dos 6 passos que o escritório
// executa "depois que o cliente diz sim", inspirada no fluxo de onboarding
// premium, adaptada para a advocacia.

export interface PassoDef {
  n: number;
  titulo: string;
  descricao: string;
  tagConcluido: string; // rótulo quando o passo está feito
}

export const PASSOS_BOAS_VINDAS: PassoDef[] = [
  {
    n: 1,
    titulo: "Contrato & procuração",
    descricao: "Nada anda antes de assinar. Protege o cliente e o escritório.",
    tagConcluido: "Assinado",
  },
  {
    n: 2,
    titulo: "Kit de boas-vindas",
    descricao: "Mensagem calorosa: como funciona, prazos, sigilo e o link do portal.",
    tagConcluido: "Enviado",
  },
  {
    n: 3,
    titulo: "Cobrança de honorários",
    descricao: "Primeira cobrança clara, com condições e forma de pagamento.",
    tagConcluido: "Gerada",
  },
  {
    n: 4,
    titulo: "Portal liberado",
    descricao: "Acesso ao portal: demandas, documentos, andamentos e cobranças.",
    tagConcluido: "Liberado",
  },
  {
    n: 5,
    titulo: "Reunião de estratégia",
    descricao: "Alinhamento inicial do caso, com agendamento e link da reunião.",
    tagConcluido: "Realizada",
  },
  {
    n: 6,
    titulo: "Acompanhamento",
    descricao: "Andamentos, peças e atualizações entregues de forma organizada.",
    tagConcluido: "Em curso",
  },
];

export const TOTAL_PASSOS = PASSOS_BOAS_VINDAS.length;

export type StatusPasso = "concluido" | "atual" | "pendente";

export interface PassoJornada extends PassoDef {
  status: StatusPasso;
  tag: string;
}

// Dado o passo atual (1..6, ou 7 = jornada concluída), devolve os 6 passos
// já com o status calculado.
export function montarJornada(passoAtual: number): PassoJornada[] {
  return PASSOS_BOAS_VINDAS.map((p) => {
    let status: StatusPasso;
    if (p.n < passoAtual) status = "concluido";
    else if (p.n === passoAtual) status = "atual";
    else status = "pendente";
    return {
      ...p,
      status,
      tag:
        status === "concluido"
          ? p.tagConcluido
          : status === "atual"
          ? "Em andamento"
          : "Pendente",
    };
  });
}

// Percentual de conclusão (0-100) para a barra de progresso.
export function progressoJornada(passoAtual: number): number {
  const concluidos = Math.min(Math.max(passoAtual - 1, 0), TOTAL_PASSOS);
  return Math.round((concluidos / TOTAL_PASSOS) * 100);
}
