import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';

export const runtime = 'nodejs';

/**
 * GET /api/works/[id] — 获取单个作品详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 公开查询作品数据（无需登录）
  const pub = createPublicClient();
  const { data: work, error } = await pub
    .from('works')
    .select('*, profiles!inner(username, display_name, avatar_url)')
    .eq('id', params.id)
    .single();

  if (error || !work) {
    return NextResponse.json({ error: '作品不存在' }, { status: 404 });
  }

  const workData = work as any;
  // 增加浏览量
  try {
    await (pub.from('works') as any).update({ view_count: (workData.view_count ?? 0) + 1 }).eq('id', params.id);
  } catch {}

  // 检查当前用户是否已收藏（需要 Cookie，可能失败则忽略）
  let isFavorited = false;
  try {
    const auth = await createClient();
    const { data: { user } } = await auth.auth.getUser();
    if (user) {
      const { data: fav } = await pub
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('work_id', params.id)
        .maybeSingle();
      isFavorited = !!fav;
    }
  } catch {}

  return NextResponse.json({ work: { ...workData, view_count: (workData.view_count ?? 0) + 1 }, isFavorited });
}
