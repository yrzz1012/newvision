-- V3: works 表增加 photos 数组字段
-- 在 Supabase Dashboard > SQL Editor 中执行

ALTER TABLE public.works ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';
