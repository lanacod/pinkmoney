-- ─── PinkMoney — Grants de permissão para roles ───────────────────────────────
-- Execute após 001_initial_schema.sql

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Badges são públicos (leitura para todos)
GRANT SELECT ON public.badges TO anon, authenticated;

-- Tabelas de usuário — só authenticated tem acesso (RLS controla as linhas)
GRANT ALL ON public.profiles     TO authenticated;
GRANT ALL ON public.categories   TO authenticated;
GRANT ALL ON public.cards        TO authenticated;
GRANT ALL ON public.transactions TO authenticated;
GRANT ALL ON public.goals        TO authenticated;
GRANT ALL ON public.user_badges  TO authenticated;

-- Views
GRANT SELECT ON public.monthly_summary   TO authenticated;
GRANT SELECT ON public.category_spending TO authenticated;

-- Funções
GRANT EXECUTE ON FUNCTION public.calculate_financial_score(uuid) TO authenticated;
