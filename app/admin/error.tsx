'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="py-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-500 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
      >
        Try again
      </button>
    </div>
  )
}
