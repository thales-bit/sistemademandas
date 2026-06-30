"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import { StatusDemandaBadge, StatusCobrancaBadge } from "@/components/Badges";
import { clientes, getDemandasDoCliente, getCobrancasDoCliente } from "@/lib/data";
import { brl, dataBR } from "@/lib/format";

export default function PortalCliente() {
  const [clienteId, setClienteId] = useState(clientes[0].id);
  const cliente = clientes.find((c) => c.id === clienteId)!;
  const demandas = getDemandasDoCliente(clienteId);
  const cobrancas = getCobrancasDoCliente(clienteId);
  const aberto = cobrancas.filter((c) => c.status !== "Paga").reduce((s, c) => s + c.valor, 0);

  return (
    <>
      <Topbar titulo="Portal do Cliente" subtitulo="Prévia de como o cliente vê suas informações" />
      <div className="flex-1 p-8">
        {/* Seletor de simulação (não existe no portal real) */}
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-dashed border-brand-200 bg-brand-50 px-4 py-3 text-sm">
          <span className="font-medium text-brand-700">Simular acesso como:</span>
          <select className="input max-w-xs" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          <div className="card bg-gradient-to-r from-brand-900 to-brand-700 p-6 text-white">
            <div className="text-sm text-brand-200">Bem-vindo(a),</div>
            <div className="text-xl font-semibold">{cliente.nome}</div>
            <div className="mt-4 flex gap-8">
              <div>
                <div className="text-xs text-brand-200">Demandas ativas</div>
                <div className="text-lg font-semibold">
                  {demandas.filter((d) => d.status !== "Concluída" && d.status !== "Arquivada").length}
                </div>
              </div>
              <div>
                <div className="text-xs text-brand-200">Valores em aberto</div>
                <div className="text-lg font-semibold">{brl(aberto)}</div>
              </div>
            </div>
          </div>

          {/* Minhas demandas */}
          <section className="card">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-brand-900">Minhas demandas</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {demandas.map((d) => (
                <div key={d.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-brand-800">{d.titulo}</h3>
                    <StatusDemandaBadge status={d.status} />
                  </div>
                  {d.resumoIA && (
                    <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
                      <span className="font-medium text-brand-700">Resumo: </span>
                      {d.resumoIA}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-slate-400">
                    {d.responsavel} · {d.arquivos.length} documento(s)
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Minhas cobranças */}
          <section className="card">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-brand-900">Minhas cobranças</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {cobrancas.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-sm font-medium text-brand-800">{c.descricao}</div>
                    <div className="text-xs text-slate-400">
                      Parcela {c.parcela}/{c.totalParcelas} · vence {dataBR(c.vencimento)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-brand-900">{brl(c.valor)}</span>
                    <StatusCobrancaBadge status={c.status} />
                    {c.status !== "Paga" && <button className="btn-primary text-xs">Pagar</button>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
