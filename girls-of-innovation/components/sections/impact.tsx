import { SectionHeading } from '@/components/ui/section-heading'
import { girlsShare, impactNotes } from '@/data/girls'

export function Impact() {
  return (
    <section id="impact" className="editorial-section">
      <SectionHeading title="Our impact" subtitle="What has changed in our team and what we want to pass on." />
      <div className="impact-layout">
        <p className="impact-stat"><strong>{girlsShare}</strong> <span>of our robotics team are girls</span></p>
        <ul className="impact-list">
          {impactNotes.map(note => <li key={note}>{note}</li>)}
        </ul>
      </div>
    </section>
  )
}
