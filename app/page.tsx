import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/home/HomeClient';

/**
 * 首页 — 服务端获取数据，客户端组件负责交互
 */
export default async function HomePage() {
  const supabase = await createClient();

  // 并行获取精选和全部作品
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
