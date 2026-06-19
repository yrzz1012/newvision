-- V2: uploads bucket 权限
-- 在 Supabase Dashboard > SQL Editor 中执行

-- 认证用户可上传到 uploads
CREATE POLICY "uploads_insert_auth" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- uploads 文件公开可读（Viewer 需要加载）
CREATE POLICY "uploads_read_all" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');
