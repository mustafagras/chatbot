import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectDB from '@/lib/mongodb'
import User from '@/server/models/user'

const AVATAR_COLORS = ['#FFE66D', '#FF6B9D', '#4ECDC4', '#A8E6CF', '#FF8A5C', '#C3A6FF']

function randomColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Telefon',
      credentials: {
        phone: { label: 'Telefon Numarası', type: 'tel' },
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null

        const phone = credentials.phone.replace(/\s+/g, '')
        if (phone.length < 10) return null

        await connectDB()

        let user = await User.findOne({ phone })

        if (!user) {
          // Demo mod: otomatik kayıt
          const displayName = `Kullanıcı ${phone.slice(-4)}`
          user = await User.create({
            phone,
            displayName,
            avatarColor: randomColor(),
            isBot: false,
            isOnline: true,
          })
        }

        return {
          id: user._id.toString(),
          phone: user.phone,
          name: user.displayName,
          avatarColor: user.avatarColor,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.phone = (user as { phone?: string }).phone || ''
        token.avatarColor = (user as { avatarColor?: string }).avatarColor || ''
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) || ''
        session.user.phone = (token.phone as string) || ''
        session.user.avatarColor = (token.avatarColor as string) || ''
      }
      return session
    },
  },
  pages: {
    signIn: '/giris',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
