import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Footer from '@/components/layout/Footer'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: "JJ's Blog",
  description: 'Notes and thoughts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 flex flex-col min-h-screen`}>
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
