import { ArrowDown, ArrowUpRight } from 'lucide-react'

const stats = [
  { label: 'Kuruluş', value: '2019' },
  { label: 'Robot yarışmaları', value: 'MEB' },
  { label: 'İHA Performans Ödülü', value: '2023' },
]

export function Hero() {
  return (
    <section id="hero" className="site-hero" aria-labelledby="hero-title">
      <div className="hero-main">
        <div className="hero-copy">
          <p className="hero-school technical-label">Eskişehir Anadolu Lisesi</p>
          <h1 id="hero-title" className="hero-title">EAL <span>Robotik</span></h1>
          <p className="hero-intro">
            Birlikte robot tasarlayan, öğrendiklerini paylaşan ve MEB robot yarışmalarına katılan bir öğrenci kulübüyüz.
          </p>
          <div className="hero-actions">
            <a className="site-button site-button-primary" href="#performans">Yarışmalarımız <ArrowDown aria-hidden="true" /></a>
            <a className="site-button site-button-secondary" href="#projeler">Projelerimiz <ArrowUpRight aria-hidden="true" /></a>
          </div>
        </div>

        <figure className="hero-figure">
          <div className="hero-photo">
            <img
              src="/timeline/2025/_DSF5367.webp"
              alt="EAL Robotik öğrencileri yarışma tribününde 8828 takım numarasını taşıyor"
              width={3120}
              height={1760}
              fetchPriority="high"
            />
          </div>
          <figcaption className="hero-caption technical-label">
            <span><span className="registration-mark" aria-hidden="true" /> Takım 8828</span>
            <span>FRC arşivi / 2025</span>
          </figcaption>
        </figure>
      </div>

      <dl className="hero-stats">
        {stats.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
