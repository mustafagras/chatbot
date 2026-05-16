'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import Button from '@/components/ui/button'

type Step = 'phone' | 'otp'

export default function GirisPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [devOtp, setDevOtp] = useState<string | null>(null)

  // Adım 1: OTP gönder
  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\s+/g, '')
    if (cleanPhone.length < 10) {
      setError('Geçerli bir telefon numarası girin.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/otp/gonder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      })

      const data = (await res.json()) as { message?: string; otp?: string; error?: string }

      if (!res.ok) {
        setError(data.error || 'Kod gönderilemedi.')
        return
      }

      // Dev modda OTP'yi göster
      if (data.otp) {
        setDevOtp(data.otp)
      }

      setStep('otp')
    } catch {
      setError('Bir hata oluştu. Tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Adım 2: OTP doğrula ve giriş yap
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('6 haneli doğrulama kodunu girin.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const cleanPhone = phone.replace(/\s+/g, '')

      const result = await signIn('credentials', {
        phone: cleanPhone,
        otp,
        redirect: false,
      })

      if (result?.error) {
        setError('Doğrulama kodu hatalı veya süresi dolmuş.')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Bir hata oluştu. Tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Geri dön
  const handleBack = () => {
    setStep('phone')
    setOtp('')
    setError('')
    setDevOtp(null)
  }

  // Tekrar gönder
  const handleResend = async () => {
    setOtp('')
    setError('')
    setDevOtp(null)
    await handleSendOtp()
  }

  return (
    <div className='bg-neo-bg flex min-h-screen items-center justify-center p-4'>
      <div className='animate-neo-pop w-full max-w-md'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <div className='border-neo border-neo-border bg-neo-yellow shadow-neo-lg mx-auto mb-4 flex h-20 w-20 items-center justify-center'>
            <span className='text-4xl'>{step === 'phone' ? '💬' : '🔐'}</span>
          </div>
          <h1 className='text-neo-3xl text-neo-black'>Sohbet</h1>
          <p className='text-neo-sm text-neo-gray-500 mt-2'>
            {step === 'phone' ? 'Telefon numaranız ile giriş yapın' : 'Doğrulama kodunu girin'}
          </p>
        </div>

        {/* Form */}
        <div className='border-neo border-neo-border shadow-neo-xl bg-white p-8'>
          {step === 'phone' ? (
            <>
              <div className='mb-6'>
                <label htmlFor='phone-input' className='text-neo-sm text-neo-black mb-2 block'>
                  Telefon Numarası
                </label>
                <PhoneInput
                  defaultCountry='tr'
                  value={phone}
                  onChange={setPhone}
                  inputProps={{
                    id: 'phone-input',
                  }}
                />
                {error && (
                  <p className='text-neo-xs text-neo-red animate-neo-shake mt-2'>{error}</p>
                )}
              </div>

              <Button
                type='button'
                className='w-full'
                size='lg'
                isLoading={isSubmitting}
                onClick={handleSendOtp}
              >
                Doğrulama Kodu Gönder
              </Button>

              <p className='text-neo-xs text-neo-gray-400 mt-4 text-center'>
                Hesabınız yoksa otomatik oluşturulacaktır
              </p>
            </>
          ) : (
            <>
              {/* Numara göstergesi */}
              <div className='border-neo border-neo-border bg-neo-bg mb-5 flex items-center justify-between px-4 py-2'>
                <span className='text-neo-xs text-neo-gray-500'>📱 {phone}</span>
                <button
                  type='button'
                  onClick={handleBack}
                  className='text-neo-xs text-neo-purple font-bold underline'
                >
                  Değiştir
                </button>
              </div>

              {/* Dev mod OTP göstergesi */}
              {devOtp && (
                <div className='border-neo border-neo-border bg-neo-mint mb-5 px-4 py-3 text-center'>
                  <p className='text-neo-xs text-neo-gray-500 mb-1'>🧪 Geliştirme modu</p>
                  <p className='text-neo-lg text-neo-black font-mono tracking-[0.3em]'>{devOtp}</p>
                </div>
              )}

              <div className='mb-6'>
                <label htmlFor='otp-input' className='text-neo-sm text-neo-black mb-2 block'>
                  Doğrulama Kodu
                </label>
                <input
                  id='otp-input'
                  type='text'
                  inputMode='numeric'
                  maxLength={6}
                  placeholder='000000'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className='border-neo border-neo-border w-full px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] outline-none'
                  autoFocus
                />
                {error && (
                  <p className='text-neo-xs text-neo-red animate-neo-shake mt-2'>{error}</p>
                )}
              </div>

              <Button
                type='button'
                className='w-full'
                size='lg'
                isLoading={isSubmitting}
                onClick={handleVerifyOtp}
              >
                Giriş Yap
              </Button>

              <p className='text-neo-xs text-neo-gray-400 mt-4 text-center'>
                Kod gelmedi mi?{' '}
                <button
                  type='button'
                  onClick={handleResend}
                  className='text-neo-purple font-bold underline'
                >
                  Tekrar Gönder
                </button>
              </p>
            </>
          )}
        </div>

        {/* Decorative elements */}
        <div className='mt-6 flex justify-center gap-3'>
          <div className='border-neo border-neo-border bg-neo-pink shadow-neo-sm h-4 w-4' />
          <div className='border-neo border-neo-border bg-neo-blue shadow-neo-sm h-4 w-4' />
          <div className='border-neo border-neo-border bg-neo-mint shadow-neo-sm h-4 w-4' />
          <div className='border-neo border-neo-border bg-neo-orange shadow-neo-sm h-4 w-4' />
          <div className='border-neo border-neo-border bg-neo-purple shadow-neo-sm h-4 w-4' />
        </div>
      </div>
    </div>
  )
}
