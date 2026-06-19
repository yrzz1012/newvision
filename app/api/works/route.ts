import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const VALID_CATEGORIES = ['homestay', 'exhibition', 'commercial', 'other'];

/**
 * DELETE /api/works?id=xxx — 删除作品（仅作者）
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: '缺少作品 ID' }, { status: 400 });

  const { error } = await supabase
    .from('works')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

/**
 * POST /api/works — 创建作品
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  // 安全解析 JSON
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 });
  }

  const { title, description, category, cover_url, splat_file_url, splat_original_url, tags, photos, is_published } = body;

  // 校验必填字段
  if (!title || !title.trim()) return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
  if (!splat_file_url) return NextResponse.json({ error: '请提供 3D 文件或 supersplat 链接' }, { status: 400 });

  // 校验分类
  const validCategory = VALID_CATEGORIES.includes(category) ? category : 'other';

  const { data: work, error } = await supabase
    .from('works')
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: (description ?? '').trim(),
      category: validCategory,
      cover_url: cover_url ?? null,
      splat_file_url,
      splat_original_url: splat_original_url ?? splat_file_url,
      tags: Array.isArray(tags) ? tags : [],
      photos: Array.isArray(photos) ? photos : [],
      is_published: is_published ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ work }, { status: 201 });
}

/**
 * GET /api/works?category=homestay&featured=true&search=关键词&page=1&limit=12
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '12'), 50);

  const supabase = await createClient();

  let query = supabase
    .from('works')
    .select('*, profiles!inner(username, display_name, avatar_url)', { count: 'exact' })
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  // 分类筛选
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  // 精选筛选
  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  // 搜索
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  // 分页
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data: works, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    works: works ?? [],
    total: count ?? 0,
    page,
    limit,
  });
}
