"use client"

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/ai') return <>{children}</>
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  )
}
