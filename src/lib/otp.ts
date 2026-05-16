import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import Otp from '@/server/models/otp'

const OTP_LENGTH = 6
const OTP_EXPIRY_MINUTES = 5
const MAX_ATTEMPTS = 5

/**
 * 6 haneli rastgele OTP üretir
 */
function generateOtp(): string {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  return otp
}

/**
 * Yeni OTP oluşturur, bcrypt ile hash'ler ve kaydeder.
 * Geliştirme modunda OTP'yi console'a ve response'a yazar.
 * Prodüksiyonda SMS servisi entegre edilebilir.
 */
export async function createOtp(
  phone: string,
): Promise<{ success: boolean; otp?: string; error?: string }> {
  await connectDB()

  // Aynı numara için eski OTP'leri temizle
  await Otp.deleteMany({ phone })

  const plainOtp = generateOtp()
  const otpHash = await bcrypt.hash(plainOtp, 10)

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

  await Otp.create({
    phone,
    otpHash,
    attempts: 0,
    expiresAt,
  })

  // --- SMS Gönderimi ---
  // Şu anda ücretsiz SMS servisi aktif değil.
  // Prodüksiyon için Twilio, Vonage veya benzeri bir servis entegre edilebilir.
  // Geliştirme modunda OTP console'a yazdırılır.

  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    console.log(`📱 [OTP] ${phone} → ${plainOtp} (${OTP_EXPIRY_MINUTES} dk geçerli)`)
  }

  return {
    success: true,
    // Dev modda OTP'yi client'a da döndür (kolaylık için)
    ...(isDev && { otp: plainOtp }),
  }
}

/**
 * OTP doğrulama — bcrypt.compare ile hash karşılaştırması
 */
export async function verifyOtp(
  phone: string,
  plainOtp: string,
): Promise<{ valid: boolean; error?: string }> {
  await connectDB()

  const otpRecord = await Otp.findOne({ phone }).sort({ createdAt: -1 })

  if (!otpRecord) {
    return { valid: false, error: 'OTP bulunamadı. Lütfen tekrar kod isteyin.' }
  }

  // Süre dolmuş mu?
  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteMany({ phone })
    return { valid: false, error: 'OTP süresi dolmuş. Yeni kod isteyin.' }
  }

  // Deneme limiti
  if (otpRecord.attempts >= MAX_ATTEMPTS) {
    await Otp.deleteMany({ phone })
    return { valid: false, error: 'Çok fazla deneme. Yeni kod isteyin.' }
  }

  // Deneme sayısını artır
  otpRecord.attempts += 1
  await otpRecord.save()

  // bcrypt ile doğrula
  const isValid = await bcrypt.compare(plainOtp, otpRecord.otpHash)

  if (!isValid) {
    const remaining = MAX_ATTEMPTS - otpRecord.attempts
    return { valid: false, error: `Geçersiz kod. ${remaining} deneme hakkınız kaldı.` }
  }

  // Başarılı — OTP'yi temizle
  await Otp.deleteMany({ phone })

  return { valid: true }
}
