'use client'

import { useState } from 'react'
import type { Post } from '@/lib/types'
import PostCard from '@/components/posts/PostCard'

interface PostFilterProps {
  posts: Post[]
}

export default function PostFilter({ posts }: PostFilterProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags))
  ).sort()

  const filtered = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : posts

  return (
    <div>
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedTag(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedTag === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-400">No posts with this tag.</p>
      ) : (
        filtered.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
