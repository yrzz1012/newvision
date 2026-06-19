import { createClient } from '@supabase/supabase-js';

/**
 * Admin客户端（使用service_role key）
 * 绕过RLS，仅在API Routes中使用
 * ⚠️ 禁止暴露到客户端
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
