'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useChatStore } from '@/store/chat-store'
import { getSocket } from '@/lib/socket'

/**
 * Mesaj okundu bildirimlerini Socket.IO'dan dinler
 * ve ilgili mesajların readBy alanını günceller.
 */
export function useReadReceipts() {
  const { data: session } = useSession()
  const { markMessagesRead } = useChatStore()

  useEffect(() => {
    if (!session?.user?.id) return

    const socket = getSocket()

    const handleMessagesRead = (data: { conversationId: string; userId: string }) => {
      markMessagesRead(data.conversationId, data.userId)
    }

    socket.on('messages-read', handleMessagesRead)

    return () => {
      socket.off('messages-read', handleMessagesRead)
    }
  }, [session?.user?.id, markMessagesRead])
}
