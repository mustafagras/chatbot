'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useChatStore } from '@/store/chat-store'
import { getSocket } from '@/lib/socket'

/**
 * Kullanıcı online/offline durumlarını Socket.IO'dan dinler
 * ve chat store'daki onlineUsers listesini günceller.
 */
export function usePresence() {
  const { data: session } = useSession()
  const { setUserOnline } = useChatStore()

  useEffect(() => {
    if (!session?.user?.id) return

    const socket = getSocket()

    const handleUserStatus = (data: { userId: string; isOnline: boolean }) => {
      setUserOnline(data.userId, data.isOnline)
    }

    socket.on('user-status', handleUserStatus)

    return () => {
      socket.off('user-status', handleUserStatus)
    }
  }, [session?.user?.id, setUserOnline])
}
