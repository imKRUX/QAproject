import { Suspense } from 'react'
import { getWorkshops, getBookingsByEmail } from '@/lib/db'
import { auth } from '@/auth'
import { WorkshopCard } from '@/components/WorkshopCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { HotAndNew } from '@/components/HotAndNew'
import type { Category } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function WorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const session = await auth()
  const userEmail = session?.user?.email ?? undefined
  const workshops = getWorkshops()
  const bookedIds = userEmail
    ? new Set(getBookingsByEmail(userEmail).map(b => b.workshopId))
    : new Set<string>()

  const filtered =
    category && category !== 'all'
      ? workshops.filter(w => w.category === (category as Category))
      : workshops

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: '#ea580c' }}
            >
              Learn, Teach &amp; Grow Together
            </p>
            <h1 className="text-2xl sm:text-4xl font-bold text-stone-900">
              Learn something new today...
            </h1>
          </div>
          <Suspense fallback={<div className="h-9" />}>
            <CategoryFilter activeCategory={category || 'all'} />
          </Suspense>
        </div>

        <hr className="border-stone-200 my-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <input
                type="text"
                readOnly
                placeholder="Search ramen broth, terracotta planters, watercolor, guitar..."
                className="w-full border border-stone-200 rounded-xl px-5 py-3.5 text-sm bg-white placeholder-stone-400 cursor-default focus:outline-none"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <div className="text-5xl mb-3">🔍</div>
                <p className="font-medium">No workshops in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(workshop => (
                  <WorkshopCard
                    key={workshop.id}
                    workshop={workshop}
                    userEmail={userEmail}
                    isBooked={bookedIds.has(workshop.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <HotAndNew workshops={workshops} userEmail={userEmail} />
        </div>
      </div>
    </main>
  )
}
