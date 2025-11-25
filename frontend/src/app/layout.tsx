import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trivesta - Crypto Presale & Investment Platform',
  description: 'Join thousands of investors in our secure crypto presale platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

