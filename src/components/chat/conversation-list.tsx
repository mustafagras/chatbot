'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { useChatStore } from '@/store/chat-store'
import { cn } from '@/lib/utils'
import Avatar from '@/components/ui/avatar'
import Badge from '@/components/ui/badge'
import Button from '@/components/ui/button'
import type { ChatConversation } from '@/types'

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Dün'
  } else if (diffDays < 7) {
    return date.toLocaleDateString('tr-TR', { weekday: 'short' })
  }
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
}

interface ConversationListProps {
  onSelectConversation: (conversation: ChatConversation) => void
  onStartBotChat: () => void
}

export default function ConversationList({
  onSelectConversation,
  onStartBotChat,
}: ConversationListProps) {
  const { data: session } = useSession()
  const { conversations, activeConversationId, typingUsers } = useChatStore()

  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [newChatPhone, setNewChatPhone] = useState('')
  const [newChatError, setNewChatError] = useState('')
  const [isNewChatLoading, setIsNewChatLoading] = useState(false)

  if (!session?.user?.id) return null

  const userId = session.user.id

  function getOtherParticipant(conv: ChatConversation) {
    return conv.participants.find((p) => p._id !== userId)
  }

  const handleStartNewChatParams = async () => {
    const cleanPhone = newChatPhone.replace(/\s+/g, '')
    if (cleanPhone.length < 10) {
      setNewChatError('Geçerli bir telefon numarası girin.')
      return
    }

    if (session?.user?.phone === cleanPhone) {
      setNewChatError('Kendinizle sohbet edemezsiniz.')
      return
    }

    setNewChatError('')
    setIsNewChatLoading(true)

    try {
      const usersRes = await fetch(
        `/api/kullanicilar/telefon?phone=${encodeURIComponent(cleanPhone)}`,
      )
      if (!usersRes.ok) {
        setNewChatError('Kullanıcı bulunamadı. Önce giriş yapıp kayıt olması gerekir.')
        setIsNewChatLoading(false)
        return
      }

      const targetUser = await usersRes.json()

      const res = await fetch('/api/sohbetler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: targetUser._id }),
      })
      const newConv = await res.json()

      const exists = conversations.find((c) => c._id === newConv._id)
      if (!exists) {
        useChatStore.getState().setConversations([newConv, ...conversations])
      }
      onSelectConversation(newConv)
      setIsNewChatOpen(false)
      setNewChatPhone('')
    } catch {
      setNewChatError('Bir hata oluştu.')
    } finally {
      setIsNewChatLoading(false)
    }
  }

  return (
    <div className='flex h-full flex-col bg-white'>
      {/* Başlık */}
      <div className='border-b-neo border-neo-border bg-neo-yellow px-4 py-3'>
        <h3 className='text-neo-lg text-neo-black'>Sohbetler</h3>
      </div>

      <div className='border-b-neo border-neo-border bg-neo-bg flex flex-col'>
        {/* Bot ile sohbet başlat butonu */}
        <button
          onClick={onStartBotChat}
          className={cn(
            'flex w-full cursor-pointer items-center gap-3 px-4 py-3',
            'bg-neo-mint transition-neo duration-neo hover:bg-neo-blue',
          )}
        >
          <div className='border-neo border-neo-border shadow-neo-sm flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl'>
            🤖
          </div>
          <span className='text-neo-sm text-neo-black'>Asistan Bot ile sohbet başlat</span>
        </button>

        {/* Yeni Sohbet Başlat butonu */}
        <button
          onClick={() => setIsNewChatOpen(!isNewChatOpen)}
          className={cn(
            'border-t-neo border-neo-border flex w-full cursor-pointer items-center gap-3 px-4 py-3',
            'bg-neo-pink transition-neo duration-neo hover:bg-neo-orange',
          )}
        >
          <div className='border-neo border-neo-border shadow-neo-sm flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl'>
            ➕
          </div>
          <span className='text-neo-sm text-neo-black'>Yeni sohbet başlat</span>
        </button>

        {/* Yeni Sohbet Inline Form */}
        {isNewChatOpen && (
          <div className='animate-neo-slide-up border-neo-border border-t-neo bg-white p-4'>
            <label className='text-neo-sm text-neo-black mb-2 block'>Telefon Numarası</label>
            <PhoneInput defaultCountry='tr' value={newChatPhone} onChange={setNewChatPhone} />
            {newChatError && (
              <p className='text-neo-xs text-neo-red animate-neo-shake mt-2'>{newChatError}</p>
            )}
            <Button
              className='mt-4 w-full'
              size='sm'
              isLoading={isNewChatLoading}
              onClick={handleStartNewChatParams}
            >
              Mesaj Gönder
            </Button>
          </div>
        )}
      </div>

      {/* Sohbet listesi */}
      <div className='neo-scrollbar flex-1 overflow-y-auto'>
        {conversations.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-8 text-center'>
            <div className='mb-3 text-4xl'>💬</div>
            <p className='text-neo-sm text-neo-gray-500'>Henüz sohbet yok</p>
            <p className='text-neo-xs text-neo-gray-400'>Asistan Bot ile başlayın!</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const other = getOtherParticipant(conv)
            if (!other) return null

            const unread = conv.unreadCounts[userId] || 0
            const isActive = conv._id === activeConversationId
            const isTyping = typingUsers[conv._id]

            return (
              <button
                key={conv._id}
                onClick={() => onSelectConversation(conv)}
                className={cn(
                  'border-neo-gray-200 flex w-full cursor-pointer items-center gap-3 border-b px-4 py-3',
                  'transition-neo duration-neo hover:bg-neo-gray-100',
                  isActive && 'bg-neo-gray-100 border-l-neo-yellow border-l-4',
                  unread > 0 && !isActive && 'bg-neo-chat-unread font-bold',
                )}
              >
                <Avatar
                  name={other.displayName}
                  color={other.avatarColor}
                  size='md'
                  isOnline={other.isOnline}
                />
                <div className='flex flex-1 flex-col items-start overflow-hidden'>
                  <div className='flex w-full items-center justify-between'>
                    <span
                      className={cn(
                        'text-neo-sm text-neo-black truncate',
                        unread > 0 && 'font-extrabold',
                      )}
                    >
                      {other.displayName}
                    </span>
                    {conv.lastMessage && (
                      <span className='text-neo-gray-400 shrink-0 text-[11px]'>
                        {formatTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className='flex w-full items-center justify-between'>
                    <span className='text-neo-gray-500 truncate text-[13px]'>
                      {isTyping ? (
                        <span className='text-neo-blue italic'>yazıyor...</span>
                      ) : conv.lastMessage ? (
                        conv.lastMessage.content
                      ) : (
                        'Henüz mesaj yok'
                      )}
                    </span>
                    {unread > 0 && (
                      <Badge variant='notification' count={unread} className='ml-2 shrink-0' />
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
