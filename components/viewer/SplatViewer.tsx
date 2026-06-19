'use client';

interface SplatViewerProps {
  sceneUrl: string;
  className?: string;
}

export default function SplatViewer({ sceneUrl, className = '' }: SplatViewerProps) {
  const embedUrl = sceneUrl.includes('?') ? sceneUrl : `${sceneUrl}?embed`;

  return (
    <div className={`overflow-hidden rounded-2xl bg-[#0a0a0f] ${className}`}>
      <iframe
        id="splat-iframe"
        src={embedUrl}
        className="h-full w-full border-0"
        allow="fullscreen; xr-spatial-tracking"
        title="3D 空间漫游"
      />
    </div>
  );
}
