export default function ViewerProxyLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, background: '#0a0a0f' }}>{children}</body>
    </html>
  );
}
