-- V4: Fix uploads bucket INSERT policy (was missing in V1/V2)
-- 在 Supabase Dashboard > SQL Editor 中执行

-- uploads: 认证用户可上传
CREATE POLICY "uploads_insert_auth" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- covers/avatars: 加固所有权校验（可选）
-- CREATE POLICY "covers_insert_owner" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text);
