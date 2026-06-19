'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;

  /** 初始化 — 检查当前会话并加载profile */
  initialize: () => Promise<void>;

  /** 注册 */
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>;

  /** 登录 */
  signIn: (email: string, password: string) => Promise<{ error?: string }>;

  /** 登出 */
  signOut: () => Promise<void>;

  /** 刷新profile */
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        set({ user, profile, isLoading: false, isInitialized: true });
      } else {
        set({ user: null, profile: null, isLoading: false, isInitialized: true });
      }
    } catch {
      set({ user: null, profile: null, isLoading: false, isInitialized: true });
    }
  },

  signUp: async (email, password, username) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) return { error: error.message };

    // 如果开启了邮箱确认，用户不会立即登录
    if (data.user && !data.session) {
      return {};
    }

    // 未开邮箱确认时直接登录
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      set({ user: data.user, profile });
    }
    return {};
  },

  signIn: async (email, password) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    set({ user: data.user, profile });
    return {};
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const supabase = createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (profile) set({ profile });
  },
}));
