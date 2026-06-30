import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { getAmbiente } from "@/lib/ambiente";

export const metadata: Metadata = {
  title: "SWZ Advogados — Gestão de Demandas",
  description:
    "Plataforma de gestão de demandas, documentos, IA e cobranças para escritórios de advocacia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ambiente = getAmbiente();
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen">
          <Sidebar ambiente={ambiente} />
          <main className="flex min-w-0 flex-1 flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
}
