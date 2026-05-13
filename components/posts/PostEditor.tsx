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
  const [isPinned, setIsPinned] = useState(post?.is_pinned ?? false)
  const [tags, setTags] = useState<string[]>(post?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
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
      const body = JSON.stringify({ title, content, status, is_public: isPublic, is_pinned: isPinned, tags })
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

  function addTag() {
    const tag = tagInput.trim().toLowerCase()
    if (!tag || tags.includes(tag)) return
    setTags([...tags, tag])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
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
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-gray-300"
            />
            Public
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded border-gray-300"
            />
            Pin to top
          </label>
        </div>

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

      {/* Tags */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            className="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-gray-900 w-40"
          />
          <button
            type="button"
            onClick={addTag}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Add tag
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-400 hover:text-gray-700 leading-none"
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
