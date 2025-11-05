'use client'

import { SupabaseProvider } from './lib/SupabaseProvider'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        <SupabaseProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
       </SupabaseProvider>
      </body>
    </html>
  )
}
