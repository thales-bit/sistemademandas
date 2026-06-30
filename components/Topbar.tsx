export default function Topbar({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div>
        <h1 className="text-xl font-semibold text-brand-900">{titulo}</h1>
        {subtitulo && <p className="text-sm text-slate-500">{subtitulo}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:inline">contato@swzadvogados.com.br</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          SW
        </div>
      </div>
    </header>
  );
}
