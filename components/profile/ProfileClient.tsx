'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Edit3, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/auth-store';
import WorkCard from '@/components/home/WorkCard';
import type { Profile, Work } from '@/lib/types';

interface ProfileClientProps {
  profile: Profile;
  works: Work[];
  isOwner: boolean;
}

export default function ProfileClient({ profile, works, isOwner }: ProfileClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const refreshProfile = useAuthStore((s) => s.refreshProfile);

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.display_name ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from('profiles')
      .update({ display_name: displayName, bio })
      .eq('id', profile.id);
    setLocalProfile((p) => ({ ...p, display_name: displayName, bio }));
    refreshProfile();
    setSaving(false);
    setEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const path = `${profile.id}/avatar.${file.name.split('.').pop()}`;
    await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
    const avatarUrl = urlData.publicUrl;

    await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', profile.id);
    setLocalProfile((p) => ({ ...p, avatar_url: avatarUrl }));
    refreshProfile();
    router.refresh();
  };

  return (
    <main className="min-h-screen pt-14">
      <div className="relative z-[1] rounded-t-[2rem] bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 lg:px-8">
        {/* ── 个人资料卡片 ── */}
        <div className="panel-float rounded-3xl p-8 text-center">
          <div className="relative mx-auto mb-4 inline-block">
            {localProfile.avatar_url ? (
              <img src={localProfile.avatar_url} alt="" className="h-24 w-24 rounded-full object-cover ring-2 ring-black/[0.04]" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/15 text-3xl font-semibold text-accent ring-2 ring-accent/10">
                {localProfile.username.charAt(0).toUpperCase()}
              </div>
            )}
            {isOwner && (
              <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white border border-black/[0.08] text-text-secondary shadow-sm hover:text-text-primary transition-colors">
                <Camera className="h-3.5 w-3.5" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            )}
          </div>

          <h1 className="text-xl font-semibold text-text-primary">
            {localProfile.display_name || localProfile.username}
          </h1>
          <p className="text-sm text-text-tertiary">@{localProfile.username}</p>

          {editing ? (
            <div className="mt-4 space-y-3">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="显示名称"
                className="w-full max-w-xs mx-auto h-10 rounded-xl border border-black/[0.08] bg-bg-secondary px-3 text-sm text-center outline-none focus:border-accent/30"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="介绍一下自己..."
                className="w-full max-w-xs mx-auto rounded-xl border border-black/[0.08] bg-bg-secondary px-3 py-2 text-sm text-center outline-none focus:border-accent/30 resize-none"
              />
              <div className="flex items-center justify-center gap-2">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white hover:bg-accent-hover transition-colors">
                  <Check className="h-3 w-3" /> {saving ? '保存中' : '保存'}
                </button>
                <button onClick={() => setEditing(false)} className="flex items-center gap-1 rounded-full bg-black/[0.04] px-4 py-1.5 text-xs font-medium text-text-secondary hover:bg-black/[0.08] transition-colors">
                  <X className="h-3 w-3" /> 取消
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              {localProfile.bio ? (
                <p className="text-sm text-text-secondary max-w-sm mx-auto">{localProfile.bio}</p>
              ) : (
                isOwner && <p className="text-sm text-text-tertiary">添加简介，让大家认识你</p>
              )}
              {isOwner && (
                <button
                  onClick={() => { setDisplayName(localProfile.display_name ?? ''); setBio(localProfile.bio ?? ''); setEditing(true); }}
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-black/[0.03] px-3 py-1.5 text-xs text-text-secondary hover:bg-black/[0.06] transition-colors"
                >
                  <Edit3 className="h-3 w-3" /> 编辑资料
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── 作品列表 ── */}
        <div className="mt-10">
          <div className="mb-6 flex items-baseline gap-3">
            <h2 className="text-lg font-medium text-text-primary">{isOwner ? '我的作品' : '作品'}</h2>
            <span className="text-sm text-text-tertiary">{works.length} 个</span>
          </div>
          {works.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {works.map((work) => (
                <WorkCard key={work.id} work={work} showMenu />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-black/[0.04] bg-bg-secondary/30 py-16 text-center">
              <p className="text-sm text-text-tertiary">{isOwner ? '还没有作品，快去上传吧' : '暂无作品'}</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </main>
  );
}
