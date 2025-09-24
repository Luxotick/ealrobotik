"use client"
import { sponsors } from '@/data/team'

const flatSponsors = sponsors.flatMap(g => g.sponsors)

export function SponsorMarquee() {
  return (
    <div className="relative overflow-hidden group rounded-lg border bg-card">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      <ul className="flex gap-10 py-5 animate-slide marquee will-change-transform">
        {flatSponsors.concat(flatSponsors).map((s, i) => (
          <li key={i} className="text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors">
            {s}
          </li>
        ))}
      </ul>
      <style jsx>{`
        @keyframes slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee { width: max-content; }
        .animate-slide { animation: slide 25s linear infinite; }
        .group:hover .animate-slide { animation-play-state: paused; }
      `}</style>
    </div>
  )
}
