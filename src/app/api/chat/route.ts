import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { streamChat, isOllamaAvailable } from '@/lib/ollama'
import { findRelevantContext, saveEmbedding } from '@/lib/rag'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `Sen yardımsever bir Türkçe sohbet asistanısın. 
Kısa ve net cevaplar ver. Gerekirse verilen bağlamı kullan.
Bağlam yoksa kendi bilginle yanıt ver.`

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const body = (await req.json()) as {
      conversationId: string
      message: string
    }

    const { conversationId, message } = body
    if (!conversationId || !message) {
      return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 })
    }

    const ollamaOk = await isOllamaAvailable()

    if (!ollamaOk) {
      // Fallback: Ollama yoksa basit yanıt
      return NextResponse.json({
        content: "Yapay zeka şu an kullanılamıyor. Lütfen Ollama'nın çalıştığından emin olun.",
        source: 'fallback',
      })
    }

    // RAG: ilgili context bul
    const context = await findRelevantContext(conversationId, message)

    // Prompt oluştur
    const systemContent = context ? `${SYSTEM_PROMPT}\n\n${context}` : SYSTEM_PROMPT

    // SSE streaming response
    const encoder = new TextEncoder()
    let fullResponse = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamChat(
            [
              { role: 'system', content: systemContent },
              { role: 'user', content: message },
            ],
            (token) => {
              fullResponse += token
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`))
            },
          )

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
          controller.close()

          // Background: embedding kaydet
          if (fullResponse) {
            void saveEmbedding(conversationId, `bot_${Date.now()}`, fullResponse)
            void saveEmbedding(conversationId, `user_${Date.now()}`, message)
          }
        } catch (err) {
          console.error('Streaming hatası:', err)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Streaming hatası' })}\n\n`),
          )
          controller.close()
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('/api/chat hatası:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
