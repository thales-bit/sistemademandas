import Link from "next/link";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import { StatusDemandaBadge, StatusCobrancaBadge } from "@/components/Badges";
import PainelIA from "@/components/PainelIA";
import { getDemanda, getCliente, cobrancas } from "@/lib/data";
import { brl, dataBR } from "@/lib/format";

export default function DemandaDetalhe({ params }: { params: { id: string } }) {
  const d = getDemanda(params.id);
  if (!d) notFound();

  const cliente = getCliente(d.clienteId);
  const cobrancasDemanda = cobrancas.filter((c) => c.demandaId === d.id);

  return (
    <>
      <Topbar titulo="Demanda" subtitulo={cliente?.nome} />
      <div className="flex-1 p-8">
        <Link href="/demandas" className="mb-4 inline-block text-sm text-brand-600 hover:underline">
          ← Voltar para demandas
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="space-y-6 lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center gap-2">
                <span className="badge bg-brand-50 text-brand-700">{d.area}</span>
                <StatusDemandaBadge status={d.status} />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-brand-900">{d.titulo}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{d.descricao}</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-slate-400">Responsável</dt>
                  <dd className="text-slate-700">{d.responsavel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Aberta em</dt>
                  <dd className="text-slate-700">{dataBR(d.abertaEm)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Prazo</dt>
                  <dd className="text-slate-700">{dataBR(d.prazo)}</dd>
                </div>
                {d.numeroProcesso && (
                  <div className="col-span-2 sm:col-span-3">
                    <dt className="text-xs text-slate-400">Nº do processo</dt>
                    <dd className="font-mono text-slate-700">{d.numeroProcesso}</dd>
                  </div>
                )}
              </dl>
            </div>

            <PainelIA demandaId={d.id} resumoInicial={d.resumoIA} />

            {/* Arquivos */}
            <div className="card">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="font-semibold text-brand-900">Arquivos da demanda</h2>
                <button className="btn-ghost text-xs">+ Enviar arquivo</button>
              </div>
              <ul className="divide-y divide-slate-100">
                {d.arquivos.map((a) => (
                  <li key={a.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold uppercase text-slate-500">
                        {a.tipo}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-brand-800">{a.nome}</div>
                        <div className="text-xs text-slate-400">
                          {(a.tamanhoKb / 1024).toFixed(1)} MB · {dataBR(a.enviadoEm)} · {a.enviadoPor}
                        </div>
                      </div>
                    </div>
                    <button className="text-sm text-brand-600 hover:underline">Baixar</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coluna lateral */}
          <div className="space-y-6">
            {/* Andamentos */}
            <div className="card">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="font-semibold text-brand-900">Linha do tempo</h2>
              </div>
              <ol className="space-y-4 px-5 py-4">
                {d.andamentos.map((a, i) => (
                  <li key={i} className="relative pl-5">
                    <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
                    <div className="text-xs text-slate-400">{dataBR(a.data)}</div>
                    <div className="text-sm text-slate-700">{a.descricao}</div>
                    <div className="text-xs text-slate-400">{a.autor}</div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Cobranças vinculadas */}
            <div className="card">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="font-semibold text-brand-900">Cobranças vinculadas</h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {cobrancasDemanda.length === 0 && (
                  <li className="px-5 py-4 text-sm text-slate-400">Nenhuma cobrança vinculada.</li>
                )}
                {cobrancasDemanda.map((c) => (
                  <li key={c.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-brand-900">{brl(c.valor)}</span>
                      <StatusCobrancaBadge status={c.status} />
                    </div>
                    <div className="text-xs text-slate-400">
                      {c.descricao} · vence {dataBR(c.vencimento)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
