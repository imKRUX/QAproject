'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

const categories = ['Dishes', 'Crafts', 'Drawing', 'Music', 'Gardening', 'Other']
const levels = ['beginner', 'intermediate', 'all levels']

const emptyForm = {
  title: '',
  category: '',
  level: '',
  date: '',
  time: '',
  seats: '',
  supplies: '',
  description: '',
}

export function WorkshopForm({ hostEmail }: { hostEmail: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof typeof emptyForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setImageUrl(data.url)
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/workshops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, hostEmail, imageUrl }),
    })
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 text-center">
        <h3 className="font-bold text-lg mb-1" style={{ color: '#ea580c' }}>
          Workshop Scheduled!
        </h3>
        <p className="text-sm text-stone-500 mb-4">
          Your class has been added to the community board.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm(emptyForm); setImageUrl(null); setImagePreview(null) }}
          className="text-sm font-semibold underline"
          style={{ color: '#ea580c' }}
        >
          Schedule another class
        </button>
      </div>
    )
  }

  const inputClass =
    'w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent'
  const labelClass = 'text-[10px] font-semibold text-stone-400 uppercase tracking-widest block mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Class Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={set('title')}
            placeholder="e.g. Hand-Pulled Noodles Workshop"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Specialty Category *</label>
          <select
            required
            value={form.category}
            onChange={set('category')}
            className={inputClass}
          >
            <option value="">Select category...</option>
            {categories.map(c => (
              <option key={c} value={c.toLowerCase()}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Skill Level *</label>
        <select
          required
          value={form.level}
          onChange={set('level')}
          className={inputClass}
        >
          <option value="">Select level...</option>
          {levels.map(l => (
            <option key={l} value={l}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Date *</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={set('date')}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Time *</label>
          <input
            type="time"
            required
            value={form.time}
            onChange={set('time')}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Available Seats *</label>
          <input
            type="number"
            required
            min="1"
            max="50"
            value={form.seats}
            onChange={set('seats')}
            placeholder="e.g. 8"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>What Students Should Bring</label>
        <input
          type="text"
          value={form.supplies}
          onChange={set('supplies')}
          placeholder="e.g. An apron, a notebook, comfortable clothes"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={set('description')}
          placeholder="Describe what participants will learn and experience in this session..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className={labelClass}>Workshop Cover Image</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-stone-200 rounded-xl overflow-hidden cursor-pointer hover:border-stone-400 transition-colors"
        >
          {imagePreview ? (
            <div className="relative h-48 w-full">
              <Image
                src={imagePreview}
                alt="Cover preview"
                fill
                className="object-cover"
                sizes="100vw"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">Uploading...</span>
                </div>
              )}
              {!uploading && (
                <div className="absolute bottom-2 right-2">
                  <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded">
                    ✓ Uploaded · Click to change
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-stone-400">
              <p className="text-sm font-medium">Click to upload a cover image</p>
              <p className="text-xs mt-1">JPG, PNG, WEBP · Max 5MB</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-60 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
      >
        {loading ? 'Saving...' : 'Schedule Class →'}
      </button>
    </form>
  )
}
