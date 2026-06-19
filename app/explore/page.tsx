import { createClient } from '@/lib/supabase/server';
import ExploreClient from '@/components/home/ExploreClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '发现空间',
  description: '浏览酒店、民宿、展览、商业空间的 3D 全景漫游作品',
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const supabase = await createClient();

  let query = supabase
    .from('works')
    .select('*, profiles!inner(username, display_name, avatar_url)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(24);

  const category = searchParams.category;
  const searchQuery = searchParams.q;

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  const { data: works } = await query;

  return (
    <ExploreClient
      initialWorks={works ?? []}
      initialCategory={category ?? 'all'}
      initialSearch={searchQuery ?? ''}
    />
  );
}
