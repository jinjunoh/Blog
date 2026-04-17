import { createClient } from '@/lib/supabase/server'
import { searchPosts } from '@/lib/db/posts'
import Header from '@/components/layout/Header'
import PostCard from '@/components/posts/PostCard'

interface Props {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() ?? ''
  const supabase = createClient()

  const posts = query ? await searchPosts(supabase, query) : []

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        {query ? (
          <>
            <h1 className="text-xl font-semibold text-gray-900 mb-6">
              {posts.length > 0
                ? `${posts.length} result${posts.length === 1 ? '' : 's'} for "${query}"`
                : `No results for "${query}"`}
            </h1>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        ) : (
          <p className="text-gray-400">Enter a search term above.</p>
        )}
      </main>
    </>
  )
}
