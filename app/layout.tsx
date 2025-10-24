import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Furama Vault - Guest Management System',
  description: 'Professional guest management system for Furama Resort with advanced analytics and reporting',
  keywords: 'guest management, hotel management, resort, analytics, reporting',
  authors: [{ name: 'Furama Resort' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
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
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-300">
          {children}
        </div>
      </body>
    </html>
  )
}
