# CLAUDE.md — Claude 工作指引

## 项目概述

**新视界** — 以3D高斯泼溅（Gaussian Splatting）为核心技术的空间浏览与分享平台。用户可浏览酒店、民宿、商铺、展览等3D空间，支持用户注册登录、上传作品。

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **后端**: Supabase (Auth + PostgreSQL + Storage + RLS)
- **3D渲染**: superspl.at 云端嵌入（iframe embed）
- **部署**: Vercel + Supabase Cloud

## 项目文档清单

| 文档 | 路径 | 内容 |
|------|------|------|
| 需求规格 | `docs/01-需求规格.md` | 功能需求、用户故事、页面清单 |
| 技术方案 | `docs/02-技术方案.md` | 架构决策、目录结构、3D方案 |
| 设计规范 | `docs/03-设计规范.md` | Vision Pro主题、颜色、字体、动效、间距 |
| 数据库设计 | `docs/04-数据库设计.md` | 表结构DDL、RLS策略、Storage配置 |
| 开发步骤 | `docs/05-开发步骤.md` | 分阶段执行计划（每阶段含验证标准）|
| API设计 | `docs/06-API设计.md` | API路由、请求/响应格式 |
| 部署指南 | `docs/07-部署指南.md` | Vercel + Supabase部署流程 |

## 开发规范

- 严格 TypeScript，所有参数和返回值标注类型
- 组件 PascalCase，页面路由 kebab-case
- Client Component 标记 `'use client'`
- 遵循 `docs/03-设计规范.md` 的设计 Token
- 每阶段完成后 Git commit

## 项目文件结构

```
d:\260614web\
├── CLAUDE.md
├── tailwind.config.ts
├── middleware.ts
├── vercel.json
├── docs/                         # 项目文档（7份）
├── devlog/                       # 开发日志
├── supabase/                     # 数据库迁移 SQL
│
├── app/                          # Next.js App Router
│   ├── globals.css               # 全局样式 + 设计 Token
│   ├── layout.tsx                # 根布局 (ThemeProvider + Navbar + Footer)
│   ├── page.tsx                  # 首页 SSR 数据获取
│   ├── loading.tsx               # 首页加载骨架
│   │
│   ├── explore/
│   │   ├── page.tsx              # 发现/浏览页
│   │   └── loading.tsx           # 发现页加载骨架
│   ├── tutorial/
│   │   └── page.tsx              # 教程占位页（敬请期待）
│   ├── auth/
│   │   ├── login/page.tsx        # 登录
│   │   ├── register/page.tsx     # 注册
│   │   └── callback/route.ts     # 邮箱确认回调
│   ├── upload/
│   │   ├── page.tsx              # 上传页（需登录）
│   │   └── loading.tsx           # 上传页加载骨架
│   ├── work/
│   │   └── [id]/
│   │       ├── page.tsx          # 作品详情页
│   │       └── loading.tsx       # 详情页加载骨架
│   ├── profile/
│   │   └── [username]/
│   │       ├── page.tsx          # 个人主页
│   │       └── loading.tsx       # 个人主页加载骨架
│   └── api/
│       ├── works/route.ts        # 作品 CRUD (GET+POST+DELETE)
│       ├── works/[id]/route.ts   # 单作品详情
│       ├── search/route.ts       # 搜索
│       ├── favorites/route.ts    # 收藏 CRUD
│       └── seed/route.ts         # 种子数据
│
├── components/
│   ├── theme-provider.tsx        # 主题 Provider
│   ├── auth/
│   │   └── AuthProvider.tsx      # Auth 状态初始化
│   ├── layout/
│   │   ├── Navbar.tsx            # 导航栏（毛玻璃 + 移动端汉堡）
│   │   ├── Footer.tsx            # 页脚
│   │   └── CategoryNav.tsx       # 分类导航（精选/民宿/展览/商业）
│   ├── home/
│   │   ├── HeroBanner.tsx        # Hero 轮播（淡入淡出 + 指示点）
│   │   ├── HomeClient.tsx        # 首页客户端交互
│   │   ├── WorkCard.tsx          # 作品卡片（3D 徽标 + 三点菜单）
│   │   ├── AnimatedWorkCard.tsx  # 卡片入场动画
│   │   └── ExploreClient.tsx     # 发现页客户端交互
│   ├── work/
│   │   └── WorkDetailClient.tsx  # 作品详情面板
│   ├── upload/
│   │   └── UploadForm.tsx        # 上传表单（多图 + supersplat 链接识别）
│   ├── viewer/
│   │   └── SplatViewer.tsx       # 3D Viewer（superspl.at iframe）
│   └── profile/
│       └── ProfileClient.tsx     # 个人主页
│
├── lib/
│   ├── types.ts                  # TypeScript 类型
│   ├── utils.ts                  # 工具函数（cn, timeAgo, formatViews, categoryLabels）
│   ├── auth-store.ts             # Zustand Auth Store
│   └── supabase/
│       ├── client.ts             # 浏览器端客户端
│       ├── server.ts             # 服务端客户端
│       └── admin.ts              # Admin 客户端（service_role）
│
└── public/
    ├── images/                    # 作品照片
    └── splats/                    # 3D 文件（已清空）
```

## 关键命令

```bash
npm run dev          # 启动开发服务器 (localhost:3000)
npm run build        # 生产构建
npm run lint         # ESLint 检查
```

## 当前状态

- **阶段 0-6**: ✅ 全部完成
- **阶段 7**: 部署（Git + Vercel）待做
- **3D Viewer**: superspl.at 云端嵌入，链接输入框自动识别 iframe 代码
- **测试账号**: demo@3dspace.dev / demo123456
