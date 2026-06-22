'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ViewerContent() {
  const params = useSearchParams();
  const id = params.get('splatId') || '';
  const src = id ? `https://superspl.at/s?id=${id}` : 'about:blank';

  return (
    <iframe
      src={src}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 'none' }}
      allow="fullscreen; xr-spatial-tracking"
      title="3D 空间漫游"
    />
  );
}

export default function ViewerProxyPage() {
  return (
    <Suspense fallback={<div style={{ background:'#0a0a0f', height:'100vh' }} />}>
      <ViewerContent />
    </Suspense>
  );
}
