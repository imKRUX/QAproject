import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { addBooking, removeBooking } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { workshopId } = await req.json()
  if (!workshopId) {
    return NextResponse.json({ error: 'workshopId required' }, { status: 400 })
  }

  const booking = addBooking(workshopId, session.user.email)
  revalidatePath('/workspace')
  return NextResponse.json(booking, { status: 201 })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { workshopId } = await req.json()
  if (!workshopId) {
    return NextResponse.json({ error: 'workshopId required' }, { status: 400 })
  }

  const ok = removeBooking(workshopId, session.user.email)
  if (!ok) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  revalidatePath('/')
  revalidatePath('/workspace')
  return NextResponse.json({ success: true })
}
