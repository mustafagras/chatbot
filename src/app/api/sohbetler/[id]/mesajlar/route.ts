import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Message from '@/server/models/message'
import mongoose from 'mongoose'

// GET /api/sohbetler/[id]/mesajlar — sohbetin mesajlarını getir
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { id } = await params

  await connectDB()

  const messages = await Message.find({
    conversationId: new mongoose.Types.ObjectId(id),
  })
    .sort({ createdAt: 1 })
    .lean()

  const data = messages.map((m) => ({
    _id: m._id.toString(),
    conversationId: m.conversationId.toString(),
    senderId: m.senderId.toString(),
    content: m.content,
    readBy: m.readBy.map((r: mongoose.Types.ObjectId) => r.toString()),
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
  }))

  return NextResponse.json(data)
}
