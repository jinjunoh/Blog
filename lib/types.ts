export type PostStatus = 'draft' | 'published'

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  status: PostStatus
  is_public: boolean
  is_pinned: boolean
  tags: string[]
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface CreatePostInput {
  title: string
  content: string
  excerpt?: string
  status: PostStatus
  is_public: boolean
  is_pinned?: boolean
  tags?: string[]
}

export interface UpdatePostInput {
  title?: string
  content?: string
  excerpt?: string
  status?: PostStatus
  is_public?: boolean
  is_pinned?: boolean
  tags?: string[]
}
