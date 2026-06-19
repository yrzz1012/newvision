import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/works/[id] — 获取单个作品详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const { data: work, error } = await supabase
    .from('works')
    .select('*, profiles!inner(username, display_name, avatar_url)')
    .eq('id', params.id)
    .single();

  if (error || !work) {
    return NextResponse.json({ error: '作品不存在' }, { status: 404 });
  }

  // 增加浏览量
  await supabase
    .from('works')
    .update({ view_count: (work.view_count ?? 0) + 1 })
    .eq('id', params.id);

  // 检查当前用户是否已收藏
  const { data: { user } } = await supabase.auth.getUser();
  let isFavorited = false;
  if (user) {
    const { data: fav } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('work_id', params.id)
      .maybeSingle();
    isFavorited = !!fav;
  }

  return NextResponse.json({ work: { ...work, view_count: (work.view_count ?? 0) + 1 }, isFavorited });
}
