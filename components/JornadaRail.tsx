import { montarJornada, progressoJornada, TOTAL_PASSOS } from "@/lib/boasvindas";

export default function JornadaRail({ passoAtual }: { passoAtual: number }) {
  const passos = montarJornada(passoAtual);
  const progresso = progressoJornada(passoAtual);

  return (
    <div>
      {/* barra de progresso (a "linha de luz" como avanço) */}
      <div
        className="h-1 w-full overflow-hidden rounded-full"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progresso}%`,
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--accent-bright) 55%, transparent), var(--accent))",
            boxShadow: "0 0 8px -1px color-mix(in srgb, var(--accent-bright) 55%, transparent)",
          }}
        />
      </div>

      {/* os 6 passos */}
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
        {passos.map((p) => {
          const done = p.status === "concluido";
          const atual = p.status === "atual";
          return (
            <div key={p.n} className="flex flex-col items-center gap-2 text-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full mono text-sm"
                style={{
                  background: done ? "var(--accent)" : "var(--surface)",
                  color: done
                    ? "var(--on-accent)"
                    : atual
                    ? "var(--accent)"
                    : "var(--muted)",
                  border: `1px solid ${done || atual ? "var(--accent)" : "var(--border)"}`,
                  boxShadow: atual ? "0 0 0 4px var(--accent-soft)" : "none",
                }}
              >
                {done ? "✓" : p.n}
              </div>
              <div
                className="text-xs leading-tight"
                style={{ color: done || atual ? "var(--text)" : "var(--muted)", maxWidth: "9rem" }}
              >
                {p.titulo}
              </div>
              <div
                className="text-[10px] uppercase tracking-wide"
                style={{ color: atual ? "var(--accent)" : "var(--muted)" }}
              >
                {p.tag}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
        {passoAtual > TOTAL_PASSOS
          ? "Jornada concluída"
          : `Passo ${passoAtual} de ${TOTAL_PASSOS} · ${progresso}% concluído`}
      </div>
    </div>
  );
}
