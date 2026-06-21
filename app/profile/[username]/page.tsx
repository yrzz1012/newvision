import { createPublicClient } from '@/lib/supabase/public';
import { notFound } from 'next/navigation';
import ProfileClient from '@/components/profile/ProfileClient';
import type { Profile, Work } from '@/lib/types';

export const runtime = 'nodejs';

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = createPublicClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single();

  if (!profile) notFound();

  const { data: works } = await supabase
    .from('works')
    .select('*, profiles!inner(username, display_name, avatar_url)')
    .eq('user_id', (profile as Profile).id)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <ProfileClient
      profile={profile as Profile}
      works={(works ?? []) as Work[]}
      isOwner={false}
    />
  );
}
