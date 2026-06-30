import Topbar from "@/components/Topbar";
import { clientes, getDemandasDoCliente, getCobrancasDoCliente } from "@/lib/data";
import { brl, dataBR } from "@/lib/format";

export default function ClientesPage() {
  return (
    <>
      <Topbar titulo="Clientes" subtitulo={`${clientes.length} clientes cadastrados`} />
      <div className="flex-1 p-8">
        <div className="mb-4 flex items-center justify-between">
          <input className="input max-w-xs" placeholder="Buscar cliente..." />
          <button className="btn-primary">+ Novo cliente</button>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Documento</th>
                <th className="px-5 py-3 font-medium">Demandas</th>
                <th className="px-5 py-3 font-medium">Em aberto</th>
                <th className="px-5 py-3 font-medium">Cliente desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientes.map((c) => {
                const dems = getDemandasDoCliente(c.id);
                const aberto = getCobrancasDoCliente(c.id)
                  .filter((x) => x.status !== "Paga")
                  .reduce((s, x) => s + x.valor, 0);
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-brand-800">{c.nome}</div>
                      <div className="text-xs text-slate-400">{c.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="badge bg-slate-100 text-slate-600">{c.tipo}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{c.documento}</td>
                    <td className="px-5 py-3 text-slate-600">{dems.length}</td>
                    <td className="px-5 py-3">
                      {aberto > 0 ? (
                        <span className="font-medium text-brand-900">{brl(aberto)}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{dataBR(c.desde)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
