'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const nav = [
  { href: '#hero', label: 'Ana sayfa' },
  { href: '#hakkinda', label: 'Hakkında' },
  { href: '#performans', label: 'Yarışmalar' },
  { href: '#projeler', label: 'Projeler' },
  { href: '#ekosistem', label: 'Destek' },
  { href: '#kaynaklar', label: 'Kaynaklar' },
  { href: '#egitimler', label: 'Eğitimler' },
  { href: '#sosyal', label: 'Sosyal sorumluluk' },
  { href: '#iletisim', label: 'İletişim' },
] as const

type SectionHash = (typeof nav)[number]['href']

export function SiteHeader() {
  const isHome = usePathname() === '/'
  const [active, setActive] = useState<SectionHash>('#hero')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isHome) return

    const observer = new IntersectionObserver(entries => {
      const section = entries.find(entry => entry.isIntersecting)
      if (section) setActive(`#${section.target.id}` as SectionHash)
    }, { rootMargin: '-20% 0px -65% 0px' })

    for (const item of nav) {
      const section = document.getElementById(item.href.slice(1))
      if (section) observer.observe(section)
    }

    return () => observer.disconnect()
  }, [isHome])

  const hrefFor = (hash: SectionHash) => isHome ? hash : `/${hash}`
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header" onKeyDown={event => {
      if (event.key === 'Escape' && menuOpen) {
        closeMenu()
        menuButton.current?.focus()
      }
    }}>
      <div className="site-shell header-inner">
        <Link href={hrefFor('#hero')} onClick={closeMenu} className="site-brand" aria-label="EAL Robotik ana sayfa">
          <img src="/ealrobotik.png" width={36} height={36} alt="" />
          <span>EAL Robotik</span>
        </Link>

        <nav className="header-nav" aria-label="Ana menü">
          {nav.slice(1, -1).map(item => (
            <Link key={item.href} href={hrefFor(item.href)} aria-current={isHome && active === item.href ? 'location' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href={hrefFor('#iletisim')} className="site-button site-button-secondary header-contact" aria-current={isHome && active === '#iletisim' ? 'location' : undefined}>
            İletişim <ArrowUpRight aria-hidden="true" />
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="site-icon-button header-menu-toggle"
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(open => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobil menü" hidden={!menuOpen}>
        <ul className="site-shell">
          {nav.map(item => (
            <li key={item.href}>
              <Link href={hrefFor(item.href)} onClick={closeMenu} aria-current={isHome && active === item.href ? 'location' : undefined}>
                {item.label}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
