'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Workshop } from '@/lib/types'

export function MyBookings({ workshops }: { workshops: Workshop[] }) {
  const router = useRouter()
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  const cancel = async (workshopId: string, title: string) => {
    if (!confirm(`Cancel your booking for "${title}"?`)) return
    setCancelingId(workshopId)
    await fetch('/api/bookings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workshopId }),
    })
    setCancelingId(null)
    router.refresh()
  }

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="lg:sticky lg:top-24 rounded-2xl border border-stone-200 overflow-hidden bg-white">
        {/* Header bar */}
        <div
          className="flex items-center px-4 py-3"
          style={{ background: 'linear-gradient(135deg, #fb923c, #f97316)' }}
        >
          <span className="text-[10px] font-bold tracking-widest text-white uppercase">
            My Bookings
          </span>
        </div>

        {workshops.length === 0 ? (
          <div className="text-center px-4 py-8" data-cy="no-bookings">
            <p className="text-sm font-medium text-stone-500 mb-1">
              No bookings yet.
            </p>
            <p className="text-xs text-stone-400 mb-5">
              Reserve your first class from the community board.
            </p>
            <Link
              href="/"
              className="inline-block text-xs font-bold uppercase tracking-widest text-white px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              Explore Workshops
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100" data-cy="bookings-list">
            {workshops.map(ws => (
              <div key={ws.id} data-cy="booking-item" className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-semibold text-sm text-stone-900 leading-snug">
                    {ws.title}
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white shrink-0"
                    style={{ backgroundColor: '#ea580c' }}
                  >
                    Booked
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-px bg-stone-100 rounded-lg overflow-hidden mb-3">
                  <div className="bg-white px-2.5 py-2">
                    <div className="text-[9px] text-stone-400 uppercase tracking-widest font-semibold mb-0.5">Date</div>
                    <div className="text-xs font-semibold" style={{ color: '#ea580c' }}>{ws.date}</div>
                  </div>
                  <div className="bg-white px-2.5 py-2">
                    <div className="text-[9px] text-stone-400 uppercase tracking-widest font-semibold mb-0.5">Time</div>
                    <div className="text-xs font-semibold" style={{ color: '#ea580c' }}>{ws.time}</div>
                  </div>
                  <div className="bg-white px-2.5 py-2">
                    <div className="text-[9px] text-stone-400 uppercase tracking-widest font-semibold mb-0.5">Duration</div>
                    <div className="text-xs font-semibold text-stone-800">{ws.duration} hrs</div>
                  </div>
                  <div className="bg-white px-2.5 py-2">
                    <div className="text-[9px] text-stone-400 uppercase tracking-widest font-semibold mb-0.5">Level</div>
                    <div className="text-xs font-semibold text-stone-800">{ws.level}</div>
                  </div>
                </div>

                <button
                  onClick={() => cancel(ws.id, ws.title)}
                  disabled={cancelingId === ws.id}
                  className="w-full text-xs font-semibold text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-50 transition-colors uppercase tracking-wide disabled:opacity-50"
                >
                  {cancelingId === ws.id ? 'Canceling...' : 'Cancel Booking'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
