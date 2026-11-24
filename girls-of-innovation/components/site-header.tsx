'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const nav = [
  { href: '#about', label: 'About' },
  { href: '#barriers', label: 'Break the barriers' },
  { href: '#what-we-do', label: 'What we do' },
  { href: '#impact', label: 'Impact' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
] as const

export function SiteHeader() {
  const isHome = usePathname() === '/'
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isHome) return

    const observer = new IntersectionObserver(entries => {
      const section = entries.find(entry => entry.isIntersecting)
      if (section) setActive(section.target.id === 'hero' ? '' : '#' + section.target.id)
    }, { rootMargin: '-16% 0px -70% 0px' })

    for (const hash of ['#hero', ...nav.map(item => item.href)]) {
      const section = document.getElementById(hash.slice(1))
      if (section) observer.observe(section)
    }

    return () => observer.disconnect()
  }, [isHome])

  const hrefFor = (hash: string) => isHome ? hash : '/' + hash

  return (
    <header className="site-header" onKeyDown={event => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }}>
      <div className="site-shell header-inner">
        <Link href={hrefFor('#hero')} className="site-brand" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" width={36} height={36} alt="" />
          <span>Girls of Innovation</span>
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          {nav.map(item => (
            <Link
              key={item.href}
              href={hrefFor(item.href)}
              aria-current={isHome && active === item.href ? 'location' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          ref={menuButton}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(open => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen}>
        <ul className="site-shell">
          {nav.map(item => (
            <li key={item.href}>
              <Link href={hrefFor(item.href)} onClick={() => setMenuOpen(false)}>
                {item.label} <ArrowUpRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
