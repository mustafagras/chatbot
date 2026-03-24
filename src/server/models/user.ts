import mongoose, { Schema, type Document, type Model } from 'mongoose'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  phone: string
  displayName: string
  avatarColor: string
  isBot: boolean
  isOnline: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    avatarColor: { type: String, default: '#FFE66D' },
    isBot: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
