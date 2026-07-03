"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Ambiente } from "@/lib/ambiente";

const itens = [
  { href: "/", label: "Painel", icon: "◧" },
  { href: "/clientes", label: "Clientes", icon: "◍" },
  { href: "/demandas", label: "Demandas", icon: "⚖" },
  { href: "/cobrancas", label: "Cobranças", icon: "₿" },
  { href: "/boas-vindas", label: "Boas-vindas", icon: "✦" },
  { href: "/portal", label: "Portal do Cliente", icon: "◎" },
];

export default function Sidebar({ ambiente }: { ambiente: Ambiente }) {
  const path = usePathname();

  return (
    <aside
      className="flex w-[232px] shrink-0 flex-col border-r"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3 px-5 py-6">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg font-display text-lg font-semibold"
          style={{
            background: "var(--accent)",
            color: "var(--on-accent)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.28)",
          }}
        >
          S
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            SWZ Advogados
          </div>
          <div className="eyebrow mt-0.5">Gestão</div>
        </div>
      </div>

      <nav className="mt-1 flex flex-col gap-0.5 px-3">
        {itens.map((item) => {
          const ativo =
            item.href === "/" ? path === "/" : path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
              style={{
                color: ativo ? "var(--text)" : "var(--muted)",
                background: ativo ? "var(--surface-alt)" : "transparent",
              }}
            >
              {ativo && (
                <span
                  className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded"
                  style={{ background: "var(--accent)" }}
                />
              )}
              <span className="w-4 text-center text-base opacity-90">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div
        className="mt-auto flex flex-col gap-2 border-t px-5 py-4"
        style={{ borderColor: "var(--border)" }}
      >
        <span
          className="badge"
          style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--positive)" }}
          />
          {ambiente.label}
        </span>
        <div className="text-xs" style={{ color: "var(--muted)" }}>
          Protótipo · v0.2
        </div>
      </div>
    </aside>
  );
}
