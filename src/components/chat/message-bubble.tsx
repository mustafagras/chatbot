'use client'

import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  content: string
  createdAt: string
  isMine: boolean
  senderName?: string
  readBy?: string[]
  currentUserId?: string
  otherParticipantId?: string
}

export default function MessageBubble({
  content,
  createdAt,
  isMine,
  senderName,
  readBy = [],
  currentUserId,
  otherParticipantId,
}: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Okundu göstergesi: sadece kendi mesajlarımda göster
  const isReadByOther = isMine && otherParticipantId ? readBy.includes(otherParticipantId) : false
  const isSent = isMine && currentUserId ? readBy.includes(currentUserId) : false

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
        <div
          className={cn('mt-1 flex items-center gap-1', isMine ? 'justify-end' : 'justify-start')}
        >
          <p className={cn('text-[10px]', isMine ? 'text-neo-gray-600' : 'text-neo-gray-400')}>
            {time}
          </p>
          {isMine && (
            <span
              className={cn(
                'text-[11px] font-bold transition-colors',
                isReadByOther ? 'text-neo-blue' : 'text-neo-gray-400',
              )}
              title={isReadByOther ? 'Okundu' : isSent ? 'İletildi' : 'Gönderildi'}
            >
              {isReadByOther ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
