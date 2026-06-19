'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await signUp(email, password, username);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess('注册成功！请检查邮箱确认链接。');
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-radial-glow pt-14 px-4">
      <div className="w-full max-w-md">
        {/* 标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-light tracking-tight text-text-primary">
            创建账号
          </h1>
          <p className="mt-2 text-text-secondary">
            加入 3D Space，分享你的空间作品
          </p>
        </div>

        {/* 表单卡片 */}
        <div className="panel-float rounded-3xl p-8">
          {/* 成功提示 */}
          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="你的昵称"
                  required
                  minLength={2}
                  maxLength={30}
                  className="w-full h-11 rounded-xl border border-black/08 bg-bg-secondary pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-glass-focus focus:bg-glass-hover"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full h-11 rounded-xl border border-black/08 bg-bg-secondary pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-glass-focus focus:bg-glass-hover"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少6位"
                  required
                  minLength={6}
                  className="w-full h-11 rounded-xl border border-black/08 bg-bg-secondary pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-glass-focus focus:bg-glass-hover"
                />
              </div>
            </div>

            {/* 提交 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-accent text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          {/* 底部链接 */}
          <p className="mt-6 text-center text-sm text-text-tertiary">
            已有账号？{' '}
            <Link href="/auth/login" className="text-accent hover:text-accent-hover transition-colors">
              去登录
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
