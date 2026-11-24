'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { barriers } from '@/data/girls'

export function BarrierBreaker() {
  const [broken, setBroken] = useState<number[]>([])
  const complete = broken.length === barriers.length

  return (
    <section id="barriers" className="editorial-section">
      <SectionHeading
        title="Break the barriers"
        subtitle="Choose a stereotype to see how our team challenges it."
      />

      <div className="barrier-workbench">
        <div className="barrier-progress">
          <p role="status" className="technical-label">
            <span>{broken.length} / {barriers.length} barriers broken</span>
            {complete && <span>All barriers broken</span>}
          </p>
          <progress aria-label="Barriers broken" value={broken.length} max={barriers.length} />
        </div>

        <ul className="barrier-grid">
          {barriers.map((barrier, index) => {
            const isBroken = broken.includes(index)
            const panelId = 'barrier-answer-' + index

            return (
              <li key={barrier.label} className={isBroken ? 'barrier is-broken' : 'barrier'}>
                <button
                  type="button"
                  aria-expanded={isBroken}
                  aria-controls={panelId}
                  aria-disabled={isBroken || undefined}
                  onClick={() => setBroken(current => current.includes(index) ? current : [...current, index])}
                >
                  <span>“{barrier.label}”</span>
                  <span className="barrier-mark">{isBroken ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</span>
                </button>
                <div id={panelId} className="barrier-answer" hidden={!isBroken}>
                  <h3>{barrier.stat}</h3>
                  <p>{barrier.reveal}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
