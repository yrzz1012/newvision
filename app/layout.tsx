import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import AuthProvider from '@/components/auth/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const runtime = 'nodejs';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: '新视界 — 沉浸式 3D 空间浏览平台',
    template: '%s | 新视界',
  },
  description: '探索酒店、民宿、展览、商业空间的全景 3D 漫游体验。上传你的 3D 高斯泼溅作品，与全球创作者分享。',
  keywords: ['3D空间', '全景漫游', '民宿', '展览', '商业空间', '高斯泼溅', '新视界'],
  openGraph: {
    type: 'website',
    siteName: '新视界',
    title: '新视界 — 沉浸式 3D 空间浏览平台',
    description: '探索酒店、民宿、展览、商业空间的全景 3D 漫游体验',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen text-text-primary antialiased">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
