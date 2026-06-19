'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, Heart, Eye, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import SplatViewer from '@/components/viewer/SplatViewer';
import { useAuthStore } from '@/lib/auth-store';
import type { Work } from '@/lib/types';
import { cn, formatViews, timeAgo, categoryLabels } from '@/lib/utils';

export default function WorkDetailClient({ work }: { work: Work }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const handleFavorite = async () => {
    if (!user) { router.push('/auth/login'); return; }
    const res = await fetch('/api/favorites', {
      method: isFavorited ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ work_id: work.id }),
    });
    if (res.ok) { setIsFavorited(!isFavorited); setFavCount(c => isFavorited ? c - 1 : c + 1); }
  };

  const hasCloudSplat = work.splat_file_url?.startsWith('https://superspl.at/');
  const photos = work.photos ?? [];

  type CarouselItem = { type: '3d' } | { type: 'photo'; src: string };
  const items: CarouselItem[] = [];
  if (hasCloudSplat) items.push({ type: '3d' });
  photos.forEach(src => items.push({ type: 'photo', src }));

  const prev = () => setActiveSlide(p => (p === 0 ? items.length - 1 : p - 1));
  const next = () => setActiveSlide(p => (p === items.length - 1 ? 0 : p + 1));

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="fixed inset-x-0 top-16 bottom-0 z-50 mx-auto max-w-5xl flex flex-col overflow-hidden">
        <div className="relative flex flex-col overflow-hidden rounded-t-3xl border border-white/20 bg-white/90 backdrop-blur-2xl shadow-[0_-8px_48px_rgba(0,0,0,0.12)] h-full">
          <button onClick={handleClose}
            className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur text-white/80 transition-all hover:bg-black/60 hover:text-white">
            <X className="h-4 w-4" />
          </button>

          {/* ── 上部：轮播区 ── */}
          <div className="relative shrink-0 bg-[#0a0a0f]">
            <div className="aspect-[16/9] w-full relative">
              {items.map((item, i) => (
                <div key={i} className={cn(
                  'absolute inset-0 transition-opacity duration-300',
                  activeSlide === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                )}>
                  {item.type === '3d' ? (
                    <SplatViewer sceneUrl={work.splat_file_url!} className="h-full w-full rounded-none" />
                  ) : (
                    <img src={item.src} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
              ))}

              {items.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/10 text-white transition-all hover:bg-white/20">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/10 text-white transition-all hover:bg-white/20">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {items.map((_, i) => (
                      <button key={i} onClick={() => setActiveSlide(i)}
                        className={cn('rounded-full transition-all duration-300', activeSlide === i ? 'bg-white w-6 h-1.5' : 'bg-white/30 w-1.5 h-1.5')} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── 下部：信息面板 ── */}
          <div className="flex-1 overflow-y-auto bg-white px-5 py-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">{categoryLabels[work.category]}</span>
                  {work.is_featured && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">精选</span>}
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">{work.title}</h1>
              </div>
              <button onClick={handleFavorite} className={cn(
                'shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all',
                isFavorited ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-black/[0.03] text-text-secondary hover:bg-black/[0.06]'
              )}>
                <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} /> {favCount || '收藏'}
              </button>
            </div>

            {work.description && <p className="text-sm text-text-secondary leading-relaxed mb-4">{work.description}</p>}

            <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary mb-3">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatViews(work.view_count)} 浏览</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(work.created_at)}</span>
            </div>

            {work.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {work.tags.map(t => <span key={t} className="rounded-full bg-black/[0.03] px-2.5 py-1 text-[11px] text-text-tertiary">{t}</span>)}
              </div>
            )}

            <div className="rounded-xl border border-black/[0.04] bg-bg-secondary/30 p-3 flex items-center gap-3">
              {work.profiles?.avatar_url ? (
                <img src={work.profiles.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">{work.profiles?.username?.charAt(0).toUpperCase()}</div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{work.profiles?.display_name || work.profiles?.username}</p>
                <p className="text-xs text-text-tertiary">@{work.profiles?.username}</p>
              </div>
              <Link href={`/profile/${work.profiles?.username}`} className="ml-auto shrink-0 flex items-center gap-1 rounded-full bg-black/[0.03] px-3 py-1.5 text-xs text-text-secondary hover:bg-black/[0.06]">
                更多作品 <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
