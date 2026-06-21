'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Work } from '@/lib/types';
import { categoryLabels } from '@/lib/utils';

const slidesBgs = [
  'from-[#c4cfe0] via-[#b0bdd4] to-[#9aaac6]',
  'from-[#d4c8b8] via-[#c4b5a2] to-[#b0a08c]',
  'from-[#b8d4c8] via-[#a2c4b4] to-[#8cb09e]',
  'from-[#d0bcc8] via-[#c0a8b8] to-[#b094a4]',
  'from-[#c8c0d8] via-[#b4a8c8] to-[#a090b4]',
];

interface HeroBannerProps { featuredWorks?: Work[] }

export default function HeroBanner({ featuredWorks }: HeroBannerProps) {
  const slides = featuredWorks && featuredWorks.length > 0
    ? featuredWorks.map((w, i) => ({
        id: w.id, title: w.title,
        subtitle: w.description || `${categoryLabels[w.category]} · 3D空间漫游`,
        cta: '立即漫游', href: `/work/${w.id}`,
        coverUrl: w.cover_url, bg: slidesBgs[i % slidesBgs.length],
      }))
    : [];

  const count = slides.length;
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goPrev = () => setCurrent((c) => (c - 1 + count) % count);
  const goNext = () => setCurrent((c) => (c + 1) % count);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, 6000);
  };

  useEffect(() => {
    if (count > 0) timerRef.current = setInterval(goNext, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  const handlePrev = () => { goPrev(); resetTimer(); };
  const handleNext = () => { goNext(); resetTimer(); };

  if (!count) return null;

  const cur = slides[current];

  return (
    <section className="relative">
      <div className="relative h-[33vh] min-h-[260px] max-h-[380px] w-full overflow-hidden">
        {slides.map((slide, i) => {
          const isFirst = i === 0;
          const bgImage = isFirst
            ? 'url(/images/hero/0eaf279beb086d3788bfe9d416eade46.png)'
            : (slide.coverUrl ? `url(${slide.coverUrl})` : '');

          return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isFirst ? '' : 'bg-gradient-to-br ' + slide.bg}`}
            style={{
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
              backgroundImage: bgImage || 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: isFirst ? 'normal' : (slide.coverUrl ? 'overlay' : 'normal'),
            }}
          >
            <div className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.25) 100%)' }} />
          </div>
          );
        })}

        {/* 文字 */}
        {cur.id === slides[0]?.id ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white text-center tracking-wide px-4 leading-snug"
              style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
              比图片更真实 <br className="md:hidden" />比视频更自由
            </h1>
          </div>
        ) : (
          <div className="absolute top-[70%] left-0 right-0 z-10 -translate-y-1/2">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{cur.title}</h2>
              <p className="mt-1 text-sm text-white/70">{cur.subtitle}</p>
              <Link href={cur.href} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-accent-hover active:scale-95 shadow-sm shadow-accent/20">
                {cur.cta} <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}

        {/* 左右按钮 */}
        {count > 1 && (
          <>
            <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/50 backdrop-blur border border-black/[0.06] text-text-secondary shadow-sm transition-all hover:bg-white/80 hover:text-text-primary">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/50 backdrop-blur border border-black/[0.06] text-text-secondary shadow-sm transition-all hover:bg-white/80 hover:text-text-primary">
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* 底部指示点 */}
        {count > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); resetTimer(); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  background: i === current ? '#fff' : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
