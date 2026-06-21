import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

/**
 * 公开Supabase客户端 — 无需 Cookie/auth
 * 用于首页、探索页等公开数据查询
 * RLS 策略允许匿名用户读取 is_published=true 的作品
 */
let publicClient: ReturnType<typeof createClient> | null = null;

export function createPublicClient() {
  if (!publicClient) {
    publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return publicClient;
}
