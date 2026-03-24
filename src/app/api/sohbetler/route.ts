import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Conversation from '@/server/models/conversation'
import User from '@/server/models/user'
import mongoose from 'mongoose'

interface PopulatedParticipant {
  _id: mongoose.Types.ObjectId
  phone: string
  displayName: string
  avatarColor: string
  isBot: boolean
  isOnline: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeConversation(c: any) {
  return {
    ...c,
    _id: c._id.toString(),
    participants: (c.participants as PopulatedParticipant[]).map((p) => ({
      ...p,
      _id: p._id.toString(),
    })),
    lastMessage: c.lastMessage
      ? {
          ...c.lastMessage,
          senderId: c.lastMessage.senderId.toString(),
          createdAt:
            c.lastMessage.createdAt instanceof Date
              ? c.lastMessage.createdAt.toISOString()
              : String(c.lastMessage.createdAt),
        }
      : null,
    unreadCounts:
      c.unreadCounts instanceof Map
        ? Object.fromEntries(c.unreadCounts)
        : (c.unreadCounts as Record<string, number>),
  }
}

// GET /api/sohbetler — kullanıcının sohbetlerini listele
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  await connectDB()

  const conversations = await Conversation.find({
    participants: new mongoose.Types.ObjectId(session.user.id),
  })
    .populate('participants')
    .sort({ updatedAt: -1 })
    .lean()

  const data = conversations.map(serializeConversation)
  return NextResponse.json(data)
}

// POST /api/sohbetler — yeni sohbet başlat
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const body = (await req.json()) as { participantId: string }
  if (!body.participantId) {
    return NextResponse.json({ error: 'participantId gerekli' }, { status: 400 })
  }

  await connectDB()

  // User modelini kayıt et (populate için gerekli)
  void User

  // Mevcut sohbet var mı?
  const existing = await Conversation.findOne({
    participants: {
      $all: [
        new mongoose.Types.ObjectId(session.user.id),
        new mongoose.Types.ObjectId(body.participantId),
      ],
    },
  })
    .populate('participants')
    .lean()

  if (existing) {
    return NextResponse.json(serializeConversation(existing))
  }

  // Yeni sohbet oluştur
  const conversation = await Conversation.create({
    participants: [
      new mongoose.Types.ObjectId(session.user.id),
      new mongoose.Types.ObjectId(body.participantId),
    ],
    unreadCounts: new Map([
      [session.user.id, 0],
      [body.participantId, 0],
    ]),
  })

  const populated = await Conversation.findById(conversation._id).populate('participants').lean()

  if (!populated) {
    return NextResponse.json({ error: 'Sohbet oluşturulamadı' }, { status: 500 })
  }

  return NextResponse.json(serializeConversation(populated), { status: 201 })
}
