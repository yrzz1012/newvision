import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import UploadForm from '@/components/upload/UploadForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '上传作品',
  description: '上传你的 3D 高斯泼溅作品，分享空间体验',
};

export default async function UploadPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const isEdit = searchParams.edit === 'true';

  return (
    <main className="min-h-screen bg-radial-glow pt-14">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-10 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            {isEdit ? '编辑作品' : '上传作品'}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {isEdit ? '修改作品信息' : '分享你的 3D 空间作品'}
          </p>
        </div>
        <UploadForm userId={user.id} isEdit={isEdit} />
      </div>
    </main>
  );
}
