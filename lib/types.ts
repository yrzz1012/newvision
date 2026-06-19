// ===== 数据库类型 =====

export type WorkCategory = 'homestay' | 'exhibition' | 'commercial' | 'other';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string;
  created_at: string;
}

export interface Work {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: WorkCategory;
  cover_url: string | null;
  splat_file_url: string | null;
  splat_original_url: string | null;
  thumbnail_url: string | null;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  photos?: string[];
  created_at: string;
  updated_at: string;
  // join
  profiles?: Profile;
}

export interface Favorite {
  id: string;
  user_id: string;
  work_id: string;
  created_at: string;
}

// ===== API 响应类型 =====

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  error: string;
  code: string;
}

// ===== 上传表单 =====

export interface UploadFormData {
  title: string;
  description: string;
  category: WorkCategory;
  tags: string[];
}
