import { ArrowUpRight } from 'lucide-react'

const YEAR = 2026

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <p><strong>EAL Robotik</strong> <span>Eskişehir Anadolu Lisesi · {YEAR}</span></p>
        <ul aria-label="Siteyi geliştirenler">
          <li><a href="https://github.com/Luxotick" target="_blank" rel="noopener noreferrer" aria-label="Siteyi geliştiren Luxotick, GitHub">@Luxotick <ArrowUpRight aria-hidden="true" /></a></li>
          <li><a href="https://github.com/yamanist0" target="_blank" rel="noopener noreferrer" aria-label="Sitenin bakımını yapan Yamanist0, GitHub">@Yamanist0 <ArrowUpRight aria-hidden="true" /></a></li>
        </ul>
      </div>
    </footer>
  )
}
