# 06 — API 设计

## 通用约定

- **Base URL**: `/api`
- **认证**: 通过 Supabase Cookie 自动识别（服务端 `createClient`）
- **响应格式**: JSON
- **错误格式**: `{ error: string, code: string }`

---

## API 路由清单

### 作品相关 `/api/works`

#### GET — 获取作品列表

```
GET /api/works?category=homestay&featured=true&page=1&limit=12&search=关键词
```

**Query参数**：`category`, `featured`, `page`, `limit`, `search`
**响应**：
```json
{
  "works": [
    {
      "id": "uuid",
      "title": "山间小屋",
      "description": "...",
      "category": "homestay",
      "cover_url": "https://...",
      "splat_file_url": "https://...",
      "thumbnail_url": "https://...",
      "tags": ["山景", "木屋"],
      "is_featured": true,
      "view_count": 156,
      "created_at": "2026-06-14T...",
      "profiles": {
        "username": "alice",
        "display_name": "Alice",
        "avatar_url": "https://..."
      }
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 12
}
```

#### POST — 创建作品（需登录）

```
POST /api/works
Content-Type: application/json

{
  "title": "山间小屋",
  "description": "...",
  "category": "homestay",
  "cover_url": "https://...",
  "splat_file_url": "https://...",
  "tags": ["山景", "木屋"]
}
```

#### GET `/api/works/[id]` — 获取单个作品

```json
{
  "work": { /* 作品完整信息 + profiles + 是否已收藏 */ },
  "is_favorited": false
}
```

#### PUT `/api/works/[id]` — 更新作品（仅作者）

#### DELETE `/api/works/[id]` — 删除作品（仅作者）

---

### 上传相关 `/api/upload`

#### POST — 上传3D文件（需登录）

```
POST /api/upload
Content-Type: multipart/form-data

fields:
  - file: .ply 或 .splat 文件
  - title: string
  - description: string (optional)
  - category: "homestay" | "exhibition" | "commercial" | "other"
  - cover: 封面图片文件
  - tags: string (comma separated, optional)
```

**响应**：
```json
{
  "work_id": "uuid",
  "splat_file_url": "https://...",
  "message": "upload successful, processing..."
}
```

**处理流程**：
1. 接收文件 → 存入 `uploads` bucket
2. 后台触发 `splat-transform` 转换 `.ply` → `.sog`
3. 转换后的 `.sog` 文件存入 `splats` bucket
4. 创建 works 表记录 → 返回 work_id

---

### 搜索 `/api/search`

```
GET /api/search?q=山间&category=homestay
```

**响应**：同 GET `/api/works`，增加搜索相关性排序

---

### 收藏 `/api/favorites`

#### GET — 获取用户收藏列表（需登录）
```
GET /api/favorites
```

#### POST — 收藏作品（需登录）
```
POST /api/favorites
{ "work_id": "uuid" }
```

#### DELETE `/api/favorites/[work_id]` — 取消收藏（需登录）

---

### 用户 `/api/profile`

#### GET `/api/profile/[username]` — 获取用户信息
```json
{
  "profile": {
    "username": "alice",
    "display_name": "Alice",
    "avatar_url": "...",
    "bio": "...",
    "created_at": "..."
  },
  "works": [ /* 用户上传的作品列表 */ ],
  "works_count": 5
}
```

#### PUT `/api/profile` — 更新个人信息（需登录）
```json
{
  "display_name": "New Name",
  "bio": "...",
  "avatar_url": "..."
}
```
