'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { createClient } from '@/lib/supabase/client';

/**
 * AuthProvider — 挂载时初始化auth状态 + 监听auth变化
 * 包裹在layout中，全局可用
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();

    // 监听auth状态变化（登录/登出）
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      initialize();
    });

    return () => subscription.unsubscribe();
  }, [initialize]);

  return <>{children}</>;
}
