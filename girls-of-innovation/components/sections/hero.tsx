import { ArrowDown, ArrowRight } from 'lucide-react'
import { heroStats } from '@/data/girls'
import workshop from '../../assets/girls/_DSF1413.webp'

export function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-intro">
        <div>
          <p className="technical-label hero-kicker">A project by EAL Robotik 8828</p>
          <h1 id="hero-title">Girls of <span>Innovation</span></h1>
        </div>
        <div className="hero-summary">
          <p>We help girls get hands-on with STEM through workshops, mentorship and leadership on our robotics team.</p>
          <div className="hero-actions">
            <a className="site-button primary-button" href="#barriers">Break a barrier <ArrowDown aria-hidden="true" /></a>
            <a className="site-button secondary-button" href="#about">Our story <ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
      </div>

      <figure className="hero-figure">
        <img
          src={workshop.src}
          width={workshop.width}
          height={workshop.height}
          alt="Four workshop participants showing the projects they made in the EAL Robotik lab"
          fetchPriority="high"
        />
        <figcaption>
          <span>In the workshop</span>
          <span className="technical-label">Eskişehir, Türkiye</span>
        </figcaption>
      </figure>

      <dl className="hero-facts">
        {heroStats.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
