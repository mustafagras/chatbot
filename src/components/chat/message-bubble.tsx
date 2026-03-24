'use client'

import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  content: string
  createdAt: string
  isMine: boolean
  senderName?: string
}

export default function MessageBubble({
  content,
  createdAt,
  isMine,
  senderName,
}: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={cn('animate-neo-slide-up mb-3 flex', isMine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'border-neo border-neo-border shadow-neo-sm max-w-[75%] px-4 py-2.5',
          isMine
            ? 'bg-neo-chat-me text-neo-black rounded-tl-neo-md rounded-bl-neo-md rounded-tr-neo-md'
            : 'bg-neo-chat-other text-neo-black rounded-tr-neo-md rounded-br-neo-md rounded-tl-neo-md',
        )}
      >
        {!isMine && senderName && (
          <p className='text-neo-purple mb-1 text-[11px] font-extrabold'>{senderName}</p>
        )}
        <p className='text-[14px] leading-relaxed wrap-break-word'>{content}</p>
        <p
          className={cn(
            'mt-1 text-[10px]',
            isMine ? 'text-neo-gray-600 text-right' : 'text-neo-gray-400',
          )}
        >
          {time}
        </p>
      </div>
    </div>
  )
}
