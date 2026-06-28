import fs from 'fs'
import path from 'path'
import type { Workshop, Member } from './types'

const DB_PATH = path.join(process.cwd(), 'lib', 'db.json')

interface Booking {
  id: string
  workshopId: string
  userEmail: string
}

interface DB {
  workshops: Workshop[]
  members: Member[]
  bookings: Booking[]
}

function readDB(): DB {
  const raw = fs.readFileSync(DB_PATH, 'utf-8')
  const data = JSON.parse(raw)
  if (!data.bookings) data.bookings = []
  return data
}

function writeDB(data: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

export function getWorkshops(): Workshop[] {
  return readDB().workshops
}

export function getMembers(): Member[] {
  return readDB().members
}

export function addWorkshop(workshop: Workshop): Workshop {
  const db = readDB()
  db.workshops.push(workshop)
  writeDB(db)
  return workshop
}

export function updateWorkshop(
  id: string,
  hostEmail: string,
  patch: Partial<Workshop>
): Workshop | null {
  const db = readDB()
  const ws = db.workshops.find(w => w.id === id)
  if (!ws || ws.hostEmail !== hostEmail) return null

  const editable: (keyof Workshop)[] = [
    'title', 'description', 'category', 'level', 'date', 'time', 'seats',
  ]
  for (const key of editable) {
    if (patch[key] !== undefined) {
      // @ts-expect-error narrow assignment across union
      ws[key] = patch[key]
    }
  }
  if (ws.bookedSeats > ws.seats) ws.bookedSeats = ws.seats
  writeDB(db)
  return ws
}

export function deleteWorkshop(id: string, hostEmail: string): boolean {
  const db = readDB()
  const ws = db.workshops.find(w => w.id === id)
  if (!ws || ws.hostEmail !== hostEmail) return false
  db.workshops = db.workshops.filter(w => w.id !== id)
  db.bookings = db.bookings.filter(b => b.workshopId !== id)
  writeDB(db)
  return true
}

export function getBookingsByEmail(email: string): Booking[] {
  return readDB().bookings.filter(b => b.userEmail === email)
}

export function removeBooking(workshopId: string, userEmail: string): boolean {
  const db = readDB()
  const before = db.bookings.length
  db.bookings = db.bookings.filter(
    b => !(b.workshopId === workshopId && b.userEmail === userEmail)
  )
  if (db.bookings.length === before) return false // nothing removed
  const ws = db.workshops.find(w => w.id === workshopId)
  if (ws) ws.bookedSeats = Math.max(ws.bookedSeats - 1, 0)
  writeDB(db)
  return true
}

export function getBookingsByWorkshopId(workshopId: string): Booking[] {
  return readDB().bookings.filter(b => b.workshopId === workshopId)
}

export function addBooking(workshopId: string, userEmail: string): Booking {
  const db = readDB()
  const existing = db.bookings.find(b => b.workshopId === workshopId && b.userEmail === userEmail)
  if (existing) return existing
  const booking: Booking = { id: `b-${Date.now()}`, workshopId, userEmail }
  db.bookings.push(booking)
  const ws = db.workshops.find(w => w.id === workshopId)
  if (ws) ws.bookedSeats = Math.min(ws.bookedSeats + 1, ws.seats)
  writeDB(db)
  return booking
}

export type { Booking }
