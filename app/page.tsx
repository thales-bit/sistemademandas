import Link from "next/link";
import Topbar from "@/components/Topbar";
import { StatusDemandaBadge, StatusCobrancaBadge } from "@/components/Badges";
import { getClientes, getDemandas, getCobrancas, mapaNomesClientes } from "@/lib/db";
import { brl, dataBR, diasAte } from "@/lib/format";

export const dynamic = "force-dynamic";

function Stat({ label, valor, hint, tom }: { label: string; valor: string; hint?: string; tom?: string }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`mono mt-1 text-2xl ${tom ?? "text-brand-900"}`}>{valor}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

export default async function Painel() {
  const [clientes, demandas, cobrancas, nomes] = await Promise.all([
    getClientes(),
    getDemandas(),
    getCobrancas(),
    mapaNomesClientes(),
  ]);
  const nomeCliente = (id: string) => nomes[id] ?? "—";

  const demandasAtivas = demandas.filter((d) => d.status !== "Concluída" && d.status !== "Arquivada");
  const emAberto = cobrancas.filter((c) => c.status !== "Paga");
  const totalAberto = emAberto.reduce((s, c) => s + c.valor, 0);
  const atrasadas = cobrancas.filter((c) => c.status === "Atrasada");
  const totalAtrasado = atrasadas.reduce((s, c) => s + c.valor, 0);
  const recebido = cobrancas.filter((c) => c.status === "Paga").reduce((s, c) => s + c.valor, 0);
  const totalReceber = totalAberto; // aberto já inclui atrasadas

  // Prazos próximos (demandas com prazo nos próximos 30 dias)
  const prazos = demandas
    .filter((d) => d.prazo && (diasAte(d.prazo) ?? 999) <= 30 && (diasAte(d.prazo) ?? -1) >= -30)
    .sort((a, b) => (diasAte(a.prazo) ?? 0) - (diasAte(b.prazo) ?? 0));

  return (
    <>
      <Topbar titulo="Painel" subtitulo="Visão geral do escritório" />
      <div className="flex-1 space-y-6 p-8">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          {/* número-herói */}
          <div className="card streak hero-glow p-7">
            <div className="eyebrow">Total a receber</div>
            <div className="mono mt-3 text-4xl leading-none" style={{ color: "var(--text)" }}>
              {brl(totalReceber)}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs" style={{ color: "var(--muted)" }}>
              <span>
                Recebido: <b className="mono" style={{ color: "var(--text)" }}>{brl(recebido)}</b>
              </span>
              <span>
                Em atraso: <b className="mono" style={{ color: "var(--danger)" }}>{brl(totalAtrasado)}</b>
              </span>
            </div>
          </div>
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Clientes ativos" valor={String(clientes.length)} />
            <Stat label="Demandas em andamento" valor={String(demandasAtivas.length)} hint={`${demandas.length} no total`} />
            <Stat label="Em aberto" valor={brl(totalAberto - totalAtrasado)} hint={`${emAberto.length - atrasadas.length} cobranças`} />
            <Stat label="Em atraso" valor={brl(totalAtrasado)} hint={`${atrasadas.length} cobranças`} tom="text-red-600" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Prazos próximos */}
          <section className="card">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-brand-900">Prazos próximos</h2>
              <Link href="/demandas" className="text-sm text-brand-600 hover:underline">
                Ver demandas
              </Link>
            </div>
            <ul className="divide-y divide-slate-100">
              {prazos.length === 0 && <li className="px-5 py-4 text-sm text-slate-400">Sem prazos próximos.</li>}
              {prazos.map((d) => {
                const dias = diasAte(d.prazo);
                const urgente = (dias ?? 0) <= 7;
                return (
                  <li key={d.id} className="flex items-center justify-between px-5 py-3">
                    <div className="min-w-0">
                      <Link href={`/demandas/${d.id}`} className="block truncate text-sm font-medium text-brand-800 hover:underline">
                        {d.titulo}
                      </Link>
                      <div className="text-xs text-slate-400">{nomeCliente(d.clienteId)}</div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm text-slate-600">{dataBR(d.prazo)}</div>
                      <div className={`text-xs ${urgente ? "text-red-600" : "text-slate-400"}`}>
                        {dias === 0 ? "hoje" : dias && dias > 0 ? `em ${dias} dias` : `${Math.abs(dias ?? 0)} dias atrás`}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Cobranças a receber */}
          <section className="card">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-brand-900">Cobranças a receber</h2>
              <Link href="/cobrancas" className="text-sm text-brand-600 hover:underline">
                Ver cobranças
              </Link>
            </div>
            <ul className="divide-y divide-slate-100">
              {emAberto.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-brand-800">{c.descricao}</div>
                    <div className="text-xs text-slate-400">
                      {nomeCliente(c.clienteId)} · vence {dataBR(c.vencimento)}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-brand-900">{brl(c.valor)}</span>
                    <StatusCobrancaBadge status={c.status} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Demandas recentes */}
        <section className="card">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-brand-900">Demandas recentes</h2>
            <Link href="/demandas" className="text-sm text-brand-600 hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {demandas.map((d) => (
              <Link
                key={d.id}
                href={`/demandas/${d.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-brand-800">{d.titulo}</div>
                  <div className="text-xs text-slate-400">
                    {nomeCliente(d.clienteId)} · {d.area} · {d.responsavel}
                  </div>
                </div>
                <StatusDemandaBadge status={d.status} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
