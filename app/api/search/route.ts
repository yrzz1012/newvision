import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * GET /api/search?q=关键词&category=homestay
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const category = searchParams.get('category');

  if (!q || q.length < 1) {
    return NextResponse.json({ works: [], total: 0 });
  }

  const supabase = await createClient();

  let query = supabase
    .from('works')
    .select('*, profiles!inner(username, display_name, avatar_url)', { count: 'exact' })
    .eq('is_published', true)
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data: works, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ works: works ?? [], total: count ?? 0 });
}
