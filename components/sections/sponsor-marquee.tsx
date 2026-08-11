"use client"
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { sponsors } from '@/data/team'

const flatSponsors = sponsors.flatMap(g => g.sponsors)

export function SponsorMarquee() {
  const [paused, setPaused] = useState(false)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pauseFor = () => {
    setPaused(true)
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => setPaused(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.6, ease: 'easeOut' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => pauseFor()}
      onTouchCancel={() => setPaused(false)}
      onClick={() => pauseFor()}
      className="relative overflow-hidden rounded-lg border bg-card select-none"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      <ul className="flex gap-10 py-5 animate-slide marquee will-change-transform" style={{ animationPlayState: paused ? 'paused' : 'running' }}>
        {flatSponsors.concat(flatSponsors).map((s, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors select-none">
            {s.logo && (s.logoLight ? (
            <>
              <img src={s.logo} alt="" aria-hidden draggable={false} className={`h-6 w-auto object-contain select-none theme-dark-only ${s.logoClass ?? ''}`} />
              <img src={s.logoLight} alt={s.name} draggable={false} className={`h-6 w-auto object-contain select-none theme-light-only ${s.logoClass ?? ''}`} />
            </>
          ) : (
            <img src={s.logo} alt={s.name} draggable={false} className={`h-6 w-auto object-contain select-none ${s.logoClass ?? ''}`} />
          ))}
            <span>{s.name}</span>
          </li>
        ))}
      </ul>
      <style jsx>{`
        @keyframes slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee { width: max-content; }
        .animate-slide { animation: slide 25s linear infinite; }
      `}</style>
    </motion.div>
  )
}