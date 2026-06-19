import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.04] bg-bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
          <Link href="/" className="text-sm font-semibold text-text-primary">
            新视界
          </Link>

          <div className="flex items-center gap-6 text-sm text-text-tertiary">
            <Link href="/explore" className="hover:text-text-secondary transition-colors">发现</Link>
            <Link href="/explore?category=homestay" className="hover:text-text-secondary transition-colors">民宿</Link>
            <Link href="/explore?category=exhibition" className="hover:text-text-secondary transition-colors">展览</Link>
            <Link href="/explore?category=commercial" className="hover:text-text-secondary transition-colors">商业空间</Link>
          </div>

          <p className="text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} 新视界
          </p>
        </div>
      </div>
    </footer>
  );
}
