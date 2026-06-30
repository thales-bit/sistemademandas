import type { StatusCobranca, StatusDemanda } from "@/lib/types";

const coresDemanda: Record<StatusDemanda, string> = {
  "Em andamento": "bg-blue-100 text-blue-700",
  "Aguardando cliente": "bg-amber-100 text-amber-700",
  "Aguardando prazo": "bg-purple-100 text-purple-700",
  Concluída: "bg-emerald-100 text-emerald-700",
  Arquivada: "bg-slate-100 text-slate-600",
};

export function StatusDemandaBadge({ status }: { status: StatusDemanda }) {
  return <span className={`badge ${coresDemanda[status]}`}>{status}</span>;
}

const coresCobranca: Record<StatusCobranca, string> = {
  Paga: "bg-emerald-100 text-emerald-700",
  "Em aberto": "bg-blue-100 text-blue-700",
  Atrasada: "bg-red-100 text-red-700",
};

export function StatusCobrancaBadge({ status }: { status: StatusCobranca }) {
  return <span className={`badge ${coresCobranca[status]}`}>{status}</span>;
}
