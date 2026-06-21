'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Image, X, Loader2, Check, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { categoryLabels } from '@/lib/utils';
import type { WorkCategory } from '@/lib/types';

interface UploadFormProps {
  userId: string;
  isEdit?: boolean;
}

const categories: { value: WorkCategory; label: string }[] = [
  { value: 'homestay', label: categoryLabels.homestay },
  { value: 'exhibition', label: categoryLabels.exhibition },
  { value: 'commercial', label: categoryLabels.commercial },
  { value: 'other', label: categoryLabels.other },
];

/** Canvas 压缩图片：限制 1920px 宽 + JPEG 0.8 质量 */
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxW = 1920;
      let w = img.width;
      let h = img.height;
      if (w > maxW) { h = (h * maxW) / w; w = maxW; }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('压缩失败'));
      }, 'image/jpeg', 0.8);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function UploadForm({ userId, isEdit }: UploadFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // ── 表单字段 ──
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkCategory>('homestay');
  const [tagsText, setTagsText] = useState('');

  // ── supersplat 链接 ──
  const [splatLink, setSplatLink] = useState('');
  const [splatLinkDetected, setSplatLinkDetected] = useState(false);

  // ── 多图上传 ──
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  // ── 识别 supersplat 链接 ──
  const extractSupersplatUrl = (input: string): string | null => {
    const iframeMatch = input.match(/src=["'](https:\/\/superspl\.at\/[^"']+)["']/i);
    if (iframeMatch) return normalizeUrl(iframeMatch[1]);
    const urlMatch = input.match(/https:\/\/superspl\.at\/[^\s<>"']+/i);
    if (urlMatch) return normalizeUrl(urlMatch[0]);
    const idMatch = input.match(/(?:s\?id=|scene\/)([a-f0-9]+)/i);
    if (idMatch) return `https://superspl.at/s?id=${idMatch[1]}`;
    return null;
  };

  const normalizeUrl = (url: string): string => {
    const m = url.match(/superspl\.at\/scene\/([a-f0-9]+)/i);
    if (m) return `https://superspl.at/s?id=${m[1]}`;
    return url;
  };

  const handleSplatLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const extracted = extractSupersplatUrl(raw);
    if (extracted && extracted !== raw) {
      setSplatLink(extracted);
      setSplatLinkDetected(true);
      setTimeout(() => setSplatLinkDetected(false), 3000);
    } else {
      setSplatLink(raw);
      setSplatLinkDetected(false);
    }
  };

  // ── 多图选择 ──
  const handlePhotosSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      setError('部分文件不是图片格式，已跳过');
    }
    if (validFiles.length === 0) return;

    setPhotoFiles((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((f) => URL.createObjectURL(f));
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── 提交 ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('请输入作品标题'); return; }
    if (!splatLink.trim()) { setError('请粘贴 supersplat 场景链接'); return; }

    setUploading(true);
    setError('');

    try {
      const photoUrls: string[] = [];

      // 1. 上传所有照片
      for (let i = 0; i < photoFiles.length; i++) {
        setProgress(`上传图片 ${i + 1}/${photoFiles.length}...`);
        const compressed = await compressImage(photoFiles[i]);
        const photoPath = `${userId}/${Date.now()}_${i}.jpg`;
        const { error: uploadErr } = await supabase.storage
          .from('covers')
          .upload(photoPath, compressed, { upsert: true, contentType: 'image/jpeg' });
        if (uploadErr) throw new Error(`图片上传失败: ${uploadErr.message}`);
        const { data: urlData } = supabase.storage.from('covers').getPublicUrl(photoPath);
        photoUrls.push(urlData.publicUrl);
      }

      // 2. 创建作品记录（cover_url = 第一张，photos = 全部）
      setProgress('创建作品...');
      const tags = tagsText.split(/[,，]/).map((t) => t.trim()).filter(Boolean);

      const res = await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          cover_url: photoUrls[0] || null,
          photos: photoUrls,
          splat_file_url: splatLink.trim(),
          splat_original_url: splatLink.trim(),
          tags,
          is_published: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '创建失败');
      }

      const { work } = await res.json();
      router.push(`/work/${work.id}`);
    } catch (err: any) {
      setError(err.message || '上传失败，请重试');
    } finally {
      setUploading(false);
      setProgress('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── 错误提示 ── */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} className="shrink-0 ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── supersplat 链接 ── */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          3D 场景链接 <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          <input
            type="text"
            value={splatLink}
            onChange={handleSplatLinkChange}
            placeholder="粘贴 supersplat 链接或整个 iframe 代码"
            className={cn(
              'w-full h-11 rounded-xl border px-4 text-sm outline-none transition-all',
              splatLinkDetected
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-black/[0.08] bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:border-black/[0.15] focus:bg-white'
            )}
          />
          {splatLinkDetected ? (
            <p className="text-xs text-green-600 flex items-center gap-1"><Check className="h-3 w-3" /> 已自动识别链接</p>
          ) : (
            <p className="text-xs text-text-tertiary">支持直接粘贴 iframe 嵌入代码，自动提取链接</p>
          )}
        </div>
      </div>

      {/* ── 多图上传 ── */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          作品图片
          <span className="text-text-tertiary text-xs font-normal ml-2">（第一张作为封面，上传后自动压缩）</span>
        </label>

        {/* 图片预览网格 */}
        {photoPreviews.length > 0 && (
          <div className="mb-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {photoPreviews.map((preview, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black/[0.04]">
                <img src={preview} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white/80 text-xs hover:bg-black/60"
                >
                  <X className="h-3 w-3" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/50 backdrop-blur px-2 py-0.5 text-[10px] text-white/90">
                    封面
                  </span>
                )}
              </div>
            ))}

            {/* 添加更多图片按钮 */}
            <div
              onClick={() => photoInputRef.current?.click()}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-black/[0.08] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-accent/40 transition-all text-text-tertiary"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">添加</span>
            </div>
          </div>
        )}

        {/* 空状态 — 上传区 */}
        {photoPreviews.length === 0 && (
          <div
            onClick={() => photoInputRef.current?.click()}
            className="aspect-video rounded-2xl border-2 border-dashed border-black/[0.08] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent/40 transition-all text-text-tertiary"
          >
            <Image className="h-6 w-6" />
            <span className="text-sm">点击上传作品图片</span>
            <span className="text-xs">可上传多张，支持左右滑动浏览</span>
          </div>
        )}

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotosSelect}
          className="hidden"
        />
      </div>

      {/* ── 标题 ── */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">作品标题 <span className="text-red-400">*</span></label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100}
          placeholder="给你的作品起个名字..."
          className="w-full h-11 rounded-xl border border-black/[0.08] bg-bg-secondary px-4 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-black/[0.15] focus:bg-white" />
      </div>

      {/* ── 描述 ── */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">描述</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500}
          placeholder="介绍一下这个空间..."
          className="w-full rounded-xl border border-black/[0.08] bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-black/[0.15] focus:bg-white resize-none" />
      </div>

      {/* ── 分类 ── */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">分类</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
              className={cn('rounded-full px-4 py-2 text-sm transition-all',
                category === cat.value
                  ? 'bg-accent-light text-accent font-medium ring-1 ring-accent/20'
                  : 'bg-black/[0.02] text-text-secondary hover:bg-black/[0.05]')}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 标签 ── */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          标签 <span className="text-text-tertiary text-xs font-normal">（逗号分隔）</span>
        </label>
        <input type="text" value={tagsText} onChange={(e) => setTagsText(e.target.value)}
          placeholder="山景, 木屋, 瑞士..."
          className="w-full h-11 rounded-xl border border-black/[0.08] bg-bg-secondary px-4 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-black/[0.15] focus:bg-white" />
      </div>

      {/* ── 提交 ── */}
      <button type="submit" disabled={uploading}
        className={cn('w-full h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]',
          uploading ? 'bg-accent/60 text-white cursor-not-allowed' : 'bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/20')}>
        {uploading ? (
          <><Loader2 className="h-4 w-4 animate-spin" />{progress || '上传中...'}</>
        ) : (
          <><Upload className="h-4 w-4" />{isEdit ? '保存修改' : '发布作品'}</>
        )}
      </button>
    </form>
  );
}
