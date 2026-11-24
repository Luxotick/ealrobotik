import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Wave } from '@/components/ui/wave'

export default function NotFound() {
  return (
    <div className="missing-page">
      <p className="technical-label accent-text">404</p>
      <h1>Sayfa bulunamadı</h1>
      <p>Aradığınız sayfa taşınmış veya kaldırılmış olabilir.</p>
      <Link className="site-button site-button-primary" href="/">Ana sayfaya dön <ArrowRight aria-hidden="true" /></Link>
      <Wave />
    </div>
  )
}
