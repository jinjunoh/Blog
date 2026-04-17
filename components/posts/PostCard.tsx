import Link from 'next/link'
import type { Post } from '@/lib/types'
import { formatDate } from '@/lib/utils/date'

interface PostCardProps {
  post: Post
  admin?: boolean
}

export default function PostCard({ post, admin = false }: PostCardProps) {
  const date = post.published_at ?? post.updated_at

  return (
    <article className="group border-b border-gray-100 py-5 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link
            href={admin ? `/admin/posts/${post.id}/edit` : `/posts/${post.slug}`}
            className="block"
          >
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors truncate">
              {post.title}
            </h2>
          </Link>
          {post.excerpt && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
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
