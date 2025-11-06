import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PageTransitionLoader from '@/components/PageTransitionLoader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Furama Vault - Management System',
  description: 'Comprehensive management system for Furama Resort with guest management, analytics, reporting, and more',
  keywords: 'management system, guest management, hotel management, resort, analytics, reporting, dashboard',
  authors: [{ name: 'Furama Resort' }],
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PageTransitionLoader />
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900" style={{ transition: 'background-color 150ms ease-in-out' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
