'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Workshop } from '@/lib/types'

export function HotAndNew({
  workshops,
  userEmail,
}: {
  workshops: Workshop[]
  userEmail?: string
}) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set())
  const [booking, setBooking] = useState(false)

  const sorted = [...workshops].sort((a, b) => (a.seats - a.bookedSeats) - (b.seats - b.bookedSeats))

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setCurrent(c => (c + 1) % sorted.length), 2000)
    return () => clearInterval(t)
  }, [paused, sorted.length])

  const ws = sorted[current]
  if (!ws) return null

  const spotsLeft = ws.seats - ws.bookedSeats
  const isFull = spotsLeft === 0
  const isBooked = bookedIds.has(ws.id)
  const isOwn = !!userEmail && ws.hostEmail === userEmail

  const handleBook = async () => {
    if (!userEmail || isFull || isBooked || isOwn || booking) return
    setBooking(true)
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workshopId: ws.id }),
    })
    setBookedIds(prev => new Set([...prev, ws.id]))
    setBooking(false)
  }

  const categoryColors: Record<string, string> = {
    dishes: '#ea580c', crafts: '#b45309', drawing: '#7c3aed',
    music: '#1d4ed8', gardening: '#15803d', other: '#6b7280',
  }
  const catColor = categoryColors[ws.category] || '#ea580c'

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div
        className="lg:sticky lg:top-24 rounded-2xl border border-stone-200 overflow-hidden bg-white"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Header bar */}
        <div
          className="flex items-center px-4 py-3"
          style={{ background: 'linear-gradient(135deg, #fb923c, #f97316)' }}
        >
          <span className="text-[10px] font-bold tracking-widest text-white uppercase">Hot &amp; New</span>
        </div>

        {/* Cover image — bento top tile */}
        <div
          className="relative h-40 w-full cursor-pointer"
          style={{ background: ws.cardBg }}
          onClick={handleBook}
        >
          {ws.imageUrl ? (
            <Image
              src={ws.imageUrl}
              alt={ws.title}
              fill
              className="object-cover"
              sizes="288px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl select-none">
              {ws.emoji}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: catColor }}
            >
              {ws.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
              {ws.level}
            </span>
          </div>

          {/* Bottom overlay info */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
            <div className="text-[10px] text-white/70 uppercase tracking-widest font-semibold mb-0.5">
              {ws.duration}h session
            </div>
            <h3 data-cy="hot-title" className="text-[15px] font-bold text-white leading-snug line-clamp-2">
              {ws.title}
            </h3>
          </div>
        </div>

        {/* Bento grid — info tiles */}
        <div className="grid grid-cols-3 gap-px bg-stone-100">
          {/* Date tile */}
          <div className="bg-white px-3 py-2.5">
            <div className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold mb-0.5">Date</div>
            <div className="text-xs font-semibold" style={{ color: '#ea580c' }}>{ws.date}</div>
          </div>
          {/* Time tile */}
          <div className="bg-white px-3 py-2.5">
            <div className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold mb-0.5">Time</div>
            <div className="text-xs font-semibold" style={{ color: '#ea580c' }}>{ws.time}</div>
          </div>
          {/* Spots tile */}
          <div className="bg-white px-3 py-2.5">
            <div className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold mb-0.5">Spots</div>
            <div
              className="text-xs font-bold"
              style={{ color: isFull ? '#dc2626' : '#ea580c' }}
            >
              {isFull ? 'Full' : `${spotsLeft} left`}
            </div>
          </div>
        </div>

        {/* Book button */}
        <div className="px-4 py-3 bg-white border-t border-stone-100">
          {!userEmail ? (
            <div className="text-center text-xs text-stone-400 py-1">Sign in to book</div>
          ) : isOwn ? (
            <div
              className="w-full text-center text-xs font-bold uppercase tracking-widest py-2.5 rounded-xl"
              style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}
            >
              ✓ Your Workshop
            </div>
          ) : isBooked ? (
            <div
              className="w-full text-center text-xs font-bold uppercase tracking-widest py-2.5 rounded-xl"
              style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}
            >
              ✓ Booked
            </div>
          ) : (
            <button
              onClick={handleBook}
              disabled={isFull || booking}
              className="w-full text-xs font-bold uppercase tracking-widest py-2.5 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              {booking ? 'Booking...' : isFull ? 'Fully Booked' : 'Book This Class →'}
            </button>
          )}
        </div>

        {/* Dot progress */}
        <div className="flex items-center justify-center gap-1.5 py-3 border-t border-stone-100 bg-stone-50">
          {sorted.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '18px' : '5px',
                height: '5px',
                backgroundColor: i === current ? '#f97316' : '#d6d3d1',
              }}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
