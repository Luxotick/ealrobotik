import { SectionHeading } from '@/components/ui/section-heading'
import { pillars } from '@/data/girls'

export function WhatWeDo() {
  return (
    <section id="what-we-do" className="editorial-section">
      <SectionHeading title="What we do" subtitle="Workshops, role models and community events for girls interested in STEM." />
      <ul className="program-list">
        {pillars.map(({ title, text }) => (
          <li key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
