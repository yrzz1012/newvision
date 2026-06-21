-- V5: 反馈表
-- 在 Supabase Dashboard > SQL Editor 中执行

CREATE TABLE IF NOT EXISTS public.feedbacks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message    TEXT NOT NULL,
  email      TEXT,
  page_url   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 所有认证用户可提交反馈
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedbacks_insert_all" ON public.feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "feedbacks_select_auth" ON public.feedbacks FOR SELECT USING (auth.role() = 'authenticated');
