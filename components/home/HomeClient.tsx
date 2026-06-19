'use client';

import { useState, useCallback } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryNav from '@/components/layout/CategoryNav';
import { WorkCardSkeleton } from '@/components/home/WorkCard';
import AnimatedWorkCard from '@/components/home/AnimatedWorkCard';
import type { Work } from '@/lib/types';

interface HomeClientProps {
  initialFeatured: Work[];
  initialWorks: Work[];
}

export default function HomeClient({ initialFeatured, initialWorks }: HomeClientProps) {
  const [works, setWorks] = useState<Work[]>(initialWorks);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [animKey, setAnimKey] = useState(0); // 切换时重置动画

  const handleCategoryChange = useCallback(async (category: string) => {
    setActiveCategory(category);
    setLoading(true);
    setAnimKey(k => k + 1); // 重置动画
    try {
      const params = new URLSearchParams({ limit: '12' });
      if (category !== 'all') params.set('category', category);
      const res = await fetch(`/api/works?${params}`);
      if (res.ok) {
        const data = await res.json();
        setWorks(data.works);
      }
    } catch {
      // keep current
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = (id: string) => {
    setWorks((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <main>
      <HeroBanner featuredWorks={initialFeatured} />

      {/* 副栏及以下 — 白色圆角面板，色块从两侧透出 */}
      <div className="relative z-[1] -mt-6 rounded-t-[2rem] bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <CategoryNav active={activeCategory} onCategoryChange={handleCategoryChange} />
        </div>

        <section className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
          {loading && (
            <div className="mb-5 flex items-center justify-end">
              <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                <span className="h-2.5 w-2.5 animate-spin rounded-full border border-text-tertiary border-t-transparent" />
                加载中...
              </span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <WorkCardSkeleton key={i} />
              ))}
            </div>
          ) : works.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" key={animKey}>
              {works.map((work, i) => (
                <AnimatedWorkCard key={work.id} work={work} index={i} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/[0.03] text-2xl">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-text-tertiary">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <h3 className="text-base font-medium text-text-secondary">暂无作品</h3>
      <p className="mt-1 text-sm text-text-tertiary">成为第一个分享 3D 空间的创作者吧</p>
    </div>
  );
}
