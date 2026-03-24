export interface ChatUser {
  _id: string
  phone: string
  displayName: string
  avatarColor: string
  isBot: boolean
  isOnline: boolean
}

export interface ChatMessage {
  _id: string
  conversationId: string
  senderId: string
  content: string
  readBy: string[]
  createdAt: string
}

export interface ChatConversation {
  _id: string
  participants: ChatUser[]
  lastMessage: {
    content: string
    senderId: string
    createdAt: string
  } | null
  unreadCounts: Record<string, number>
  updatedAt: string
}
