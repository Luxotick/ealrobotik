import { SectionHeading } from '@/components/ui/section-heading'
import { aboutParagraphs, equalitySteps } from '@/data/girls'

export function About() {
  return (
    <section id="about" className="editorial-section">
      <SectionHeading title="Inside our team" subtitle="How we share responsibilities and make room for more girls to lead." />
      <div className="about-layout">
        <div className="about-story">
          {aboutParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <ul className="practice-list">
          {equalitySteps.map(({ title, text }) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
