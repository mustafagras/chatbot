import mongoose, { Schema, type Document, type Model } from 'mongoose'

export interface IEmbedding extends Document {
  _id: mongoose.Types.ObjectId
  conversationId: mongoose.Types.ObjectId
  messageId: mongoose.Types.ObjectId
  content: string
  vector: number[]
  createdAt: Date
}

const EmbeddingSchema = new Schema<IEmbedding>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
    content: { type: String, required: true },
    // nomic-embed-text: 768 dim, llama3.2 ile fallback için esnek bırakıldı
    vector: { type: [Number], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

// Vektör araması için index
EmbeddingSchema.index({ conversationId: 1 })

const Embedding: Model<IEmbedding> =
  mongoose.models.Embedding || mongoose.model<IEmbedding>('Embedding', EmbeddingSchema)

export default Embedding
