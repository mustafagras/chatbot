import connectDB from '@/lib/mongodb'
import User from '@/server/models/user'

const AVATAR_COLORS = ['#FFE66D', '#FF6B9D', '#4ECDC4', '#A8E6CF', '#FF8A5C', '#C3A6FF']

export async function seedBotUser() {
  await connectDB()

  const existing = await User.findOne({ phone: '+90000000000' })
  if (existing) return existing

  const bot = await User.create({
    phone: '+90000000000',
    displayName: 'Asistan Bot',
    avatarColor: AVATAR_COLORS[2],
    isBot: true,
    isOnline: true,
  })

  console.log('🤖 Asistan Bot kullanıcısı oluşturuldu.')
  return bot
}
