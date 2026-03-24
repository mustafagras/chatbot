'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import Button from '@/components/ui/button'

interface LoginFormData {
  phone: string
}

export default function GirisPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const { handleSubmit, formState } = useForm<LoginFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async () => {
    if (phone.replace(/\s+/g, '').length < 10) {
      setError('Geçerli bir telefon numarası girin.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const result = await signIn('credentials', {
        phone: phone.replace(/\s+/g, ''),
        redirect: false,
      })

      if (result?.error) {
        setError('Giriş başarısız. Tekrar deneyin.')
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

  return (
    <div className='bg-neo-bg flex min-h-screen items-center justify-center p-4'>
      <div className='animate-neo-pop w-full max-w-md'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <div className='border-neo border-neo-border bg-neo-yellow shadow-neo-lg mx-auto mb-4 flex h-20 w-20 items-center justify-center'>
            <span className='text-4xl'>💬</span>
          </div>
          <h1 className='text-neo-3xl text-neo-black'>Sohbet</h1>
          <p className='text-neo-sm text-neo-gray-500 mt-2'>Telefon numaranız ile giriş yapın</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='border-neo border-neo-border shadow-neo-xl bg-white p-8'
        >
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
            {error && <p className='text-neo-xs text-neo-red animate-neo-shake mt-2'>{error}</p>}
          </div>

          <Button
            type='submit'
            className='w-full'
            size='lg'
            isLoading={isSubmitting || formState.isSubmitting}
          >
            Giriş Yap
          </Button>

          <p className='text-neo-xs text-neo-gray-400 mt-4 text-center'>
            Hesabınız yoksa otomatik oluşturulacaktır
          </p>
        </form>

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
