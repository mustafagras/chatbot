import connectDB from '@/lib/mongodb'
import { embedText } from '@/lib/ollama'
import Embedding from '@/server/models/embedding'
import mongoose from 'mongoose'

/**
 * İki vektör arasında kosinüs benzerliği hesaplar (0–1 arası).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0

  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

/**
 * Konuşma geçmişinden RAG context metni bulur.
 * En alakalı K mesajı kosinüs benzerliğine göre sıralar.
 */
export async function findRelevantContext(
  conversationId: string,
  queryText: string,
  topK = 5,
  threshold = 0.5,
): Promise<string> {
  try {
    await connectDB()

    const queryVector = await embedText(queryText)
    if (!queryVector) return '' // Ollama yoksa boş context

    const embeddings = await Embedding.find({
      conversationId: new mongoose.Types.ObjectId(conversationId),
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    if (embeddings.length === 0) return ''

    const scored = embeddings
      .map((e) => ({
        content: e.content,
        score: cosineSimilarity(queryVector, e.vector),
      }))
      .filter((e) => e.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)

    if (scored.length === 0) return ''

    const contextLines = scored.map((e) => `- ${e.content}`).join('\n')
    return `İlgili geçmiş bağlam:\n${contextLines}`
  } catch (err) {
    console.error('RAG context hatası:', err)
    return ''
  }
}

/**
 * Mesaj içeriğini vektörleştirip MongoDB'ye kaydeder.
 * Hata durumunda sessizce başarısız olur (background task).
 */
export async function saveEmbedding(
  conversationId: string,
  messageId: string,
  content: string,
): Promise<void> {
  try {
    await connectDB()

    const vector = await embedText(content)
    if (!vector) return // Ollama mevcut değil

    await Embedding.create({
      conversationId: new mongoose.Types.ObjectId(conversationId),
      messageId: new mongoose.Types.ObjectId(messageId),
      content,
      vector,
    })
  } catch (err) {
    console.error('Embedding kayıt hatası:', err)
  }
}
