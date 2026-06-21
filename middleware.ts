import { NextResponse, type NextRequest } from 'next/server';

/**
 * 路由中间件 — 保护需登录的页面
 * 通过检查 supabase auth cookie 判断登录状态（不引入 Supabase 库，兼容 Edge Runtime）
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查是否有 Supabase auth cookie（格式：sb-xxx-auth-token）
  const hasAuthCookie = request.cookies.getAll().some((c) =>
    c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  );

  // /upload 需要登录
  if (!hasAuthCookie && pathname.startsWith('/upload')) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 已登录用户访问登录/注册页 → 重定向到首页
  if (hasAuthCookie && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/upload', '/auth/:path*'],
};
