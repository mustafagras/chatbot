import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/server/models/user'

// GET /api/kullanicilar/bot — bot kullanıcısını getir
export async function GET() {
  await connectDB()

  const bot = await User.findOne({ isBot: true }).lean()

  if (!bot) {
    return NextResponse.json({ error: 'Bot bulunamadı' }, { status: 404 })
  }

  return NextResponse.json({
    _id: bot._id.toString(),
    phone: bot.phone,
    displayName: bot.displayName,
    avatarColor: bot.avatarColor,
    isBot: bot.isBot,
    isOnline: bot.isOnline,
  })
}
