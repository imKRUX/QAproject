import Image from 'next/image'
import type { Workshop } from '@/lib/types'
import { getMembers } from '@/lib/db'
import { BookButton } from './BookButton'

const categoryColors: Record<string, string> = {
  dishes: '#ea580c',
  crafts: '#b45309',
  drawing: '#7c3aed',
  music: '#1d4ed8',
  gardening: '#15803d',
  other: '#6b7280',
}

export function WorkshopCard({
  workshop,
  userEmail,
  isBooked = false,
}: {
  workshop: Workshop
  userEmail?: string
  isBooked?: boolean
}) {
  const members = getMembers()
  const host = members.find(m => m.id === workshop.hostId)
  const spotsLeft = workshop.seats - workshop.bookedSeats
  const isFull = spotsLeft === 0
  const isOwn = !!userEmail && workshop.hostEmail === userEmail

  return (
    <div
      data-cy="workshop-card"
      className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div
        className="h-44 flex items-center justify-center relative overflow-hidden"
        style={{ background: workshop.cardBg }}
      >
        {workshop.imageUrl ? (
          <Image
            src={workshop.imageUrl}
            alt={workshop.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <span className="text-6xl select-none">{workshop.emoji}</span>
        )}
        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold text-white px-2 py-1 rounded-sm bg-black/60 uppercase tracking-wider">
            {workshop.level}
          </span>
        </div>

        {isOwn && (
          <div className="absolute top-3 right-3">
            <span
              className="text-[10px] font-bold text-white px-2 py-1 rounded-sm uppercase tracking-wider"
              style={{ backgroundColor: '#ea580c' }}
            >
              Hosting
            </span>
          </div>
        )}
        {isBooked && !isOwn && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold text-white px-2 py-1 rounded-sm bg-black/70 uppercase tracking-wider">
              ✓ Booked
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: categoryColors[workshop.category] || '#6b7280' }}
          >
            {workshop.category}
          </span>
          <span className="text-xs text-stone-400">{workshop.duration} hrs</span>
        </div>

        <h3 className="font-bold text-stone-900 text-[15px] leading-snug mb-1.5">
          {workshop.title}
        </h3>
        <p className="text-xs text-stone-500 leading-relaxed mb-3 line-clamp-2">
          {workshop.description}
        </p>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-stone-100">
          <div className="text-stone-400">
            {host ? (
              <span>by <span className="text-stone-600 font-medium">{host.name}</span></span>
            ) : (
              <span className="text-stone-600 font-medium">{workshop.hostId}</span>
            )}
          </div>
          {userEmail ? (
            <BookButton
              workshopId={workshop.id}
              isFull={isFull}
              isBooked={isBooked}
              isOwn={isOwn}
            />
          ) : (
            <div className={isFull ? 'text-red-500 font-semibold' : 'text-stone-400'}>
              {isFull ? 'Full' : `${spotsLeft} spots left`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
