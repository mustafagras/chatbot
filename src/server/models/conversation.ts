import mongoose, { Schema, type Document, type Model } from 'mongoose'

export interface ILastMessage {
  content: string
  senderId: mongoose.Types.ObjectId
  createdAt: Date
}

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId
  participants: mongoose.Types.ObjectId[]
  lastMessage: ILastMessage | null
  unreadCounts: Map<string, number>
  createdAt: Date
  updatedAt: Date
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: {
      type: {
        content: { type: String, required: true },
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, required: true },
      },
      default: null,
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  { timestamps: true },
)

const Conversation: Model<IConversation> =
  mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema)

export default Conversation
