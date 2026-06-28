import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center px-6 py-20" data-cy="not-found">
        <div
          className="text-7xl font-black mb-3"
          style={{ color: '#ea580c' }}
        >
          404
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-stone-500 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-block text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          Back to Workshops
        </Link>
      </div>
    </main>
  )
}
