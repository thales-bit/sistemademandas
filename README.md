# SWZ Advogados — Gestão de Demandas

Plataforma para escritórios de advocacia gerenciarem **clientes, demandas, documentos,
cobranças** e contarem com um **assistente jurídico de IA** (resumo de demandas e
geração de minutas), incluindo um **portal do cliente**.

> Versão atual: **protótipo navegável (v0.1)** — dados de exemplo em memória, pronto
> para validar telas e fluxos antes de plugar banco de dados e pagamentos reais.

## Módulos

- **Painel** — visão geral: clientes, demandas em andamento, valores a receber e prazos próximos.
- **Clientes** — cadastro central (PF/PJ), com demandas e valores em aberto por cliente.
- **Demandas** — casos/processos por cliente, com status, prazos, andamentos e arquivos.
- **Arquivos** — documentos anexados a cada demanda.
- **IA (Claude)** — resumo automático de demandas e geração de minutas (e-mail de
  cobrança, notificação, petição inicial, resumo para o cliente).
- **Cobranças** — honorários, parcelas, vencimentos e status (paga / em aberto / atrasada).
- **Portal do Cliente** — prévia da área onde o cliente acompanha suas demandas e cobranças.

## Como rodar

Pré-requisito: Node.js 18+.

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

### Habilitar a IA (opcional)

O protótipo navega sem configuração — a IA roda em **modo simulado**. Para gerar
resumos e minutas reais com a Claude:

```bash
cp .env.example .env.local
# edite .env.local e preencha ANTHROPIC_API_KEY
```

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** para a interface
- **SDK da Anthropic** (`claude-opus-4-8`) para o assistente jurídico

## Próximos passos (para produção)

1. **Banco de dados** (ex.: PostgreSQL) substituindo os dados de exemplo em `lib/data.ts`.
2. **Autenticação e perfis** (admin, equipe, cliente) com login.
3. **Upload real de arquivos** (ex.: S3) e leitura de PDFs pela IA.
4. **Cobranças com pagamento** (ex.: Asaas/PIX): geração de boleto e baixa automática.
5. **Notificações** (e-mail/WhatsApp) de prazos e cobranças.

## Estrutura

```
app/
  page.tsx              Painel (dashboard)
  clientes/             Lista de clientes
  demandas/             Lista e detalhe de demandas (+ painel de IA)
  cobrancas/            Ambiente de cobranças
  portal/               Portal do cliente
  api/ia/               Rotas de IA (resumo, minuta)
components/             Sidebar, Topbar, badges, painel de IA
lib/                    Tipos, dados de exemplo, formatação, integração com a Claude
```
