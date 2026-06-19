import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '教程',
  description: '学习如何拍摄、处理并上传 3D 空间作品',
};

export default function TutorialPage() {
  return (
    <main className="min-h-screen pt-14">
      <div className="relative z-[1] rounded-t-[2rem]">
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-20 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-light">
              <span className="text-4xl">📖</span>
            </div>
            <h1 className="text-2xl font-semibold text-text-primary mb-3">
              敬请期待
            </h1>
            <p className="text-text-secondary max-w-md">
              教程内容正在筹备中，我们将为你带来 3D 空间拍摄、处理与上传的完整指南。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
