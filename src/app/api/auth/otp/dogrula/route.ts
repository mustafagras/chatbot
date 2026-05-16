import { NextRequest, NextResponse } from 'next/server'
import { verifyOtp } from '@/lib/otp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone, otp } = body as { phone?: string; otp?: string }

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Telefon ve doğrulama kodu gerekli.' }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\s+/g, '')
    const result = await verifyOtp(cleanPhone, otp)

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ message: 'Doğrulama başarılı.' })
  } catch (err) {
    console.error('OTP doğrulama hatası:', err)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}
