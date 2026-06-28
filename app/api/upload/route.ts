import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { auth } from '@/auth'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

  await writeFile(filepath, buffer)

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 })
}
