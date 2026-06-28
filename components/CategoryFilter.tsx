'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const categories = [
  { value: 'all', label: 'All' },
  { value: 'dishes', label: 'Dishes' },
  { value: 'crafts', label: 'Crafts' },
  { value: 'drawing', label: 'Drawing' },
  { value: 'music', label: 'Music' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'other', label: 'Other' },
]

export function CategoryFilter({ activeCategory }: { activeCategory: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('category')
    } else {
      params.set('category', value)
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {categories.map(cat => {
        const isActive = activeCategory === cat.value || (cat.value === 'all' && activeCategory === 'all')
        return (
          <button
            key={cat.value}
            onClick={() => handleClick(cat.value)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border rounded transition-colors ${
              isActive
                ? 'text-white border-transparent'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500 hover:bg-stone-50'
            }`}
            style={isActive ? { backgroundColor: '#ea580c', borderColor: '#ea580c' } : undefined}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
