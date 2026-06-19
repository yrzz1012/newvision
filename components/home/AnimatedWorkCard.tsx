'use client';

import { useEffect, useState } from 'react';
import WorkCard from '@/components/home/WorkCard';
import type { Work } from '@/lib/types';

interface AnimatedWorkCardProps {
  work: Work;
  index: number;
  onDelete?: (id: string) => void;
  showMenu?: boolean;
}

/**
 * 卡片入场动画 — 左上先出，向右下波浪扩散
 * 弹性缓出，丝滑自然
 */
export default function AnimatedWorkCard({ work, index, onDelete }: AnimatedWorkCardProps) {
  const [visible, setVisible] = useState(false);
  const cols = 4;
  const col = index % cols;
  const row = Math.floor(index / cols);
  // 左上先出：前列先、上行先
  const delay = col * 60 + row * 50;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="transition-all"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity 500ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      <WorkCard work={work} onDelete={onDelete} />
    </div>
  );
}
