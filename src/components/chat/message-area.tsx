'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useChatStore } from '@/store/chat-store'
import { useSocket } from '@/hooks/use-socket'
import MessageBubble from '@/components/chat/message-bubble'
import Avatar from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { ChatConversation, ChatMessage } from '@/types'

interface MessageAreaProps {
  conversation: ChatConversation
  onBack: () => void
}

export default function MessageArea({ conversation, onBack }: MessageAreaProps) {
  const { data: session } = useSession()
  const { messages, setMessages, typingUsers } = useChatStore()
  const { sendMessage, joinConversation, markRead, emitTyping, emitStopTyping } = useSocket()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const userId = session?.user?.id
  const other = conversation.participants.find((p) => p._id !== userId)
  const isTyping = typingUsers[conversation._id]

  // Sohbet odasına katıl ve mesajları yükle
  useEffect(() => {
    joinConversation(conversation._id)
    if (userId) markRead(conversation._id)

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/sohbetler/${conversation._id}/mesajlar`)
        const data = (await res.json()) as ChatMessage[]
        setMessages(data)
      } catch (err) {
        console.error('Mesaj yükleme hatası:', err)
      }
    }

    void fetchMessages()

    // Ayrılmıyoruz, böylece arka planda bildirim almaya devam edebiliriz
  }, [conversation._id])

  // Otomatik scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Mesaj gönder
  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    sendMessage(conversation._id, trimmed)
    setInputValue('')

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
    emitStopTyping(conversation._id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    emitTyping(conversation._id)

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(conversation._id)
    }, 2000)
  }

  return (
    <div className='flex h-full flex-col'>
      {/* Başlık */}
      <div className='border-b-neo border-neo-border bg-neo-blue flex items-center gap-3 px-4 py-3'>
        <button
          onClick={onBack}
          className='rounded-neo border-neo border-neo-border shadow-neo-sm transition-neo duration-neo hover:shadow-neo active:shadow-neo-none mr-1 flex h-8 w-8 cursor-pointer items-center justify-center bg-white md:hidden'
          aria-label='Geri'
        >
          ←
        </button>
        {other && (
          <>
            <Avatar
              name={other.displayName}
              color={other.avatarColor}
              size='sm'
              isOnline={other.isOnline}
            />
            <div>
              <p className='text-neo-sm text-neo-black'>{other.displayName}</p>
              <p className='text-neo-black/60 text-[11px]'>
                {isTyping ? 'yazıyor...' : other.isOnline ? 'çevrimiçi' : 'çevrimdışı'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Mesajlar */}
      <div className='bg-neo-bg neo-scrollbar flex-1 overflow-y-auto p-4'>
        {messages.length === 0 ? (
          <div className='flex h-full flex-col items-center justify-center text-center'>
            <div className='mb-3 text-5xl'>👋</div>
            <p className='text-neo-sm text-neo-gray-500'>Henüz mesaj yok</p>
            <p className='text-neo-xs text-neo-gray-400'>İlk mesajı siz gönderin!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              content={msg.content}
              createdAt={msg.createdAt}
              isMine={msg.senderId === userId}
              senderName={msg.senderId !== userId ? other?.displayName : undefined}
            />
          ))
        )}

        {/* Yazıyor göstergesi */}
        {isTyping && (
          <div className='animate-neo-fade-in mb-3 flex justify-start'>
            <div className='border-neo border-neo-border shadow-neo-sm flex items-center gap-1.5 bg-white px-4 py-2.5'>
              <span className='text-neo-gray-500 text-[13px] italic'>
                {isTyping.displayName} yazıyor
              </span>
              <span className='flex gap-0.5'>
                <span className='bg-neo-gray-400 inline-block h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0ms]' />
                <span className='bg-neo-gray-400 inline-block h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:150ms]' />
                <span className='bg-neo-gray-400 inline-block h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:300ms]' />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mesaj gönderme */}
      <div className='border-t-neo border-neo-border bg-white p-3'>
        <div className='flex gap-2'>
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder='Mesaj yazın...'
            rows={1}
            className={cn(
              'rounded-neo border-neo border-neo-border flex-1 resize-none px-4 py-2.5',
              'text-neo-sm text-neo-black shadow-neo-sm outline-none',
              'placeholder:text-neo-gray-400 placeholder:font-normal',
              'focus:shadow-neo focus:-translate-x-px focus:-translate-y-px',
              'transition-neo duration-neo',
            )}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn(
              'flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center',
              'rounded-neo border-neo border-neo-border bg-neo-yellow shadow-neo-sm',
              'transition-neo duration-neo',
              'hover:shadow-neo hover:-translate-x-px hover:-translate-y-px',
              'active:shadow-neo-none active:-translate-x-px active:-translate-y-px',
              'disabled:pointer-events-none disabled:opacity-40',
            )}
            aria-label='Gönder'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='text-neo-black h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
