import Link from "next/link";
import Topbar from "@/components/Topbar";
import { StatusDemandaBadge } from "@/components/Badges";
import { demandas, nomeCliente } from "@/lib/data";
import { dataBR, diasAte } from "@/lib/format";

export default function DemandasPage() {
  return (
    <>
      <Topbar titulo="Demandas" subtitulo={`${demandas.length} demandas`} />
      <div className="flex-1 p-8">
        <div className="mb-4 flex items-center justify-between">
          <input className="input max-w-xs" placeholder="Buscar demanda..." />
          <button className="btn-primary">+ Nova demanda</button>
        </div>

        <div className="grid gap-4">
          {demandas.map((d) => {
            const dias = diasAte(d.prazo);
            return (
              <Link key={d.id} href={`/demandas/${d.id}`} className="card block p-5 transition hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="badge bg-brand-50 text-brand-700">{d.area}</span>
                      <StatusDemandaBadge status={d.status} />
                    </div>
                    <h3 className="mt-2 font-semibold text-brand-900">{d.titulo}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{d.descricao}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
                      <span>Cliente: {nomeCliente(d.clienteId)}</span>
                      <span>Responsável: {d.responsavel}</span>
                      {d.numeroProcesso && <span>Proc.: {d.numeroProcesso}</span>}
                      <span>{d.arquivos.length} arquivo(s)</span>
                    </div>
                  </div>
                  {d.prazo && (
                    <div className="shrink-0 text-right">
                      <div className="text-xs uppercase tracking-wide text-slate-400">Prazo</div>
                      <div className="text-sm font-medium text-slate-700">{dataBR(d.prazo)}</div>
                      {dias !== null && (
                        <div className={`text-xs ${dias <= 7 ? "text-red-600" : "text-slate-400"}`}>
                          {dias === 0 ? "hoje" : dias > 0 ? `em ${dias} dias` : `${Math.abs(dias)} dias atrás`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
