export type Category = 'dishes' | 'crafts' | 'drawing' | 'music' | 'gardening' | 'other'
export type Level = 'beginner' | 'intermediate' | 'all levels'

export interface Member {
  id: string
  name: string
  neighborhood: string
  avatarInitials: string
  avatarBg: string
  bio: string
  livedExperience: string
  skills: string[]
  hostedCount: number
  rating: number
  joinedDate: string
  isCurrentUser?: boolean
}

export interface Workshop {
  id: string
  title: string
  description: string
  category: Category
  duration: number
  level: Level
  hostId: string
  hostEmail?: string
  date: string
  time: string
  seats: number
  bookedSeats: number
  emoji: string
  cardBg: string
  imageUrl?: string
  isHostedByCurrentUser?: boolean
  isBooked?: boolean
}
