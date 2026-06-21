import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * 路由中间件 — 保护需登录的页面
 * 拦截 /upload → 未登录重定向到 /auth/login
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            (request.cookies as any).set(name, value, options);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            (supabaseResponse.cookies as any).set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // /upload 需要登录
  if (!user && request.nextUrl.pathname.startsWith('/upload')) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 已登录用户访问登录/注册页 → 重定向到首页
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/upload', '/auth/:path*'],
};
