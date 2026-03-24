import { create } from 'zustand'
import type { ChatConversation, ChatMessage } from '@/types'

interface ChatState {
  // Durum
  conversations: ChatConversation[]
  activeConversationId: string | null
  messages: ChatMessage[]
  isModalOpen: boolean
  unreadTotal: number
  typingUsers: Record<string, { userId: string; displayName: string }>

  // Eylemler
  setConversations: (conversations: ChatConversation[]) => void
  updateConversation: (conversation: ChatConversation) => void
  setActiveConversation: (id: string | null) => void
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  setModalOpen: (open: boolean) => void
  setTyping: (conversationId: string, userId: string, displayName: string) => void
  clearTyping: (conversationId: string, userId: string) => void
  markConversationRead: (conversationId: string, userId: string) => void
  calculateUnreadTotal: (userId: string) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isModalOpen: false,
  unreadTotal: 0,
  typingUsers: {},

  setConversations: (conversations) => {
    set({ conversations })
  },

  updateConversation: (conversation) => {
    set((state) => {
      const idx = state.conversations.findIndex((c) => c._id === conversation._id)
      const updated = [...state.conversations]
      if (idx >= 0) {
        updated[idx] = conversation
      } else {
        updated.unshift(conversation)
      }
      // Son mesaja göre sırala
      updated.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || a.updatedAt
        const bTime = b.lastMessage?.createdAt || b.updatedAt
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
      return { conversations: updated }
    })
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id, messages: [] })
  },

  setMessages: (messages) => {
    set({ messages })
  },

  addMessage: (message) => {
    set((state) => {
      // Tekrar kontrolü
      if (state.messages.some((m) => m._id === message._id)) return state
      return { messages: [...state.messages, message] }
    })
  },

  setModalOpen: (open) => {
    set({ isModalOpen: open })
  },

  setTyping: (conversationId, userId, displayName) => {
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: { userId, displayName } },
    }))
  },

  clearTyping: (conversationId) => {
    set((state) => {
      const updated = { ...state.typingUsers }
      delete updated[conversationId]
      return { typingUsers: updated }
    })
  },

  markConversationRead: (conversationId, userId) => {
    set((state) => {
      const updated = state.conversations.map((c) => {
        if (c._id === conversationId) {
          return {
            ...c,
            unreadCounts: { ...c.unreadCounts, [userId]: 0 },
          }
        }
        return c
      })
      return { conversations: updated }
    })
  },

  calculateUnreadTotal: (userId) => {
    const conversations = get().conversations
    const total = conversations.reduce((sum, c) => {
      return sum + (c.unreadCounts[userId] || 0)
    }, 0)
    set({ unreadTotal: total })
  },
}))
