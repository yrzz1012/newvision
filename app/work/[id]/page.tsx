import { createClient } from '@/lib/supabase/server';
import WorkDetailClient from '@/components/work/WorkDetailClient';
import { notFound } from 'next/navigation';

export default async function WorkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: work } = await supabase
    .from('works')
    .select('*, profiles!inner(username, display_name, avatar_url)')
    .eq('id', params.id)
    .single();

  if (!work) notFound();

  // 增加浏览计数
  await supabase
    .from('works')
    .update({ view_count: (work.view_count ?? 0) + 1 })
    .eq('id', params.id);

  return (
    <WorkDetailClient work={{ ...work, view_count: (work.view_count ?? 0) + 1 }} />
  );
}
