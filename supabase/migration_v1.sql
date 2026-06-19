-- ============================================================
-- 3D Space 数据库迁移 V1
-- 在 Supabase Dashboard > SQL Editor 中粘贴并执行全部语句
-- ============================================================

-- 1. 创建分类枚举
CREATE TYPE work_category AS ENUM ('homestay', 'exhibition', 'commercial', 'other');

-- 2. 用户扩展表
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT DEFAULT '',
  avatar_url    TEXT,
  bio           TEXT DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 作品表
CREATE TABLE public.works (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT DEFAULT '',
  category          work_category NOT NULL DEFAULT 'other',
  cover_url         TEXT,
  splat_file_url    TEXT,
  splat_original_url TEXT,
  thumbnail_url     TEXT,
  tags              TEXT[] DEFAULT '{}',
  is_featured       BOOLEAN DEFAULT false,
  is_published      BOOLEAN DEFAULT false,
  view_count        INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. 收藏表
CREATE TABLE public.favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  work_id    UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, work_id)
);

-- 5. 索引
CREATE INDEX idx_works_category ON public.works(category);
CREATE INDEX idx_works_featured ON public.works(is_featured) WHERE is_featured = true;
CREATE INDEX idx_works_user_id ON public.works(user_id);
CREATE INDEX idx_works_created_at ON public.works(created_at DESC);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_work_id ON public.favorites(work_id);

-- 6. 注册时自动创建profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RLS 策略
-- ============================================================

-- profiles: 所有人可读，仅本人可修改
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_self" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- works: 已发布作品所有人可读，仅作者可增删改
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "works_read_published" ON public.works FOR SELECT USING (is_published = true OR auth.uid() = user_id);
CREATE POLICY "works_insert_auth" ON public.works FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "works_update_own" ON public.works FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "works_delete_own" ON public.works FOR DELETE USING (auth.uid() = user_id);

-- favorites: 仅本人可读写
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_read_own" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Storage Buckets
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('splats', 'splats', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- covers: 公开读取，认证用户可上传
CREATE POLICY "covers_read_all" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "covers_insert_auth" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

-- splats: 公开读取
CREATE POLICY "splats_read_all" ON storage.objects FOR SELECT USING (bucket_id = 'splats');

-- avatars: 公开读取，认证用户可上传
CREATE POLICY "avatars_read_all" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_insert_auth" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
