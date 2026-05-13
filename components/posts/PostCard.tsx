import Link from 'next/link'
import type { Post } from '@/lib/types'
import { formatDate } from '@/lib/utils/date'

interface PostCardProps {
  post: Post
  admin?: boolean
}

export default function PostCard({ post, admin = false }: PostCardProps) {
  const date = post.published_at ?? post.updated_at
  const href = admin ? `/admin/posts/${post.id}/edit` : `/posts/${post.slug}`

  return (
    // relative + group so the overlay link and hover styles work together
    <article className="relative group border-b border-gray-100 py-5 last:border-0">
      {/* Full-block clickable overlay */}
      <Link href={href} className="absolute inset-0 z-0" aria-label={post.title} />

      <div className="relative z-10 flex items-start justify-between gap-4 pointer-events-none">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {post.is_pinned && (
              <span className="text-gray-400 text-xs" title="Pinned">📌</span>
            )}
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-500 transition-colors truncate">
              {post.title}
            </h2>
          </div>
          {post.excerpt && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-400">{formatDate(date)}</p>
        </div>

        {admin && (
          <div className="flex items-center gap-1.5 shrink-0">
            <StatusBadge status={post.status} />
            {post.status === 'published' && (
              <VisibilityBadge isPublic={post.is_public} />
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function StatusBadge({ status }: { status: Post['status'] }) {
  return status === 'published' ? (
    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
      Published
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
      Draft
    </span>
  )
}

function VisibilityBadge({ isPublic }: { isPublic: boolean }) {
  return isPublic ? (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
      Public
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
      Private
    </span>
  )
}
