import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'EAL Robotik | FRC Team 8828',
  description: 'Eskişehir Anadolu Lisesi FRC Takımı 8828 - STEM, rekabetçi robotik ve toplumsal etki programı.',
  icons: { icon: '/favicon.ico'}
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteHeader />
          <main className="flex-1 container py-8">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
