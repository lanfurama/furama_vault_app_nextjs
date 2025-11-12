import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PageTransitionLoader from '@/components/PageTransitionLoader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Furama Studio',
  description: 'Unified digital workspace for Furama Resort with PMS, analytics, AI storytelling, and more add-ons.',
  keywords: 'furama studio, hospitality platform, pms, ai writer, analytics, resort management',
  authors: [{ name: 'Furama Studio' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: [
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <PageTransitionLoader />
        <div className="min-h-screen bg-secondary-50 dark:bg-charcoal-900" style={{ transition: 'background-color 150ms ease-in-out' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
