import Topbar from "@/components/Topbar";
import { StatusCobrancaBadge } from "@/components/Badges";
import { getCobrancas, getDemandas, mapaNomesClientes } from "@/lib/db";
import { brl, dataBR, diasAte } from "@/lib/format";

export const dynamic = "force-dynamic";

function Stat({ label, valor, tom, hint }: { label: string; valor: string; tom?: string; hint?: string }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`mono mt-1 text-2xl ${tom ?? "text-brand-900"}`}>{valor}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

export default async function CobrancasPage() {
  const [cobrancas, demandas, nomes] = await Promise.all([
    getCobrancas(),
    getDemandas(),
    mapaNomesClientes(),
  ]);
  const nomeCliente = (id: string) => nomes[id] ?? "—";
  const demandaPorId = (id?: string) => (id ? demandas.find((d) => d.id === id) : undefined);

  const recebido = cobrancas.filter((c) => c.status === "Paga").reduce((s, c) => s + c.valor, 0);
  const aberto = cobrancas.filter((c) => c.status === "Em aberto").reduce((s, c) => s + c.valor, 0);
  const atrasado = cobrancas.filter((c) => c.status === "Atrasada").reduce((s, c) => s + c.valor, 0);

  const ordenadas = [...cobrancas].sort((a, b) => a.vencimento.localeCompare(b.vencimento));

  return (
    <>
      <Topbar titulo="Cobranças" subtitulo="Honorários, parcelas e recebimentos" />
      <div className="flex-1 space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Recebido" valor={brl(recebido)} tom="text-emerald-600" />
          <Stat label="Em aberto" valor={brl(aberto)} tom="text-blue-600" />
          <Stat label="Em atraso" valor={brl(atrasado)} tom="text-red-600" />
          <Stat label="Total a receber" valor={brl(aberto + atrasado)} hint="aberto + atrasado" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button className="btn-ghost text-xs">Todas</button>
            <button className="btn-ghost text-xs">Em aberto</button>
            <button className="btn-ghost text-xs">Atrasadas</button>
            <button className="btn-ghost text-xs">Pagas</button>
          </div>
          <button className="btn-primary">+ Nova cobrança</button>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Descrição</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Parcela</th>
                <th className="px-5 py-3 font-medium">Vencimento</th>
                <th className="px-5 py-3 text-right font-medium">Valor</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ordenadas.map((c) => {
                const dias = diasAte(c.vencimento);
                const dem = demandaPorId(c.demandaId);
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-brand-800">{c.descricao}</div>
                      {dem && <div className="text-xs text-slate-400">{dem.titulo}</div>}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{nomeCliente(c.clienteId)}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {c.parcela}/{c.totalParcelas}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-slate-700">{dataBR(c.vencimento)}</div>
                      {c.status !== "Paga" && dias !== null && (
                        <div className={`text-xs ${dias < 0 ? "text-red-600" : "text-slate-400"}`}>
                          {dias < 0 ? `${Math.abs(dias)} dias em atraso` : dias === 0 ? "vence hoje" : `em ${dias} dias`}
                        </div>
                      )}
                      {c.status === "Paga" && c.pagoEm && (
                        <div className="text-xs text-emerald-600">pago em {dataBR(c.pagoEm)}</div>
                      )}
                    </td>
                    <td className="mono px-5 py-3 text-right font-semibold text-brand-900">{brl(c.valor)}</td>
                    <td className="px-5 py-3">
                      <StatusCobrancaBadge status={c.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      {c.status !== "Paga" ? (
                        <button className="text-sm text-emerald-600 hover:underline">Dar baixa</button>
                      ) : (
                        <button className="text-sm text-slate-400 hover:underline">Recibo</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400">
          No protótipo a baixa é manual. Na versão operacional dá para integrar geração de
          boleto/PIX e baixa automática (ex.: Asaas, Gerencianet) — vinculado a cada cliente e demanda.
        </p>
      </div>
    </>
  );
}
