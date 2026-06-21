/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // EdgeOne 环境变量注入到客户端 bundle
    NEXT_PUBLIC_SUPABASE_URL: 'https://bmnzhxverilnbbasafeg.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbnpoeHZlcmlsbmJiYXNhZmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDE2NzAsImV4cCI6MjA5NzAxNzY3MH0.bcJ595LBXq7Yw8ZIuC-NQHvNo-9PqfkBvLHhigsrDvU',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};

export default nextConfig;
