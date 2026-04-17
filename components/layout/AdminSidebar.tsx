'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { label: 'All posts', href: '/admin' },
  { label: 'New post', href: '/admin/posts/new' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-gray-200 min-h-screen py-6 px-4">
      <Link href="/" className="text-lg font-bold text-gray-900 mb-8 block">
        brain
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              pathname === item.href
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 text-left"
      >
        Sign out
      </button>
    </aside>
  )
}
