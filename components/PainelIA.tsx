"use client";

import { useState } from "react";

interface Props {
  demandaId: string;
  resumoInicial?: string;
}

type Aba = "resumo" | "minuta";

export default function PainelIA({ demandaId, resumoInicial }: Props) {
  const [aba, setAba] = useState<Aba>("resumo");
  const [resumo, setResumo] = useState(resumoInicial ?? "");
  const [minuta, setMinuta] = useState("");
  const [tipoMinuta, setTipoMinuta] = useState("E-mail de cobrança");
  const [carregando, setCarregando] = useState(false);

  async function gerarResumo() {
    setCarregando(true);
    try {
      const res = await fetch("/api/ia/resumo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demandaId }),
      });
      const data = await res.json();
      setResumo(data.texto ?? "");
    } finally {
      setCarregando(false);
    }
  }

  async function gerarMinuta() {
    setCarregando(true);
    try {
      const res = await fetch("/api/ia/minuta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demandaId, tipo: tipoMinuta }),
      });
      const data = await res.json();
      setMinuta(data.texto ?? "");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-white px-5 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-700 text-xs font-bold text-white">
          IA
        </span>
        <h2 className="font-semibold text-brand-900">Assistente Jurídico</h2>
        <span className="ml-auto text-xs text-slate-400">powered by Claude</span>
      </div>

      <div className="flex gap-1 border-b border-slate-100 px-4 pt-3">
        <button
          onClick={() => setAba("resumo")}
          className={`rounded-t-lg px-4 py-2 text-sm ${aba === "resumo" ? "border-b-2 border-brand-600 font-medium text-brand-700" : "text-slate-500"}`}
        >
          Resumo da demanda
        </button>
        <button
          onClick={() => setAba("minuta")}
          className={`rounded-t-lg px-4 py-2 text-sm ${aba === "minuta" ? "border-b-2 border-brand-600 font-medium text-brand-700" : "text-slate-500"}`}
        >
          Gerar minuta
        </button>
      </div>

      <div className="p-5">
        {aba === "resumo" ? (
          <div>
            <textarea
              className="input min-h-[140px] resize-y leading-relaxed"
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Clique em 'Gerar resumo' para a IA analisar os documentos e o andamento da demanda."
            />
            <div className="mt-3 flex items-center gap-3">
              <button onClick={gerarResumo} disabled={carregando} className="btn-primary disabled:opacity-60">
                {carregando ? "Analisando…" : "Gerar resumo"}
              </button>
              <span className="text-xs text-slate-400">
                A IA lê os arquivos e andamentos para resumir o caso.
              </span>
            </div>
          </div>
        ) : (
          <div>
            <label className="label">Tipo de documento</label>
            <select className="input mb-3" value={tipoMinuta} onChange={(e) => setTipoMinuta(e.target.value)}>
              <option>E-mail de cobrança</option>
              <option>Notificação extrajudicial</option>
              <option>Petição — minuta inicial</option>
              <option>Resumo para o cliente</option>
            </select>
            <textarea
              className="input min-h-[160px] resize-y leading-relaxed"
              value={minuta}
              onChange={(e) => setMinuta(e.target.value)}
              placeholder="A minuta gerada aparecerá aqui para você revisar e editar."
            />
            <div className="mt-3 flex items-center gap-3">
              <button onClick={gerarMinuta} disabled={carregando} className="btn-primary disabled:opacity-60">
                {carregando ? "Redigindo…" : "Gerar minuta"}
              </button>
              <span className="text-xs text-slate-400">Sempre revise antes de enviar.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
