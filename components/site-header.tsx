"use client"
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { useEffect, useState } from 'react'

interface NavItem {
  href: `#${string}`
  label: string
}

// Tek sayfa içi anchor navigasyon yapısı.
const nav: readonly NavItem[] = [
  { href: '#hero', label: 'Ana Sayfa' },
  { href: '#hakkinda', label: 'Hakkında' },
  { href: '#performans', label: 'Performans' },
  { href: '#ekosistem', label: 'Ekosistem & Destek' },
  { href: '#kaynaklar', label: 'Kaynaklar' },
  { href: '#egitimler', label: 'Eğitimler' },
  { href: '#sosyal', label: 'Sosyal Sorumluluk' },
  { href: '#iletisim', label: 'İletişim' }
] as const

export function SiteHeader() {
  const [active, setActive] = useState<`#${string}`>('#hero')

  useEffect(() => {
  const sectionIds = nav.map(n => n.href.replace('#',''))
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(('#' + entry.target.id) as `#${string}`)
          }
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    sections.forEach(sec => observer.observe(sec))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container h-16 flex items-center justify-between">
        <Link href="#hero" className="font-bold tracking-tight text-lg">EAL Robotik 8828</Link>
        <nav className="hidden md:flex gap-6 text-sm">
          {nav.map(item => {
            const isActive = active === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
