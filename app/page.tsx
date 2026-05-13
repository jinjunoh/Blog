import { createClient } from '@/lib/supabase/server'
import { getPublishedPosts } from '@/lib/db/posts'
import Header from '@/components/layout/Header'
import PostFilter from '@/components/posts/PostFilter'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()
  const posts = await getPublishedPosts(supabase)

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        {posts.length === 0 ? (
          <p className="text-gray-400">Nothing published yet.</p>
        ) : (
          <PostFilter posts={posts} />
        )}
      </main>
    </>
  )
}
