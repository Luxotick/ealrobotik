import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="technical-label">404</p>
      <h1>Page not found</h1>
      <p>The page may have moved or been removed.</p>
      <Link href="/" className="site-button primary-button">
        Back to Girls of Innovation <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  )
}
