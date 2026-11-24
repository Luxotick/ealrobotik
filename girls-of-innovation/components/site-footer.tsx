import { ArrowUpRight } from 'lucide-react'
import { contact } from '@/data/girls'

const YEAR = 2026

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <p><strong>Girls of Innovation</strong> <span>{contact.school} · {YEAR}</span></p>
        <a className="text-link" href={contact.mainSite} target="_blank" rel="noopener noreferrer">
          An EAL Robotik initiative <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
