'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Workshops' },
  { href: '/workspace', label: 'My Workspace' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1 flex-1">
      {links.map(link => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'text-white shadow-sm'
                : 'text-stone-600 hover:text-orange-700 hover:bg-orange-50'
            }`}
            style={isActive ? { background: 'linear-gradient(135deg, #f97316, #ea580c)' } : undefined}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
