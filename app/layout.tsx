import './globals.css'
import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import { SiteChrome } from '@/components/site-chrome'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  metadataBase: new URL('https://ealrobotik.com'),
  title: {
    default: 'EAL Robotik | FRC Team 8828',
    template: '%s | EAL Robotik'
  },
  description: 'Eskişehir Anadolu Lisesi FRC Takımı 8828. STEM, rekabetçi robotik, toplumsal etki ve genç mühendislik topluluğu. FIRST Robotics Competition takımı.',
  keywords: ['FRC', 'FRC 8828', 'EAL Robotik', 'FIRST Robotics Competition', 'Eskişehir Anadolu Lisesi', 'robotik takımı', 'STEM', 'robotik', 'Eskişehir robotik'],
  applicationName: 'EAL Robotik',
  authors: [{ name: 'EAL Robotik', url: 'https://ealrobotik.com' }],
  creator: 'EAL Robotik',
  publisher: 'EAL Robotik',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: 'EAL Robotik',
    title: 'EAL Robotik | FRC Team 8828',
    description: 'Eskişehir Anadolu Lisesi FRC Takımı 8828. STEM, rekabetçi robotik ve toplumsal etki.',
    images: [
      {
        url: '/ealrobotik.png',
        width: 308,
        height: 306,
        alt: 'EAL Robotik logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EAL Robotik | FRC Team 8828',
    description: 'Eskişehir Anadolu Lisesi FRC Takımı 8828. STEM, rekabetçi robotik ve toplumsal etki.',
    images: ['/ealrobotik.png']
  },
  icons: { icon: '/favicon.ico', apple: '/favicon.ico' }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'EAL Robotik',
                  url: 'https://ealrobotik.com',
                  logo: 'https://ealrobotik.com/ealrobotik.png',
                  sameAs: ['https://www.instagram.com/ealrobotik_8828']
                },
                {
                  '@type': 'WebSite',
                  name: 'EAL Robotik',
                  url: 'https://ealrobotik.com'
                }
              ]
            })
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteChrome>
            <main className="flex-1 container py-8">{children}</main>
          </SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  )
}
