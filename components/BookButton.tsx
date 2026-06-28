'use client'
import { useState } from 'react'

export function BookButton({
  workshopId,
  isFull,
  isBooked,
  isOwn,
}: {
  workshopId: string
  isFull: boolean
  isBooked: boolean
  isOwn: boolean
}) {
  const [booked, setBooked] = useState(isBooked)
  const [loading, setLoading] = useState(false)

  if (isOwn) return null

  const handleBook = async () => {
    if (booked || isFull) return
    setLoading(true)
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workshopId }),
    })
    setBooked(true)
    setLoading(false)
  }

  if (booked) {
    return (
      <span className="text-xs font-semibold text-orange-600">✓ Booked</span>
    )
  }

  return (
    <button
      onClick={handleBook}
      disabled={isFull || loading}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 shadow-sm"
      style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
    >
      {loading ? '...' : isFull ? 'Full' : 'Book'}
    </button>
  )
}
