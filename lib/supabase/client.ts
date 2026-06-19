'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 浏览器端Supabase客户端（单例）
 * 用于客户端组件中的数据库查询和Auth操作
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
