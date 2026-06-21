import { createPublicClient } from '@/lib/supabase/public';
import HomeClient from '@/components/home/HomeClient';

export const runtime = 'nodejs';

/**
 * 首页 — SSR 数据获取（公开数据，无需登录）
 */
export default async function HomePage() {
  const supabase = createPublicClient();

  const [featuredResult, worksResult] = await Promise.all([
    supabase
      .from('works')
      .select('*, profiles!inner(username, display_name, avatar_url)')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('works')
      .select('*, profiles!inner(username, display_name, avatar_url)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(12),
  ]);

  return (
    <HomeClient
      initialFeatured={featuredResult.data ?? []}
      initialWorks={worksResult.data ?? []}
    />
  );
}
