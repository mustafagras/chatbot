import { createServer } from 'http'
import next from 'next'
import { Server as SocketIOServer } from 'socket.io'
import mongoose from 'mongoose'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

// --- Bot mesajları (Türkçe) ---
const BOT_REPLIES = [
  'Merhaba! Size nasıl yardımcı olabilirim? 😊',
  'Anladım, hemen ilgileniyorum! 🚀',
  'Bu konuda size yardımcı olabilirim.',
  'Tabii ki! Başka bir sorunuz var mı?',
  'Harika bir soru! İşte cevabım... 💡',
  'Teşekkür ederim, mesajınız alındı! ✅',
  'Biraz daha detay verebilir misiniz? 🤔',
  'Bu çok güzel bir fikir! 🎉',
  'Elbette, hemen bakıyorum.',
  'Sizin için en iyisini yapmaya çalışıyorum! 💪',
]

function randomBotReply(): string {
  return BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)]
}

// --- Dinamik model import ---
async function loadModels() {
  const { default: User } = await import('./src/server/models/user.js')
  const { default: Conversation } = await import('./src/server/models/conversation.js')
  const { default: Message } = await import('./src/server/models/message.js')
  return { User, Conversation, Message }
}

app.prepare().then(async () => {
  // MongoDB bağlantısı
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot'
  await mongoose.connect(mongoUri)
  console.log('✅ MongoDB bağlantısı kuruldu.')

  // Bot kullanıcısını oluştur
  const { seedBotUser } = await import('./src/server/seed.js')
  await seedBotUser()

  const httpServer = createServer(handler)

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Socket bağlandı: ${socket.id}`)

    // Kullanıcı kimlik doğrulama
    socket.on('authenticate', async (userId: string) => {
      socket.join(`user:${userId}`)
      socket.data.userId = userId

      try {
        const { User } = await loadModels()
        await User.findByIdAndUpdate(userId, { isOnline: true })
        io.emit('user-status', { userId, isOnline: true })
      } catch (err) {
        console.error('Auth error:', err)
      }

      console.log(`👤 Kullanıcı doğrulandı: ${userId}`)
    })

    // Sohbet odasına katılma
    socket.on('join-conversation', (conversationId: string) => {
      socket.join(`conv:${conversationId}`)
      console.log(`📥 ${socket.data.userId} → conv:${conversationId}`)
    })

    // Sohbet odasından ayrılma
    socket.on('leave-conversation', (conversationId: string) => {
      socket.leave(`conv:${conversationId}`)
    })

    // Mesaj gönderme
    socket.on(
      'send-message',
      async (data: { conversationId: string; content: string; senderId: string }) => {
        try {
          const { Message, Conversation, User } = await loadModels()

          // Mesajı kaydet
          const message = await Message.create({
            conversationId: new mongoose.Types.ObjectId(data.conversationId),
            senderId: new mongoose.Types.ObjectId(data.senderId),
            content: data.content,
            readBy: [new mongoose.Types.ObjectId(data.senderId)],
          })

          // Sohbeti güncelle
          const conversation = await Conversation.findById(data.conversationId)
          if (conversation) {
            conversation.lastMessage = {
              content: data.content,
              senderId: new mongoose.Types.ObjectId(data.senderId),
              createdAt: message.createdAt,
            }

            const roomSockets = await io.in(`conv:${data.conversationId}`).fetchSockets()
            const activeUserIds = roomSockets.map((s) => s.data.userId)

            // Okunmamış sayılarını güncelle
            for (const participantId of conversation.participants) {
              const pid = participantId.toString()
              if (pid !== data.senderId && !activeUserIds.includes(pid)) {
                const current = conversation.unreadCounts.get(pid) || 0
                conversation.unreadCounts.set(pid, current + 1)
              }
            }

            await conversation.save()
          }

          const populatedMessage = {
            _id: message._id.toString(),
            conversationId: message.conversationId.toString(),
            senderId: message.senderId.toString(),
            content: message.content,
            readBy: message.readBy.map((id: mongoose.Types.ObjectId) => id.toString()),
            createdAt: message.createdAt.toISOString(),
          }

          // Odaya yayınla
          io.to(`conv:${data.conversationId}`).emit('new-message', populatedMessage)

          // Sohbet listesi güncelleme
          if (conversation) {
            const updatedConv = await Conversation.findById(data.conversationId)
              .populate('participants')
              .lean()

            if (updatedConv) {
              const convData = {
                ...updatedConv,
                _id: updatedConv._id.toString(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                participants: (updatedConv.participants as any[]).map((p: any) => ({
                  ...p,
                  _id: (p._id as mongoose.Types.ObjectId).toString(),
                })),
                lastMessage: updatedConv.lastMessage
                  ? {
                      ...updatedConv.lastMessage,
                      senderId: updatedConv.lastMessage.senderId.toString(),
                      createdAt:
                        updatedConv.lastMessage.createdAt instanceof Date
                          ? updatedConv.lastMessage.createdAt.toISOString()
                          : String(updatedConv.lastMessage.createdAt),
                    }
                  : null,
                unreadCounts:
                  updatedConv.unreadCounts instanceof Map
                    ? Object.fromEntries(updatedConv.unreadCounts)
                    : (updatedConv.unreadCounts as Record<string, number>),
              }

              // Tüm katılımcılara güncelleme gönder
              for (const p of conversation.participants) {
                io.to(`user:${p.toString()}`).emit('conversation-updated', convData)
              }
            }
          }

          // Bot otomatik yanıtı
          if (conversation) {
            const botParticipant = await User.findOne({
              _id: { $in: conversation.participants },
              isBot: true,
            })

            if (botParticipant && data.senderId !== botParticipant._id.toString()) {
              const delay = 1000 + Math.random() * 2000

              // typing göster
              setTimeout(() => {
                io.to(`conv:${data.conversationId}`).emit('typing', {
                  conversationId: data.conversationId,
                  userId: botParticipant._id.toString(),
                  displayName: botParticipant.displayName,
                })
              }, 500)

              setTimeout(async () => {
                const botReply = randomBotReply()
                const botMessage = await Message.create({
                  conversationId: new mongoose.Types.ObjectId(data.conversationId),
                  senderId: botParticipant._id,
                  content: botReply,
                  readBy: [botParticipant._id],
                })

                const updatedConv2 = await Conversation.findById(data.conversationId)
                if (updatedConv2) {
                  updatedConv2.lastMessage = {
                    content: botReply,
                    senderId: botParticipant._id,
                    createdAt: botMessage.createdAt,
                  }
                  const roomSockets2 = await io.in(`conv:${data.conversationId}`).fetchSockets()
                  const activeUserIds2 = roomSockets2.map((s) => s.data.userId)

                  for (const pid of updatedConv2.participants) {
                    const pidStr = pid.toString()
                    if (
                      pidStr !== botParticipant._id.toString() &&
                      !activeUserIds2.includes(pidStr)
                    ) {
                      const curr = updatedConv2.unreadCounts.get(pidStr) || 0
                      updatedConv2.unreadCounts.set(pidStr, curr + 1)
                    }
                  }
                  await updatedConv2.save()
                }

                const botMsgData = {
                  _id: botMessage._id.toString(),
                  conversationId: botMessage.conversationId.toString(),
                  senderId: botMessage.senderId.toString(),
                  content: botMessage.content,
                  readBy: botMessage.readBy.map((id: mongoose.Types.ObjectId) => id.toString()),
                  createdAt: botMessage.createdAt.toISOString(),
                }

                // Stop typing
                io.to(`conv:${data.conversationId}`).emit('stop-typing', {
                  conversationId: data.conversationId,
                  userId: botParticipant._id.toString(),
                })

                io.to(`conv:${data.conversationId}`).emit('new-message', botMsgData)

                // Sohbet listesi güncelleme
                const finalConv = await Conversation.findById(data.conversationId)
                  .populate('participants')
                  .lean()

                if (finalConv) {
                  const convData = {
                    ...finalConv,
                    _id: finalConv._id.toString(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    participants: (finalConv.participants as any[]).map((p: any) => ({
                      ...p,
                      _id: (p._id as mongoose.Types.ObjectId).toString(),
                    })),
                    lastMessage: finalConv.lastMessage
                      ? {
                          ...finalConv.lastMessage,
                          senderId: finalConv.lastMessage.senderId.toString(),
                          createdAt:
                            finalConv.lastMessage.createdAt instanceof Date
                              ? finalConv.lastMessage.createdAt.toISOString()
                              : String(finalConv.lastMessage.createdAt),
                        }
                      : null,
                    unreadCounts:
                      finalConv.unreadCounts instanceof Map
                        ? Object.fromEntries(finalConv.unreadCounts)
                        : (finalConv.unreadCounts as Record<string, number>),
                  }
                  for (const p of updatedConv2?.participants || []) {
                    io.to(`user:${p.toString()}`).emit('conversation-updated', convData)
                  }
                }
              }, delay)
            }
          }
        } catch (err) {
          console.error('Mesaj gönderme hatası:', err)
        }
      },
    )

    // Yazıyor göstergesi
    socket.on('typing', (data: { conversationId: string; displayName: string }) => {
      socket.to(`conv:${data.conversationId}`).emit('typing', {
        conversationId: data.conversationId,
        userId: socket.data.userId,
        displayName: data.displayName,
      })
    })

    socket.on('stop-typing', (data: { conversationId: string }) => {
      socket.to(`conv:${data.conversationId}`).emit('stop-typing', {
        conversationId: data.conversationId,
        userId: socket.data.userId,
      })
    })

    // Okundu işareti
    socket.on('mark-read', async (data: { conversationId: string; userId: string }) => {
      try {
        const { Message, Conversation } = await loadModels()

        await Message.updateMany(
          {
            conversationId: new mongoose.Types.ObjectId(data.conversationId),
            readBy: { $ne: new mongoose.Types.ObjectId(data.userId) },
          },
          { $addToSet: { readBy: new mongoose.Types.ObjectId(data.userId) } },
        )

        const conversation = await Conversation.findById(data.conversationId)
        if (conversation) {
          conversation.unreadCounts.set(data.userId, 0)
          await conversation.save()
        }

        socket.to(`conv:${data.conversationId}`).emit('messages-read', {
          conversationId: data.conversationId,
          userId: data.userId,
        })
      } catch (err) {
        console.error('Mark read error:', err)
      }
    })

    socket.on('disconnect', async () => {
      const userId = socket.data.userId
      if (userId) {
        try {
          const sockets = await io.in(`user:${userId}`).fetchSockets()
          if (sockets.length === 0) {
            const { User } = await loadModels()
            await User.findByIdAndUpdate(userId, { isOnline: false })
            io.emit('user-status', { userId, isOnline: false })
          }
        } catch (err) {
          console.error('Disconnect error:', err)
        }
      }
      console.log(`❌ Socket ayrıldı: ${socket.id}`)
    })
  })

  httpServer.listen(port, () => {
    console.log(`\n🚀 Sunucu hazır: http://${hostname}:${port}\n`)
  })
})
