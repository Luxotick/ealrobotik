import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'AI Yardımı',
  description: 'EAL Robotik AI asistanı ile sohbet edin.',
  alternates: { canonical: '/ai' },
  openGraph: { url: '/ai' }
}

export default function AiLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}