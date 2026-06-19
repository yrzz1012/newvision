'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, User, Upload, LogOut, Settings, ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth-store';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const noHeroPage = pathname.startsWith('/upload') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/explore') ||
    pathname.startsWith('/tutorial') ||
    pathname.startsWith('/work');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // 路由变化关闭移动菜单
  useEffect(() => setMobileOpen(false), [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (q) router.push(`/explore?q=${encodeURIComponent(q)}`);
  };

  const opaque = noHeroPage || scrolled;
  const overHero = !opaque;

  return (
    <>
      <header
        className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300')}
        style={{
          background: opaque ? 'rgba(255,255,255,0.80)' : 'transparent',
          backdropFilter: opaque ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: opaque ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: opaque ? '1px solid rgba(0,0,0,0.06)' : 'none',
          boxShadow: opaque ? '0 1px 4px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* ── 左侧：Logo ── */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-center">
              <span className={cn(
                'text-lg font-semibold tracking-tight transition-colors duration-300 lg:text-xl',
                overHero ? 'text-white' : 'text-text-primary'
              )}>
                新视界
              </span>
            </Link>

            {/* 桌面导航 */}
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink href="/" active={pathname === '/'} overHero={overHero}>首页</NavLink>
              <NavLink href="/tutorial" overHero={overHero}>教程</NavLink>
            </nav>
          </div>

          {/* ── 右侧 ── */}
          <div className="flex items-center gap-2">
            {/* 搜索 - 桌面 */}
            <div className="hidden items-center md:flex">
              <form onSubmit={handleSearch} className="relative">
                <Search className={cn(
                  'absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors',
                  overHero ? 'text-white/60' : 'text-text-tertiary'
                )} />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="搜索"
                  className={cn(
                    'h-8 w-40 rounded-full border pl-8 pr-3 text-sm outline-none backdrop-blur transition-all placeholder:text-white/50 focus:w-56',
                    overHero
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/20'
                      : 'bg-black/[0.02] border-black/[0.06] text-text-primary placeholder:text-text-tertiary focus:border-black/[0.15] focus:bg-white/60'
                  )}
                />
              </form>
            </div>

            {/* 上传 */}
            <Link
              href="/upload"
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium lg:px-4',
                'bg-accent text-white shadow-sm shadow-accent/20',
                'transition-all hover:bg-accent-hover hover:shadow-md hover:shadow-accent/25 active:scale-95'
              )}
            >
              <Upload className="h-3 w-3" />
              <span className="hidden sm:inline">上传</span>
            </Link>

            {/* 个人 */}
            {user && profile ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 rounded-full p-0.5 transition-all hover:bg-black/[0.04]">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover ring-1 ring-black/[0.08]" />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent ring-1 ring-accent/20">
                      {profile.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className={cn('hidden h-3 w-3 text-text-tertiary transition-transform sm:block', dropdownOpen && 'rotate-180')} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-black/[0.06] bg-white/95 backdrop-blur-2xl p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.08)] animate-fade-in">
                    <Link href={`/profile/${profile.username}`} onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary rounded-xl hover:bg-black/[0.04] hover:text-text-primary transition-all">
                      <Settings className="h-4 w-4" /> 个人主页
                    </Link>
                    <button onClick={() => { signOut(); setDropdownOpen(false); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                      <LogOut className="h-4 w-4" /> 退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login"
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border backdrop-blur transition-all',
                  overHero ? 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                    : 'bg-white/40 border-black/[0.08] text-text-tertiary hover:border-black/[0.16] hover:text-text-secondary'
                )}>
                <User className="h-3.5 w-3.5" />
              </Link>
            )}

            {/* ── 汉堡菜单 - 移动端 ── */}
            <button
              onClick={() => setMobileOpen(true)}
              className={cn(
                'md:hidden flex h-7 w-7 items-center justify-center rounded-full transition-colors',
                overHero ? 'text-white hover:bg-white/10' : 'text-text-secondary hover:bg-black/[0.04]'
              )}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── 移动端侧滑菜单 ── */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-white shadow-2xl animate-slide-up md:hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
              <span className="text-lg font-semibold text-text-primary">菜单</span>
              <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] text-text-secondary hover:bg-black/[0.08]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-1">
              <MobileLink href="/" active={pathname === '/'} onClick={() => setMobileOpen(false)}>首页</MobileLink>
              <MobileLink href="/tutorial" onClick={() => setMobileOpen(false)}>教程</MobileLink>

              <div className="my-3 border-t border-black/[0.04]" />

              {/* 移动端搜索 */}
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(e); setMobileOpen(false); }} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="搜索空间..."
                  className="w-full h-10 rounded-xl border border-black/[0.08] bg-bg-secondary pl-10 pr-3 text-sm outline-none focus:border-black/[0.15]"
                />
              </form>

              <MobileLink href="/upload" onClick={() => setMobileOpen(false)}>上传作品</MobileLink>
              {user ? (
                <>
                  <MobileLink href={`/profile/${profile?.username}`} onClick={() => setMobileOpen(false)}>个人主页</MobileLink>
                  <button onClick={() => { signOut(); setMobileOpen(false); }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-text-secondary rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                    <LogOut className="h-4 w-4" /> 退出登录
                  </button>
                </>
              ) : (
                <MobileLink href="/auth/login" onClick={() => setMobileOpen(false)}>登录</MobileLink>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function NavLink({ href, active, overHero, children }: { href: string; active?: boolean; overHero?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn(
      'rounded-full px-4 py-1.5 text-sm transition-all',
      overHero && !active ? 'text-white/80 hover:bg-white/10 hover:text-white' : '',
      overHero && active ? 'bg-white/15 text-white font-medium' : '',
      !overHero && active ? 'bg-black/[0.04] text-text-primary font-medium' : '',
      !overHero && !active ? 'text-text-secondary hover:bg-black/[0.03] hover:text-text-primary' : '',
    )}>{children}</Link>
  );
}

function MobileLink({ href, active, children, onClick }: { href: string; active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all',
        active ? 'bg-accent-light text-accent font-medium' : 'text-text-secondary hover:bg-black/[0.03] hover:text-text-primary'
      )}>
      {children}
    </Link>
  );
}
