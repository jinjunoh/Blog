import Link from 'next/link'
import { Suspense } from 'react'
import SearchBox from '@/components/search/SearchBox'

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          JJ&apos;s Blog
        </Link>
        <Suspense>
          <SearchBox />
        </Suspense>
      </div>
    </header>
  )
}
