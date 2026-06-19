'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import CategoryNav from '@/components/layout/CategoryNav';
import { WorkCardSkeleton } from '@/components/home/WorkCard';
import AnimatedWorkCard from '@/components/home/AnimatedWorkCard';
import type { Work } from '@/lib/types';

interface ExploreClientProps {
  initialWorks: Work[];
  initialCategory: string;
  initialSearch: string;
}

export default function ExploreClient({
  initialWorks,
  initialCategory,
  initialSearch,
}: ExploreClientProps) {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>(initialWorks);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const handleDelete = (id: string) => {
    setWorks((prev) => prev.filter((w) => w.id !== id));
  };

  const fetchWorks = useCallback(async (category: string, search: string) => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '24' });
    if (category !== 'all') params.set('category', category);
    if (search) params.set('search', search);
    try {
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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setAnimKey(k => k + 1);
    router.push(`/explore${category !== 'all' ? `?category=${category}` : ''}`);
    fetchWorks(category, searchInput);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setAnimKey(k => k + 1);
    router.push(`/explore${trimmed ? `?q=${encodeURIComponent(trimmed)}` : ''}`);
    fetchWorks(activeCategory, trimmed);
  };

  const title = initialSearch
    ? `搜索: "${initialSearch}"`
    : activeCategory === 'all'
      ? '发现空间'
      : '分类浏览';

  return (
    <main className="min-h-screen pt-14">
      <div className="relative z-[1] rounded-t-[2rem] bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-medium tracking-tight text-text-primary">{title}</h1>
          <form onSubmit={handleSearch} className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="搜索空间..."
              className="w-full h-11 rounded-xl border border-black/[0.08] bg-bg-secondary pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-black/[0.15] focus:bg-white"
            />
          </form>
        </div>

        <CategoryNav active={activeCategory} onCategoryChange={handleCategoryChange} />

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <WorkCardSkeleton key={i} />
            ))}
          </div>
        ) : works.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" key={animKey}>
            {works.map((work, i) => (
              <AnimatedWorkCard key={work.id} work={work} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-text-tertiary">
              {initialSearch ? `未找到与 "${initialSearch}" 相关的作品` : '暂无可浏览的作品'}
            </p>
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
