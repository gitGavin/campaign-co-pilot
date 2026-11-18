import React from "react"
import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _manrope = Manrope({ subsets: ["latin"] });
const _inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Campaign Co-Pilot - AI-Powered Campaign Orchestration',
  description: 'Transform your marketing campaigns with AI-powered strategy, audience targeting, and creative generation',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
