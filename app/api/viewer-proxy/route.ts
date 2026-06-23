import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/viewer-proxy?splatId=xxx → 返回全屏 SuperSplat iframe 页面
 * web-view 加载此 URL，所有内容在同源下
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('splatId') || '';
  const src = id ? `https://superspl.at/s?id=${id}` : 'about:blank';

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>3D 漫游</title>
<style>*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden;background:#0a0a0f}iframe{position:fixed;top:0;left:0;width:100%;height:100%;border:none}</style>
</head>
<body>
<iframe src="${src}" allow="fullscreen;xr-spatial-tracking"></iframe>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
