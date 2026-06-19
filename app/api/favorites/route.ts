import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/favorites — 收藏作品
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const body = await request.json();
  const workId = body.work_id;
  if (!workId) return NextResponse.json({ error: '缺少 work_id' }, { status: 400 });

  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: user.id, work_id: workId });

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/**
 * DELETE /api/favorites — 取消收藏
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const body = await request.json();
  const workId = body.work_id;
  if (!workId) return NextResponse.json({ error: '缺少 work_id' }, { status: 400 });

  await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('work_id', workId);

  return NextResponse.json({ success: true });
}

/**
 * GET /api/favorites — 获取收藏列表
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ favorites: [] });

  const { data } = await supabase
    .from('favorites')
    .select('*, works(*, profiles!inner(username, display_name, avatar_url))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ favorites: data ?? [] });
}
