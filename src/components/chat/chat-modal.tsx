'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useChatStore } from '@/store/chat-store'
import { useSocket } from '@/hooks/use-socket'
import Modal from '@/components/ui/modal'
import ConversationList from '@/components/chat/conversation-list'
import MessageArea from '@/components/chat/message-area'
import type { ChatConversation } from '@/types'

export default function ChatModal() {
  const { data: session } = useSession()
  const {
    isModalOpen,
    setModalOpen,
    setConversations,
    setActiveConversation,
    activeConversationId,
    conversations,
    calculateUnreadTotal,
    markConversationRead,
  } = useChatStore()
  const { joinConversation } = useSocket()

  const [isLoading, setIsLoading] = useState(false)

  const selectedConversation = activeConversationId
    ? (conversations.find((c) => c._id === activeConversationId) ?? null)
    : null

  async function fetchConversations() {
    try {
      const res = await fetch('/api/sohbetler')
      const data = (await res.json()) as ChatConversation[]
      setConversations(data)
      if (session?.user?.id) {
        calculateUnreadTotal(session.user.id)
        data.forEach((c) => joinConversation(c._id))
      }
    } catch (err) {
      console.error('Sohbet yükleme hatası:', err)
    }
  }

  useEffect(() => {
    void fetchConversations()
  }, [session?.user?.id])

  const handleSelectConversation = (conv: ChatConversation) => {
    setActiveConversation(conv._id)
    if (session?.user?.id) {
      markConversationRead(conv._id, session.user.id)
      calculateUnreadTotal(session.user.id)
    }
  }

  const handleBack = () => {
    setActiveConversation(null)
  }

  const handleStartBotChat = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      // Bot kullanıcısını bul
      const convRes = await fetch('/api/sohbetler')
      const convs = (await convRes.json()) as ChatConversation[]
      const botConv = convs.find((c) => c.participants.some((p) => p.isBot))

      if (botConv) {
        handleSelectConversation(botConv)
      } else {
        // Bot kullanıcısını API üzerinden ara ve sohbet başlat
        const usersRes = await fetch('/api/kullanicilar/bot')
        const botUser = (await usersRes.json()) as { _id: string }

        if (botUser?._id) {
          const res = await fetch('/api/sohbetler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participantId: botUser._id }),
          })
          const newConv = (await res.json()) as ChatConversation
          setConversations([newConv, ...conversations])
          handleSelectConversation(newConv)
        }
      }
    } catch (err) {
      console.error('Bot sohbet başlatma hatası:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setModalOpen(false)
    setActiveConversation(null)
  }

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose} size='xl' className='h-150 overflow-hidden'>
      <div className='flex h-full'>
        {/* Sol panel — Sohbet listesi */}
        <div
          className={`border-r-neo border-neo-border h-full w-full md:block md:w-80 ${
            selectedConversation ? 'hidden' : 'block'
          }`}
        >
          <ConversationList
            onSelectConversation={handleSelectConversation}
            onStartBotChat={handleStartBotChat}
          />
        </div>

        {/* Sağ panel — Mesaj alanı */}
        <div className={`h-full flex-1 ${selectedConversation ? 'block' : 'hidden md:block'}`}>
          {selectedConversation ? (
            <MessageArea conversation={selectedConversation} onBack={handleBack} />
          ) : (
            <div className='bg-neo-bg flex h-full flex-col items-center justify-center p-8 text-center'>
              <div className='border-neo border-neo-border bg-neo-purple shadow-neo-lg mb-4 flex h-24 w-24 items-center justify-center'>
                <span className='text-5xl'>💬</span>
              </div>
              <h3 className='text-neo-xl text-neo-black'>Sohbet Seçin</h3>
              <p className='text-neo-sm text-neo-gray-500 mt-2'>
                Soldan bir sohbet seçin veya yeni bir sohbet başlatın
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
