'use client'

import { useSession, signOut } from 'next-auth/react'
import MessageWidget from '@/components/chat/message-widget'
import ChatModal from '@/components/chat/chat-modal'
import Button from '@/components/ui/button'

export default function HomeView() {
  const { data: session } = useSession()

  return (
    <div className='bg-neo-bg relative flex min-h-screen flex-col'>
      {/* Üst çubuk */}
      <header className='border-b-neo border-neo-border shadow-neo-sm flex items-center justify-between bg-white px-6 py-3'>
        <div className='flex items-center gap-3'>
          <div className='border-neo border-neo-border bg-neo-yellow shadow-neo-sm flex h-10 w-10 items-center justify-center'>
            <span className='text-xl'>💬</span>
          </div>
          <h1 className='text-neo-lg text-neo-black'>Sohbet</h1>
        </div>
        <div className='flex items-center gap-4'>
          {session?.user && (
            <span className='text-neo-sm text-neo-gray-600 hidden sm:inline'>
              Merhaba, <strong>{session.user.name}</strong>
            </span>
          )}
          <Button variant='ghost' size='sm' onClick={() => signOut({ callbackUrl: '/giris' })}>
            Çıkış
          </Button>
        </div>
      </header>

      {/* Ana içerik — boş sayfa */}
      <main className='flex flex-1 flex-col items-center justify-center p-8 text-center'>
        <div className='animate-neo-pop'>
          <div className='border-neo border-neo-border bg-neo-purple shadow-neo-xl mx-auto mb-6 flex h-32 w-32 items-center justify-center'>
            <span className='text-6xl'>🚀</span>
          </div>
          <h2 className='text-neo-2xl text-neo-black'>Hoş Geldiniz!</h2>
          <p className='text-neo-base text-neo-gray-500 mt-3 max-w-md'>
            Sağ alttaki mesaj butonuna tıklayarak sohbete başlayabilirsiniz.
          </p>

          {/* Dekoratif elementler */}
          <div className='mt-8 flex justify-center gap-4'>
            <div className='border-neo border-neo-border bg-neo-yellow shadow-neo-sm h-6 w-6 rotate-12' />
            <div className='border-neo border-neo-border bg-neo-pink shadow-neo-sm h-6 w-6 -rotate-6' />
            <div className='border-neo border-neo-border bg-neo-mint shadow-neo-sm h-6 w-6 rotate-3' />
            <div className='border-neo border-neo-border bg-neo-orange shadow-neo-sm h-6 w-6 -rotate-12' />
            <div className='border-neo border-neo-border bg-neo-blue shadow-neo-sm h-6 w-6 rotate-6' />
          </div>
        </div>
      </main>

      {/* MessageWidget + ChatModal */}
      <MessageWidget />
      <ChatModal />
    </div>
  )
}
