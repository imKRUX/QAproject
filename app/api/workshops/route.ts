import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getWorkshops, addWorkshop, updateWorkshop, deleteWorkshop } from '@/lib/db'
import { auth } from '@/auth'
import type { Workshop } from '@/lib/types'

export async function GET() {
  const workshops = getWorkshops()
  return NextResponse.json(workshops)
}

export async function POST(req: Request) {
  const body = await req.json()

  const workshop: Workshop = {
    id: `ws-${Date.now()}`,
    title: body.title,
    description: body.description,
    category: body.category,
    duration: Number(body.duration) || 1,
    level: body.level || 'all levels',
    hostId: body.hostEmail ?? 'unknown',
    hostEmail: body.hostEmail,
    date: body.date,
    time: body.time,
    seats: Number(body.seats),
    bookedSeats: 0,
    emoji: body.emoji || '🎓',
    cardBg: body.cardBg || 'linear-gradient(135deg, #ea580c, #c2410c)',
    imageUrl: body.imageUrl ?? undefined,
    isHostedByCurrentUser: true,
  }

  const saved = addWorkshop(workshop)
  revalidatePath('/')
  revalidatePath('/workspace')
  return NextResponse.json(saved, { status: 201 })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id, ...patch } = body
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }
  if (patch.seats !== undefined) patch.seats = Number(patch.seats)

  const updated = updateWorkshop(id, session.user.email, patch)
  if (!updated) {
    return NextResponse.json({ error: 'Not found or not owner' }, { status: 404 })
  }

  revalidatePath('/')
  revalidatePath('/workspace')
  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const ok = deleteWorkshop(id, session.user.email)
  if (!ok) {
    return NextResponse.json({ error: 'Not found or not owner' }, { status: 404 })
  }

  revalidatePath('/')
  revalidatePath('/workspace')
  return NextResponse.json({ success: true })
}
