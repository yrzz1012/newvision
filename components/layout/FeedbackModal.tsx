'use client';

import { useState } from 'react';
import { X, MessageSquare, Send, Loader2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function FeedbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const supabase = createClient();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError('');

    try {
      const { error: insertErr } = await supabase.from('feedbacks').insert({
        message: message.trim(),
        email: email.trim() || null,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
      });

      if (insertErr) throw new Error(insertErr.message);
      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
        setMessage('');
        setEmail('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || '发送失败，请重试');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[90] mx-auto max-w-md">
        <div className="rounded-3xl border border-white/20 bg-white/90 backdrop-blur-2xl shadow-[0_16px_64px_rgba(0,0,0,0.12)] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10">
                <MessageSquare className="h-4 w-4 text-accent" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">反馈</h2>
            </div>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.04] text-text-secondary hover:bg-black/[0.08]">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <Check className="h-7 w-7 text-green-500" />
              </div>
              <p className="text-sm font-medium text-text-primary">感谢你的反馈！</p>
              <p className="text-xs text-text-tertiary">我们会认真对待每一条建议</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">你的想法或建议</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  required
                  placeholder="请告诉我们你的使用体验、功能建议或遇到的 bug..."
                  className="w-full rounded-xl border border-black/[0.08] bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-accent/30 focus:bg-white resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">联系方式（选填）</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="你的邮箱，方便我们回复"
                  className="w-full h-10 rounded-xl border border-black/[0.08] bg-bg-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-accent/30 focus:bg-white"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <button type="submit" disabled={sending}
                className={cn(
                  'w-full h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all',
                  sending ? 'bg-accent/60 text-white cursor-not-allowed' : 'bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/20'
                )}>
                {sending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />发送中...</>
                ) : (
                  <><Send className="h-3.5 w-3.5" />发送反馈</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
