// Utilitários de formatação (moeda, datas) em pt-BR.

export function brl(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function dataBR(iso?: string) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  if (!ano || !mes || !dia) return iso;
  return `${dia}/${mes}/${ano}`;
}

// Dias entre hoje (data de referência fixa do protótipo) e uma data ISO.
const HOJE = "2026-06-30";

export function diasAte(iso?: string): number | null {
  if (!iso) return null;
  const a = Date.parse(iso);
  const b = Date.parse(HOJE);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}
