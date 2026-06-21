import { createPublicClient } from '@/lib/supabase/public';
import WorkDetailClient from '@/components/work/WorkDetailClient';
import type { Work } from '@/lib/types';
import { notFound } from 'next/navigation';

export const runtime = 'nodejs';

export default async function WorkDetailPage({ params }: { params: { id: string } }) {
  const supabase = createPublicClient();

  const { data } = await supabase
    .from('works')
    .select('*, profiles!inner(username, display_name, avatar_url)')
    .eq('id', params.id)
    .single();

  const work = data as Work | null;
  if (!work) notFound();

  try { await (supabase as any).from('works').update({ view_count: (work.view_count ?? 0) + 1 }).eq('id', params.id); } catch {}

  return <WorkDetailClient work={{ ...work, view_count: (work.view_count ?? 0) + 1 }} />;
}
