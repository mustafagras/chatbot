'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { getSocket } from '@/lib/socket'
import { useChatStore } from '@/store/chat-store'
import type { ChatMessage, ChatConversation } from '@/types'

export function useSocket() {
  const { data: session } = useSession()
  const connectedRef = useRef(false)

  const {
    addMessage,
    updateConversation,
    setTyping,
    clearTyping,
    calculateUnreadTotal,
    isModalOpen,
    activeConversationId,
  } = useChatStore()

  useEffect(() => {
    if (!session?.user?.id || connectedRef.current) return

    const socket = getSocket()
    socket.connect()
    connectedRef.current = true

    socket.on('connect', () => {
      socket.emit('authenticate', session.user.id)
    })

    socket.on('new-message', (message: ChatMessage) => {
      addMessage(message)

      // Toast bildirimi — gönderen aktif sohbette değilse
      if (message.senderId !== session.user.id) {
        const store = useChatStore.getState()
        const isInActiveChat =
          store.isModalOpen && store.activeConversationId === message.conversationId
        if (!isInActiveChat) {
          toast.info(
            `💬 Yeni mesaj: ${message.content.slice(0, 50)}${message.content.length > 50 ? '...' : ''}`,
            {
              position: 'top-right',
              autoClose: 4000,
            },
          )
        }
      }
    })

    socket.on('conversation-updated', (conversation: ChatConversation) => {
      updateConversation(conversation)
      calculateUnreadTotal(session.user.id)

      const s = getSocket()
      s.emit('join-conversation', conversation._id)
    })

    socket.on('typing', (data: { conversationId: string; userId: string; displayName: string }) => {
      if (data.userId !== session.user.id) {
        setTyping(data.conversationId, data.userId, data.displayName)
      }
    })

    socket.on('stop-typing', (data: { conversationId: string; userId: string }) => {
      clearTyping(data.conversationId, data.userId)
    })

    return () => {
      socket.off('new-message')
      socket.off('conversation-updated')
      socket.off('typing')
      socket.off('stop-typing')
      socket.disconnect()
      connectedRef.current = false
    }
  }, [session?.user?.id])

  const sendMessage = (conversationId: string, content: string) => {
    if (!session?.user?.id) return
    const socket = getSocket()
    socket.emit('send-message', {
      conversationId,
      content,
      senderId: session.user.id,
    })
  }

  const joinConversation = (conversationId: string) => {
    const socket = getSocket()
    socket.emit('join-conversation', conversationId)
  }

  const leaveConversation = (conversationId: string) => {
    const socket = getSocket()
    socket.emit('leave-conversation', conversationId)
  }

  const markRead = (conversationId: string) => {
    if (!session?.user?.id) return
    const socket = getSocket()
    socket.emit('mark-read', { conversationId, userId: session.user.id })
  }

  const emitTyping = (conversationId: string) => {
    if (!session?.user?.name) return
    const socket = getSocket()
    socket.emit('typing', { conversationId, displayName: session.user.name })
  }

  const emitStopTyping = (conversationId: string) => {
    const socket = getSocket()
    socket.emit('stop-typing', { conversationId })
  }

  return {
    sendMessage,
    joinConversation,
    leaveConversation,
    markRead,
    emitTyping,
    emitStopTyping,
    isModalOpen,
    activeConversationId,
  }
}
