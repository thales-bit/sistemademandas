-- ============================================================================
-- SWZ Advogados — Esquema do banco de dados (Supabase / PostgreSQL)
-- ----------------------------------------------------------------------------
-- Como usar:
--   1. No painel do Supabase, abra "SQL Editor".
--   2. Cole TODO este arquivo e clique em "Run".
--   3. Isso cria as tabelas e já insere os dados de exemplo (seed).
-- Rodar de novo é seguro: ele apaga e recria as tabelas (ver DROP abaixo).
-- ============================================================================

-- Limpa versões anteriores (ordem respeita as dependências/foreign keys)
drop table if exists cobrancas cascade;
drop table if exists arquivos cascade;
drop table if exists andamentos cascade;
drop table if exists demandas cascade;
drop table if exists clientes cascade;

-- ----------------------------------------------------------------------------
-- Clientes
-- ----------------------------------------------------------------------------
create table clientes (
  id         text primary key,
  nome       text not null,
  tipo       text not null check (tipo in ('PF', 'PJ')),
  documento  text not null,
  email      text,
  telefone   text,
  desde      date not null default current_date,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Demandas (casos/processos de um cliente)
-- ----------------------------------------------------------------------------
create table demandas (
  id              text primary key,
  cliente_id      text not null references clientes(id) on delete cascade,
  titulo          text not null,
  numero_processo text,
  area            text not null,
  status          text not null,
  responsavel     text,
  aberta_em       date not null default current_date,
  prazo           date,
  descricao       text,
  resumo_ia       text,
  created_at      timestamptz not null default now()
);
create index on demandas (cliente_id);

-- ----------------------------------------------------------------------------
-- Andamentos (linha do tempo de uma demanda)
-- ----------------------------------------------------------------------------
create table andamentos (
  id         uuid primary key default gen_random_uuid(),
  demanda_id text not null references demandas(id) on delete cascade,
  data       date not null,
  descricao  text not null,
  autor      text
);
create index on andamentos (demanda_id);

-- ----------------------------------------------------------------------------
-- Arquivos (documentos anexados a uma demanda)
-- ----------------------------------------------------------------------------
create table arquivos (
  id          uuid primary key default gen_random_uuid(),
  demanda_id  text not null references demandas(id) on delete cascade,
  nome        text not null,
  tipo        text,
  tamanho_kb  integer default 0,
  enviado_em  date not null default current_date,
  enviado_por text
);
create index on arquivos (demanda_id);

-- ----------------------------------------------------------------------------
-- Cobranças (honorários, parcelas, vencimentos)
-- ----------------------------------------------------------------------------
create table cobrancas (
  id              text primary key,
  cliente_id      text not null references clientes(id) on delete cascade,
  demanda_id      text references demandas(id) on delete set null,
  descricao       text not null,
  valor           numeric(12, 2) not null default 0,
  parcela         integer not null default 1,
  total_parcelas  integer not null default 1,
  vencimento      date not null,
  status          text not null check (status in ('Paga', 'Em aberto', 'Atrasada')),
  pago_em         date,
  created_at      timestamptz not null default now()
);
create index on cobrancas (cliente_id);
create index on cobrancas (demanda_id);

-- ============================================================================
-- SEED — dados de exemplo (os mesmos do protótipo)
-- ============================================================================

insert into clientes (id, nome, tipo, documento, email, telefone, desde) values
  ('cli-001', 'Construtora Horizonte Ltda.', 'PJ', '12.345.678/0001-90', 'financeiro@horizonte.com.br', '(11) 3322-1100', '2023-02-15'),
  ('cli-002', 'Mariana Alves Pereira',       'PF', '321.654.987-00',     'mariana.alves@email.com',     '(11) 99876-5432', '2024-06-01'),
  ('cli-003', 'TechNova Sistemas S.A.',       'PJ', '98.765.432/0001-10', 'juridico@technova.com',       '(11) 4002-8922', '2022-11-20'),
  ('cli-004', 'Roberto Carlos Menezes',       'PF', '147.258.369-00',     'roberto.menezes@email.com',   '(21) 98123-4567', '2025-01-10');

insert into demandas (id, cliente_id, titulo, numero_processo, area, status, responsavel, aberta_em, prazo, descricao, resumo_ia) values
  ('dem-1001', 'cli-001', 'Ação de cobrança contra fornecedor inadimplente', '1002345-67.2024.8.26.0100', 'Empresarial', 'Em andamento', 'Dra. Helena Souza', '2024-09-12', '2026-07-10',
    'Cobrança de R$ 480.000,00 referente a contrato de fornecimento de materiais não entregues. Aguardando réplica após contestação.',
    'Processo movido contra fornecedor por descumprimento de contrato de fornecimento (R$ 480 mil). Réu apresentou contestação alegando caso fortuito. Próximo passo: protocolar réplica até 10/07. Provas documentais (notas e e-mails) já anexadas.'),
  ('dem-1002', 'cli-002', 'Reclamação trabalhista — verbas rescisórias', '1009876-54.2025.5.02.0010', 'Trabalhista', 'Aguardando prazo', 'Dr. Paulo Ribeiro', '2025-04-22', '2026-07-05',
    'Pleito de verbas rescisórias não pagas, horas extras e adicional noturno após demissão sem justa causa.',
    'Reclamação trabalhista por verbas rescisórias, horas extras e adicional noturno. Audiência inicial realizada sem acordo. Aguardando apresentação de defesa pela reclamada até 05/07.'),
  ('dem-1003', 'cli-003', 'Revisão de contratos de licenciamento de software', null, 'Empresarial', 'Aguardando cliente', 'Dra. Helena Souza', '2025-05-30', null,
    'Análise e revisão de 12 contratos de licenciamento SaaS, com foco em cláusulas de responsabilidade e LGPD.',
    'Revisão de 12 contratos SaaS com foco em limitação de responsabilidade e conformidade com a LGPD. 8 contratos revisados; aguardando o cliente enviar os 4 restantes.'),
  ('dem-1004', 'cli-004', 'Ação de divórcio consensual', '1005544-33.2025.8.19.0001', 'Família', 'Concluída', 'Dr. Paulo Ribeiro', '2025-02-10', null,
    'Divórcio consensual com partilha de bens e guarda compartilhada.',
    'Divórcio consensual homologado em 1ª instância. Partilha e guarda compartilhada definidas. Processo concluído com êxito.');

insert into andamentos (demanda_id, data, descricao, autor) values
  ('dem-1001', '2024-09-12', 'Distribuição da ação.', 'Dra. Helena Souza'),
  ('dem-1001', '2025-01-20', 'Citação do réu efetivada.', 'Sistema'),
  ('dem-1001', '2025-03-04', 'Juntada de contestação.', 'Sistema'),
  ('dem-1002', '2025-04-22', 'Ajuizamento da reclamação.', 'Dr. Paulo Ribeiro'),
  ('dem-1002', '2025-06-15', 'Audiência inicial sem acordo.', 'Dr. Paulo Ribeiro'),
  ('dem-1003', '2025-05-30', 'Recebimento dos contratos para análise.', 'Dra. Helena Souza'),
  ('dem-1003', '2025-06-18', 'Entrega da primeira leva de revisões.', 'Dra. Helena Souza'),
  ('dem-1004', '2025-02-10', 'Protocolo da petição de divórcio.', 'Dr. Paulo Ribeiro'),
  ('dem-1004', '2025-05-12', 'Sentença homologatória publicada.', 'Sistema');

insert into arquivos (demanda_id, nome, tipo, tamanho_kb, enviado_em, enviado_por) values
  ('dem-1001', 'peticao-inicial.pdf',        'pdf',  842,  '2024-09-12', 'Dra. Helena Souza'),
  ('dem-1001', 'contrato-fornecimento.pdf',  'pdf',  1204, '2024-09-12', 'Dra. Helena Souza'),
  ('dem-1001', 'contestacao-reu.pdf',        'pdf',  655,  '2025-03-04', 'Sistema (PJe)'),
  ('dem-1002', 'ctps-digital.pdf',           'pdf',  320,  '2025-04-22', 'Mariana Alves'),
  ('dem-1002', 'holerites-2024.pdf',         'pdf',  980,  '2025-04-22', 'Mariana Alves'),
  ('dem-1003', 'contrato-modelo-saas.docx',  'docx', 145,  '2025-05-30', 'TechNova'),
  ('dem-1004', 'acordo-divorcio.pdf',        'pdf',  410,  '2025-02-10', 'Dr. Paulo Ribeiro'),
  ('dem-1004', 'sentenca-homologatoria.pdf', 'pdf',  290,  '2025-05-12', 'Sistema');

insert into cobrancas (id, cliente_id, demanda_id, descricao, valor, parcela, total_parcelas, vencimento, status, pago_em) values
  ('cob-001', 'cli-001', 'dem-1001', 'Honorários iniciais — Ação de cobrança',          8000,  1, 1, '2024-09-20', 'Paga',      '2024-09-19'),
  ('cob-002', 'cli-001', 'dem-1001', 'Honorários — êxito parcial (1ª parcela)',          6000,  1, 3, '2026-07-15', 'Em aberto', null),
  ('cob-003', 'cli-002', 'dem-1002', 'Honorários contratuais — Reclamação trabalhista',  3500,  2, 4, '2026-06-10', 'Atrasada',  null),
  ('cob-004', 'cli-003', 'dem-1003', 'Consultoria — revisão contratual (mensal)',        12000, 3, 6, '2026-07-05', 'Em aberto', null),
  ('cob-005', 'cli-004', 'dem-1004', 'Honorários — Divórcio consensual',                 4500,  1, 1, '2025-05-20', 'Paga',      '2025-05-18'),
  ('cob-006', 'cli-003', null,       'Consultoria — revisão contratual (mensal)',        12000, 2, 6, '2026-06-05', 'Atrasada',  null);

-- ============================================================================
-- Segurança (RLS): por enquanto o acesso é feito pelo servidor com a
-- service_role key. Quando entrarem os logins (admin/equipe/cliente),
-- habilitaremos Row Level Security com políticas por perfil.
-- ============================================================================
