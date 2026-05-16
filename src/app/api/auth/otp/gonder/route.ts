import { NextRequest, NextResponse } from 'next/server'
import { createOtp } from '@/lib/otp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone } = body as { phone?: string }

    if (!phone) {
      return NextResponse.json({ error: 'Telefon numarası gerekli.' }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\s+/g, '')
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Geçerli bir telefon numarası girin.' }, { status: 400 })
    }

    const result = await createOtp(cleanPhone)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'OTP gönderilemedi.' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Doğrulama kodu gönderildi.',
      expiresInMinutes: 5,
      // Dev modda OTP'yi döndür
      ...(result.otp && { otp: result.otp }),
    })
  } catch (err) {
    console.error('OTP gönderme hatası:', err)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}
