-- ─── PinkMoney — Schema Inicial ───────────────────────────────────────────────
-- Execute este SQL no Supabase Dashboard → SQL Editor

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── Tabelas ──────────────────────────────────────────────────────────────────

-- Profiles (estende auth.users)
create table if not exists public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  full_name       text,
  avatar_url      text,
  monthly_income  numeric(12,2) not null default 0,
  financial_score integer       not null default 750,
  created_at      timestamptz   not null default now()
);

-- Categories (categorias de transação)
create table if not exists public.categories (
  id            uuid        primary key default uuid_generate_v4(),
  user_id       uuid        not null references public.profiles(id) on delete cascade,
  name          text        not null,
  icon          text,
  color         text        default '#FF4FA3',
  monthly_limit numeric(12,2),
  created_at    timestamptz not null default now()
);

-- Cards (cartões de crédito/débito)
create table if not exists public.cards (
  id               uuid        primary key default uuid_generate_v4(),
  user_id          uuid        not null references public.profiles(id) on delete cascade,
  name             text        not null,
  last_four        text,
  available_limit  numeric(12,2) not null default 0,
  current_balance  numeric(12,2) not null default 0,
  created_at       timestamptz not null default now()
);

-- Transactions (transações financeiras)
create table if not exists public.transactions (
  id             uuid        primary key default uuid_generate_v4(),
  user_id        uuid        not null references public.profiles(id) on delete cascade,
  category_id    uuid        references public.categories(id) on delete set null,
  card_id        uuid        references public.cards(id) on delete set null,
  type           text        not null check (type in ('income', 'expense')),
  amount         numeric(12,2) not null check (amount > 0),
  description    text        not null,
  date           date        not null,
  payment_method text        not null default 'pix' check (payment_method in ('card', 'pix', 'cash')),
  notes          text,
  created_at     timestamptz not null default now()
);

-- Goals / Metas financeiras
create table if not exists public.goals (
  id                   uuid        primary key default uuid_generate_v4(),
  user_id              uuid        not null references public.profiles(id) on delete cascade,
  name                 text        not null,
  emoji                text        default '⭐',
  target_amount        numeric(12,2) not null check (target_amount > 0),
  current_amount       numeric(12,2) not null default 0,
  monthly_contribution numeric(12,2) not null default 0,
  created_at           timestamptz not null default now()
);

-- Badges / Conquistas
create table if not exists public.badges (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  icon        text,
  condition   text  -- código/slug da regra de negócio que concede o badge
);

create table if not exists public.user_badges (
  id        uuid        primary key default uuid_generate_v4(),
  user_id   uuid        not null references public.profiles(id) on delete cascade,
  badge_id  uuid        not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

-- ─── Views ────────────────────────────────────────────────────────────────────

-- Resumo mensal por usuário
create or replace view public.monthly_summary as
select
  user_id,
  to_char(date_trunc('month', date), 'YYYY-MM') as month,
  sum(case when type = 'income'  then amount else 0 end) as total_income,
  sum(case when type = 'expense' then amount else 0 end) as total_expenses,
  sum(case when type = 'income'  then amount else -amount end) as balance
from public.transactions
group by user_id, date_trunc('month', date);

-- Gastos por categoria no mês corrente
create or replace view public.category_spending as
select
  t.user_id,
  c.id    as category_id,
  c.name  as category_name,
  c.icon,
  c.color,
  sum(t.amount) as total_spent,
  c.monthly_limit,
  case
    when c.monthly_limit is null or c.monthly_limit = 0 then 0
    else round((sum(t.amount) / c.monthly_limit * 100)::numeric, 1)
  end as percentage
from public.transactions t
join public.categories c on c.id = t.category_id
where
  t.type = 'expense'
  and date_trunc('month', t.date) = date_trunc('month', current_date)
group by t.user_id, c.id, c.name, c.icon, c.color, c.monthly_limit;

-- ─── Funções ──────────────────────────────────────────────────────────────────

-- Calcula score financeiro (0–850)
create or replace function public.calculate_financial_score(p_user_id uuid)
returns integer
language plpgsql security definer
as $$
declare
  v_income        numeric;
  v_expenses      numeric;
  v_savings_rate  numeric;
  v_goals_count   integer;
  v_score         integer;
begin
  -- Entradas e saídas dos últimos 3 meses
  select
    coalesce(sum(case when type = 'income'  then amount end), 0),
    coalesce(sum(case when type = 'expense' then amount end), 0)
  into v_income, v_expenses
  from public.transactions
  where user_id = p_user_id
    and date >= current_date - interval '3 months';

  -- Taxa de poupança
  v_savings_rate := case
    when v_income = 0 then 0
    else ((v_income - v_expenses) / v_income * 100)
  end;

  -- Metas ativas
  select count(*) into v_goals_count
  from public.goals
  where user_id = p_user_id and current_amount < target_amount;

  -- Score base: 600 + taxa de poupança * 2 + metas * 10 (máx 850)
  v_score := least(850, greatest(300,
    600 + (v_savings_rate * 2)::integer + (v_goals_count * 10)
  ));

  -- Atualiza profile
  update public.profiles
  set financial_score = v_score
  where id = p_user_id;

  return v_score;
end;
$$;

-- Auto-cria profile quando usuário se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Trigger no auth
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.profiles    enable row level security;
alter table public.categories  enable row level security;
alter table public.cards       enable row level security;
alter table public.transactions enable row level security;
alter table public.goals       enable row level security;
alter table public.user_badges enable row level security;

-- Profiles
create policy "own profile" on public.profiles
  for all using (auth.uid() = id);

-- Categories
create policy "own categories" on public.categories
  for all using (auth.uid() = user_id);

-- Cards
create policy "own cards" on public.cards
  for all using (auth.uid() = user_id);

-- Transactions
create policy "own transactions" on public.transactions
  for all using (auth.uid() = user_id);

-- Goals
create policy "own goals" on public.goals
  for all using (auth.uid() = user_id);

-- User badges (leitura própria)
create policy "own badges" on public.user_badges
  for select using (auth.uid() = user_id);

-- Badges públicos (leitura global)
create policy "public badges read" on public.badges
  for select using (true);

-- ─── Seeds — Badges Iniciais ──────────────────────────────────────────────────
insert into public.badges (name, description, icon, condition) values
  ('Estrela Economizadora', 'Economizou mais de 20% da renda em um mês',     '⭐', 'savings_rate_20'),
  ('Primeira Meta',         'Concluiu sua primeira meta financeira',          '🎯', 'first_goal_complete'),
  ('Mestre do Brilho',      'Manteve score financeiro acima de 800 por 3 meses', '💎', 'score_800_3months'),
  ('Rainha das Finanças',   'Registrou transações por 30 dias consecutivos', '👑', 'streak_30_days'),
  ('Pink Saver',            'Criou 5 categorias personalizadas',              '🌸', 'five_categories')
on conflict do nothing;
