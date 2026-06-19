'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryLabels } from '@/lib/utils';

const categories = [
  { key: 'all', label: '精选', icon: true },
  { key: 'homestay', label: categoryLabels.homestay, icon: false },
  { key: 'exhibition', label: categoryLabels.exhibition, icon: false },
  { key: 'commercial', label: categoryLabels.commercial, icon: false },
];

interface CategoryNavProps {
  active?: string;
  onCategoryChange?: (key: string) => void;
}

export default function CategoryNav({ active = 'all', onCategoryChange }: CategoryNavProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-8">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onCategoryChange?.(cat.key)}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-5 py-2 text-sm transition-all duration-300',
            active === cat.key
              ? 'bg-accent-light text-accent font-medium ring-1 ring-accent/15'
              : 'text-text-secondary hover:bg-black/[0.03] hover:text-text-primary'
          )}
        >
          {cat.icon && <Sparkles className="h-3.5 w-3.5" />}
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
