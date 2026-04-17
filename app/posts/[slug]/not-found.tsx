import Link from 'next/link'
import Header from '@/components/layout/Header'

export default function PostNotFound() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post not found</h1>
        <p className="text-gray-500 mb-6">This post doesn&apos;t exist or isn&apos;t public.</p>
        <Link href="/" className="text-sm underline text-gray-700 hover:text-gray-900">
          Go home
        </Link>
      </main>
    </>
  )
}
