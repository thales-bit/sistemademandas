import Topbar from "@/components/Topbar";
import JornadaRail from "@/components/JornadaRail";
import KitBoasVindas from "@/components/KitBoasVindas";
import { getClientes, mapaPassoAtual } from "@/lib/db";
import { PASSOS_BOAS_VINDAS, TOTAL_PASSOS } from "@/lib/boasvindas";

export const dynamic = "force-dynamic";

export default async function BoasVindasPage() {
  const [clientes, passos] = await Promise.all([getClientes(), mapaPassoAtual()]);

  const emJornada = clientes.filter((c) => (passos[c.id] ?? 1) <= TOTAL_PASSOS).length;

  return (
    <>
      <Topbar titulo="Boas-vindas" subtitulo="A jornada de cada cliente após fechar" />
      <div className="flex-1 space-y-6 p-8">
        {/* intro / o ritual dos 6 passos */}
        <section className="card streak p-6">
          <div className="eyebrow">O ritual pós-contratação</div>
          <h2 className="mt-2 text-lg" style={{ color: "var(--text)" }}>
            Toda vez que um cliente diz “sim”, ele entra numa jornada guiada
          </h2>
          <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--muted)" }}>
            São {TOTAL_PASSOS} passos padronizados que organizam o escritório e passam
            confiança ao cliente — do contrato ao acompanhamento.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {PASSOS_BOAS_VINDAS.map((p) => (
              <span
                key={p.n}
                className="badge"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                <span className="mono">{p.n}</span> {p.titulo}
              </span>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            {emJornada} cliente(s) em jornada · {clientes.length} no total
          </div>
        </div>

        {/* uma jornada por cliente */}
        <div className="grid gap-5">
          {clientes.map((c) => {
            const passoAtual = passos[c.id] ?? 1;
            const concluida = passoAtual > TOTAL_PASSOS;
            return (
              <section key={c.id} className="card p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base" style={{ color: "var(--text)" }}>
                      {c.nome}
                    </h3>
                    <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      {c.tipo} · {c.email}
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={
                      concluida
                        ? { background: "color-mix(in srgb, var(--positive) 14%, transparent)", color: "var(--positive)" }
                        : { background: "var(--accent-soft)", color: "var(--accent)" }
                    }
                  >
                    {concluida ? "Concluída" : `Passo ${passoAtual}/${TOTAL_PASSOS}`}
                  </span>
                </div>

                <JornadaRail passoAtual={passoAtual} />

                <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                  <KitBoasVindas clienteId={c.id} nomeCliente={c.nome} />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
