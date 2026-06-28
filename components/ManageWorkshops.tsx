'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Workshop } from '@/lib/types'

const categories = ['dishes', 'crafts', 'drawing', 'music', 'gardening', 'other']
const levels = ['beginner', 'intermediate', 'all levels']

type Enrollee = { id: string; userEmail: string }

export function ManageWorkshops({
  workshops,
  enrolleesById,
}: {
  workshops: Workshop[]
  enrolleesById: Record<string, Enrollee[]>
}) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Workshop>>({})

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This removes the workshop and all its bookings. This cannot be undone.`)) return
    setDeletingId(id)
    await fetch('/api/workshops', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeletingId(null)
    router.refresh()
  }

  const startEdit = (ws: Workshop) => {
    setEditingId(ws.id)
    setForm({
      title: ws.title,
      description: ws.description,
      category: ws.category,
      level: ws.level,
      date: ws.date,
      time: ws.time,
      seats: ws.seats,
    })
  }

  const cancel = () => {
    setEditingId(null)
    setForm({})
  }

  const save = async (id: string) => {
    setSaving(true)
    await fetch('/api/workshops', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...form }),
    })
    setSaving(false)
    setEditingId(null)
    setForm({})
    router.refresh()
  }

  const inputClass =
    'w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent'
  const labelClass = 'text-[10px] font-semibold text-stone-400 uppercase tracking-widest block mb-1'

  if (workshops.length === 0) {
    return (
      <div className="text-center py-10 text-stone-400">
        <p className="text-sm font-medium text-stone-500">No workshops scheduled yet.</p>
        <p className="text-xs mt-1">Use the form above to schedule your first class.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {workshops.map(ws => {
        const enrollees = enrolleesById[ws.id] ?? []
        const isEditing = editingId === ws.id
        const spotsLeft = ws.seats - ws.bookedSeats

        return (
          <div key={ws.id} className="border border-stone-100 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center flex-wrap gap-3 p-4 bg-stone-50">
              <div className="flex-1 min-w-[60%]">
                <div className="font-semibold text-stone-900 truncate">{ws.title}</div>
                <div className="text-xs text-stone-400">
                  {ws.date} · {ws.time} · {spotsLeft} spots left
                </div>
              </div>
              <div
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: '#ea580c' }}
              >
                Enrolled {enrollees.length}
              </div>
              {!isEditing && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(ws)}
                    className="text-xs font-semibold text-stone-600 border border-stone-300 px-3 py-1.5 rounded-lg hover:bg-white transition-colors uppercase tracking-wide"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(ws.id, ws.title)}
                    disabled={deletingId === ws.id}
                    className="text-xs font-semibold text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors uppercase tracking-wide disabled:opacity-50"
                  >
                    {deletingId === ws.id ? '...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>

            {/* Edit form */}
            {isEditing && (
              <div className="p-4 space-y-3 border-t border-stone-100">
                <div>
                  <label className={labelClass}>Class Title</label>
                  <input
                    className={inputClass}
                    value={form.title ?? ''}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Category</label>
                    <select
                      className={inputClass}
                      value={form.category ?? ''}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value as Workshop['category'] }))}
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Level</label>
                    <select
                      className={inputClass}
                      value={form.level ?? ''}
                      onChange={e => setForm(f => ({ ...f, level: e.target.value as Workshop['level'] }))}
                    >
                      {levels.map(l => (
                        <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Date</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.date ?? ''}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Time</label>
                    <input
                      type="time"
                      className={inputClass}
                      value={form.time ?? ''}
                      onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Seats</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      className={inputClass}
                      value={form.seats ?? ''}
                      onChange={e => setForm(f => ({ ...f, seats: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    rows={3}
                    className={`${inputClass} resize-none`}
                    value={form.description ?? ''}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => save(ws.id)}
                    disabled={saving}
                    className="text-xs font-semibold text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-60 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={cancel}
                    className="text-xs font-semibold text-stone-600 border border-stone-300 px-4 py-2 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

          </div>
        )
      })}
    </div>
  )
}
