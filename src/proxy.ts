import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/giris',
  },
})

export const config = {
  matcher: ['/((?!giris|api|_next/static|_next/image|favicon.ico).*)'],
}
