/**
 * 详情页 Loading — 与真实面板结构完全一致，消除闪烁
 * 遮罩 + 面板骨架同步渲染，视觉上无缝过渡
 */
export default function WorkDetailLoading() {
  return (
    <>
      {/* 遮罩 — 与 WorkDetailClient 完全相同 */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />

      {/* 面板 — 位置、尺寸、圆角、玻璃效果完全一致 */}
      <div className="fixed inset-x-0 top-16 bottom-0 z-50 mx-auto max-w-5xl flex flex-col overflow-hidden">
        <div className="relative flex flex-col overflow-hidden rounded-t-3xl border border-white/20 bg-white/90 backdrop-blur-2xl shadow-[0_-8px_48px_rgba(0,0,0,0.12)] h-full">
          {/* 轮播区暗背景 — 与真实 3D Viewer 区完全一致 */}
          <div className="relative shrink-0 bg-[#0a0a0f]">
            <div className="aspect-[16/9] w-full flex items-center justify-center">
              {/* 与 SplatViewer 加载动效风格一致 */}
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
                <span className="text-sm text-white/40">加载中...</span>
              </div>
            </div>
          </div>
          {/* 信息区 — 白色底和真实面板一致 */}
          <div className="flex-1 bg-white px-5 py-5 space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full skeleton" />
              <div className="h-6 w-12 rounded-full skeleton" />
            </div>
            <div className="h-7 w-2/3 rounded-lg skeleton" />
            <div className="h-4 w-full rounded skeleton" />
            <div className="h-4 w-5/6 rounded skeleton" />
            <div className="flex gap-4 mt-3">
              <div className="h-3 w-14 rounded skeleton" />
              <div className="h-3 w-20 rounded skeleton" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
