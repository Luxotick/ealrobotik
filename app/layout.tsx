import './globals.css'
import './site.css'
import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import { SiteBackground } from '@/components/site-background'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://ealrobotik.com'),
  title: {
    default: 'EAL Robotik | Eskişehir Anadolu Lisesi Robotik Kulübü',
    template: '%s | EAL Robotik'
  },
  description: 'EAL Robotik, MEB robot yarışmalarına katılan, TEKNOFEST ve STEM projeleri geliştiren Eskişehir Anadolu Lisesi öğrenci kulübüdür.',
  keywords: ['EAL Robotik', 'Eskişehir Anadolu Lisesi', 'MEB robot yarışması', 'TEKNOFEST', 'robotik kulübü', 'STEM', 'Eskişehir robotik'],
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
    title: 'EAL Robotik | Eskişehir Anadolu Lisesi Robotik Kulübü',
    description: 'MEB robot yarışmaları, TEKNOFEST, öğrenci projeleri ve STEM eğitimiyle EAL Robotik.',
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
    title: 'EAL Robotik | Eskişehir Anadolu Lisesi Robotik Kulübü',
    description: 'MEB robot yarışmaları, TEKNOFEST, öğrenci projeleri ve STEM eğitimiyle EAL Robotik.',
    images: ['/ealrobotik.png']
  },
  icons: { icon: '/favicon.ico', apple: '/favicon.ico' }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
  themeColor: '#020817'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
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
        <SiteBackground />
        <a className="site-skip-link" href="#icerik">İçeriğe geç</a>
        <SiteHeader />
        <main id="icerik" className="site-shell site-main" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
