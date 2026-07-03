"use client";

import { useState } from "react";

export default function KitBoasVindas({
  clienteId,
  nomeCliente,
}: {
  clienteId: string;
  nomeCliente: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function gerar() {
    setCarregando(true);
    setAberto(true);
    try {
      const res = await fetch("/api/ia/boas-vindas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clienteId }),
      });
      const data = await res.json();
      setTexto(data.texto ?? "");
    } finally {
      setCarregando(false);
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* clipboard indisponível */
    }
  }

  return (
    <div>
      <button onClick={gerar} disabled={carregando} className="btn-ghost text-xs disabled:opacity-60">
        {carregando ? "Gerando…" : "✦ Gerar kit de boas-vindas"}
      </button>

      {aberto && (
        <div className="mt-3">
          <label className="label">
            Kit para {nomeCliente} — revise e envie por WhatsApp/e-mail
          </label>
          <textarea
            className="input min-h-[180px] resize-y leading-relaxed"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={carregando ? "Escrevendo…" : "A mensagem gerada aparece aqui."}
          />
          <div className="mt-2 flex items-center gap-3">
            <button onClick={copiar} disabled={!texto} className="btn-primary text-xs disabled:opacity-60">
              {copiado ? "Copiado!" : "Copiar"}
            </button>
            <button onClick={gerar} disabled={carregando} className="btn-ghost text-xs disabled:opacity-60">
              Gerar de novo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
