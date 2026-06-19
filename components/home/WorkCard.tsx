'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, MoreHorizontal, Pencil, Trash2, Share2, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import type { Work } from '@/lib/types';
import { formatViews } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface WorkCardProps {
  work: Work;
  onDelete?: (id: string) => void;
  showMenu?: boolean; // 仅个人主页显示拓展菜单
}

export default function WorkCard({ work, onDelete, showMenu }: WorkCardProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isOwner = user?.id === work.user_id;

  const hasSplat = work.splat_file_url?.startsWith('https://superspl.at/');

  const goToDetail = () => router.push(`/work/${work.id}`);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定要删除这个作品吗？')) return;
    try {
      const res = await fetch(`/api/works?id=${work.id}`, { method: 'DELETE' });
      if (res.ok) onDelete?.(work.id);
    } catch { /* silent */ }
    setMenuOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/upload?edit=true');
    setMenuOpen(false);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/work/${work.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setMenuOpen(false);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div onClick={goToDetail} className="group relative cursor-pointer">
      <article className="panel-float rounded-2xl overflow-hidden h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-secondary shrink-0">
          {work.cover_url ? (
            <img src={work.cover_url} alt={work.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center"><span className="text-4xl opacity-20">3D</span></div>
          )}

          {/* 3D 标签 — Apple 液态玻璃风格 */}
          {hasSplat && (
            <div
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-xl"
              style={{
                background: 'rgba(255,255,255,0.30)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.5), inset 0 1px 2px rgba(255,255,255,0.3)',
              }}
            >
              <span
                className="text-sm font-bold tracking-tighter"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 1px 2px rgba(29,78,216,0.3))',
                }}
              >
                3D
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-text-primary truncate group-hover:text-accent transition-colors">{work.title}</h3>
          <p className="mt-1 text-sm text-text-secondary line-clamp-2 flex-1">{work.description || '暂无描述'}</p>
          <div className="mt-3 flex items-center text-xs text-text-tertiary">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{formatViews(work.view_count)}</span>
            </div>
          </div>
        </div>
      </article>

      {/* 三点菜单（仅作者可见） */}
      {showMenu && isOwner && (
        <div className="absolute bottom-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/85 backdrop-blur border border-black/[0.06] text-text-secondary shadow-sm transition-all opacity-0 group-hover:opacity-100 hover:bg-white hover:text-text-primary"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
              <div className="absolute bottom-10 right-0 z-30 w-36 rounded-xl border border-black/[0.06] bg-white/95 backdrop-blur-xl p-1 shadow-lg animate-fade-in">
                <button onClick={handleEdit} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-text-secondary rounded-lg hover:bg-black/[0.04] hover:text-text-primary transition-colors">
                  <Pencil className="h-3.5 w-3.5" /> 编辑信息
                </button>
                <button onClick={handleCopyLink} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-text-secondary rounded-lg hover:bg-black/[0.04] hover:text-text-primary transition-colors">
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Share2 className="h-3.5 w-3.5" />}
                  {copied ? '已复制' : '复制链接'}
                </button>
                <button onClick={handleDelete} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" /> 删除
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function WorkCardSkeleton() {
  return (
    <div className="panel-float rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="aspect-[4/3] skeleton shrink-0" />
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="h-5 w-3/4 rounded skeleton" />
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-1/2 rounded skeleton" />
      </div>
    </div>
  );
}
