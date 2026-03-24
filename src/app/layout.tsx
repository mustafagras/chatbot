import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import AuthSessionProvider from '@/components/providers/session-provider'
import ToastProvider from '@/components/providers/toast-provider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sohbet — Gerçek Zamanlı Mesajlaşma',
  description: 'Gerçek zamanlı sohbet uygulaması. Hemen giriş yapın ve mesajlaşmaya başlayın.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='tr'>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <AuthSessionProvider>
          {children}
          <ToastProvider />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
