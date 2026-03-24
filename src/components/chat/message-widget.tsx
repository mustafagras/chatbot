'use client'

import { useChatStore } from '@/store/chat-store'
import Badge from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function MessageWidget() {
  const { isModalOpen, setModalOpen, unreadTotal } = useChatStore()

  return (
    <button
      id='message-widget'
      onClick={() => setModalOpen(!isModalOpen)}
      className={cn(
        'fixed right-6 bottom-6 z-999 flex h-16 w-16 cursor-pointer items-center justify-center',
        'border-neo border-neo-border bg-neo-yellow shadow-neo-lg',
        'transition-neo duration-neo rounded-full',
        'hover:shadow-neo-xl hover:-translate-x-0.5 hover:-translate-y-0.5',
        'active:shadow-neo-none active:-translate-x-0.5 active:-translate-y-0.5',
        isModalOpen && 'bg-neo-pink',
      )}
      aria-label='Mesajları aç'
    >
      {/* Mesaj ikonu */}
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='text-neo-black h-7 w-7'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2.5}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
        />
      </svg>
      {/* Bildirim badge */}
      {unreadTotal > 0 && (
        <div className='animate-neo-bounce absolute -top-1 -right-1'>
          <Badge variant='notification' count={unreadTotal} />
        </div>
      )}
    </button>
  )
}
