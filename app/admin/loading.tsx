export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4 py-4">
      <div className="h-8 w-32 bg-gray-100 rounded" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-50 rounded" />
        ))}
      </div>
    </div>
  )
}
