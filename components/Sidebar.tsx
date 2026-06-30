"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens = [
  { href: "/", label: "Painel", icon: "▣" },
  { href: "/clientes", label: "Clientes", icon: "◍" },
  { href: "/demandas", label: "Demandas", icon: "⚖" },
  { href: "/cobrancas", label: "Cobranças", icon: "₿" },
  { href: "/portal", label: "Portal do Cliente", icon: "◎" },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-brand-900 text-brand-100">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500 font-bold text-brand-950">
          SWZ
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">SWZ Advogados</div>
          <div className="text-xs text-brand-300">Gestão de Demandas</div>
        </div>
      </div>

      <nav className="mt-2 flex flex-col gap-1 px-3">
        {itens.map((item) => {
          const ativo =
            item.href === "/" ? path === "/" : path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                ativo
                  ? "bg-brand-700 font-medium text-white"
                  : "text-brand-200 hover:bg-brand-800 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-brand-800 px-5 py-4 text-xs text-brand-400">
        Protótipo navegável · v0.1
      </div>
    </aside>
  );
}
