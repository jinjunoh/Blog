'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Post, PostStatus } from '@/lib/types'

// Must be dynamically imported — @uiw/react-md-editor uses window
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface PostEditorProps {
  post?: Post
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [isPublic, setIsPublic] = useState(post?.is_public ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save(status: PostStatus) {
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setError('')
    setSaving(true)

    try {
      const body = JSON.stringify({ title, content, status, is_public: isPublic })
      const res = post
        ? await fetch(`/api/posts/${post.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body })
        : await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Save failed')
        return
      }

      // Redirect to edit page after first create
      if (!post) {
        router.push(`/admin/posts/${data.id}/edit`)
      } else {
        router.refresh()
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!post) return
    if (!confirm('Delete this post? This cannot be undone.')) return

    const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-bold border-0 border-b border-gray-200 pb-2 focus:outline-none focus:border-gray-900 bg-transparent placeholder:text-gray-300"
      />

      {/* Editor */}
      <div data-color-mode="light">
        <MDEditor
          value={content}
          onChange={(val) => setContent(val ?? '')}
          height={500}
          preview="live"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-gray-300"
          />
          Public (visible to everyone)
        </label>

        <div className="flex items-center gap-2">
          {post && (
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 rounded-md"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => save('draft')}
            disabled={saving}
            className="px-4 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button
            onClick={() => save('published')}
            disabled={saving}
            className="px-4 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
