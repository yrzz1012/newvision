import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 服务端Supabase客户端
 * 用于Server Components和API Routes中的数据库查询
 * 自动从Cookie中读取Auth会话
 */
export async function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value }) =>
              (cookieStore as any).set(name, value)
            );
          } catch {
            // 在Server Components中忽略set cookie错误
          }
        },
      },
    }
  );
}

