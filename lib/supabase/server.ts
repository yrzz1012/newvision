import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

/**
 * 服务端Supabase客户端
 * 用于Server Components和API Routes中的数据库查询
 */
export async function createClient() {
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            (cookieStore as any).set(name, value, options)
          );
        } catch {
          // 在Server Components中忽略set cookie错误
        }
      },
    },
  });
}
