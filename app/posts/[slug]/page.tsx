import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { getPostBySlug, getPublishedPosts } from '@/lib/db/posts'
import Header from '@/components/layout/Header'
import MarkdownRenderer from '@/components/posts/MarkdownRenderer'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils/date'
import Link from 'next/link'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  // Must use cookie-free client — cookies() is unavailable at build time.
  // Falls back to empty array so the build succeeds without live credentials;
  // pages are then generated on first request via ISR (revalidate = 60).
  try {
    const supabase = createStaticClient()
    const posts = await getPublishedPosts(supabase)
    return posts.map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props) {
  const supabase = createClient()
  const post = await getPostBySlug(supabase, params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function PostPage({ params }: Props) {
  const supabase = createClient()
  const post = await getPostBySlug(supabase, params.slug)

  // notFound() if the post doesn't exist or isn't publicly visible
  if (!post || post.status !== 'published' || !post.is_public) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 mb-6 block">
          ← Back
        </Link>
        <article>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {post.published_at && (
              <p className="text-sm text-gray-400">{formatDate(post.published_at)}</p>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <MarkdownRenderer content={post.content} />
        </article>
      </main>
    </>
  )
}
