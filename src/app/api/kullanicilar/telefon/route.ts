import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/server/models/user'

// GET /api/kullanicilar/telefon?phone=+90...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const phone = searchParams.get('phone')

  if (!phone) {
    return NextResponse.json({ error: 'Telefon numarası gerekli' }, { status: 400 })
  }

  await connectDB()

  const cleanPhone = phone.replace(/\s+/g, '')
  const user = await User.findOne({ phone: cleanPhone }).lean()

  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  }

  return NextResponse.json({
    _id: user._id.toString(),
    phone: user.phone,
    displayName: user.displayName,
    avatarColor: user.avatarColor,
    isBot: user.isBot,
    isOnline: user.isOnline,
  })
}
