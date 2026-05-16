import mongoose, { Schema, type Document, type Model } from 'mongoose'

export interface IOtp extends Document {
  _id: mongoose.Types.ObjectId
  phone: string
  otpHash: string
  attempts: number
  expiresAt: Date
  createdAt: Date
}

const OtpSchema = new Schema<IOtp>(
  {
    phone: { type: String, required: true, index: true },
    otpHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
)

const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema)

export default Otp
