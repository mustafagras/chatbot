import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      phone: string
      avatarColor: string
    }
  }

  interface User {
    id: string
    phone: string
    name: string
    avatarColor: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    phone: string
    avatarColor: string
  }
}
