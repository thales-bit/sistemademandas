import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente do Supabase para uso no servidor (server components e rotas de API).
// Usa a service_role key, que tem acesso total — por isso só roda no servidor,
// nunca é exposta ao navegador.
//
// Se as variáveis não estiverem configuradas, retorna null e o sistema usa os
// dados de exemplo (modo protótipo). Assim a aplicação nunca quebra.

let cache: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cache !== undefined) return cache;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    cache = null;
    return cache;
  }

  cache = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cache;
}

export function supabaseConfigurado(): boolean {
  return getSupabase() !== null;
}
