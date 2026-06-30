// Identifica em qual ambiente o app está rodando, usando as variáveis que a
// Vercel injeta automaticamente em cada deploy. Serve para o usuário distinguir
// visualmente o site oficial (main) da pré-visualização (testes).

export interface Ambiente {
  label: string;
  cor: string; // classes Tailwind
}

export function getAmbiente(): Ambiente {
  const env = process.env.VERCEL_ENV; // "production" | "preview" | undefined
  const branch = process.env.VERCEL_GIT_COMMIT_REF; // nome da branch

  if (env === "production") {
    return { label: "Produção", cor: "bg-emerald-500/20 text-emerald-300" };
  }
  if (env === "preview") {
    return {
      label: `Pré-visualização · ${branch ?? "preview"}`,
      cor: "bg-amber-500/20 text-amber-300",
    };
  }
  return { label: "Local", cor: "bg-brand-700 text-brand-200" };
}
