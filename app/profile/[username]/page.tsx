import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProfileClient from '@/components/profile/ProfileClient';
import type { Work } from '@/lib/types';

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = await createClient();

  // 获取用户
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single();

  if (!profile) notFound();

  // 获取该用户的作品
  const { data: works } = await supabase
    .from('works')
    .select('*, profiles!inner(username, display_name, avatar_url)')
    .eq('user_id', profile.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  // 判断是否是本人在看
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === profile.id;

  return (
    <ProfileClient
      profile={profile}
      works={(works ?? []) as Work[]}
      isOwner={isOwner}
    />
  );
}
