import { sponsors } from '@/data/team'

const flatSponsors = sponsors.flatMap(group => group.sponsors)

export function SponsorStrip() {
  return (
    <section className="sponsor-strip" aria-labelledby="sponsors-title">
      <h2 id="sponsors-title">Sponsorlar</h2>
      <ul className="sponsor-logos">
        {flatSponsors.map(sponsor => (
          <li key={sponsor.name}>
            {sponsor.logo ? (
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                loading="lazy"
                decoding="async"
                className={sponsor.logoClass}
              />
            ) : sponsor.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
