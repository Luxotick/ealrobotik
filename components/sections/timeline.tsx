"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { timelinePhotos } from '@/data/timeline-photos'

const milestones = [
  { year: 2021, title: 'Kuruluş', desc: '23 öğrenci ve 3 mentor ile takım kuruldu.' },
  { year: 2022, title: 'İlk Sezon', desc: 'Çaylak yılda play-off çeyrek final başarısı.' },
  { year: 2023, title: 'Güvenilirlik', desc: 'Orta üst sıralama ve destek rol optimizasyonu.' },
  { year: 2025, title: 'Stratejik Seçim', desc: 'Daha düşük sıralamaya rağmen erken ittifak seçimi.' },
  { year: 2026, title: 'Kilit Oyuncu', desc: "21. sıradan 5. ittifakın ilk tercihi olarak play-off'a geçiş." }
]

function YearPhotos({ year, photos, itemIndex }: { year: number; photos: string[]; itemIndex: number }) {
  const [idx, setIdx] = useState(0)
  const count = photos.length

  useEffect(() => {
    if (count <= 1) return

    let interval: NodeJS.Timeout
    const delay = itemIndex * 300
    const timeout = setTimeout(() => {
      setIdx((prev) => (prev + 1) % count)
      interval = setInterval(() => {
        setIdx((prev) => (prev + 1) % count)
      }, 2000)
    }, 2000 + delay)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [count, itemIndex])

  if (!count) {
    return (
      <div className="aspect-[4/3] rounded-xl border border-dashed border-muted-foreground/40 bg-muted/10" />
    )
  }
  return (
    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-muted/20">
      <AnimatePresence>
        <motion.img
          key={photos[idx]}
          src={photos[idx]}
          alt={`${year} fotoğraf ${idx + 1}`}
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </AnimatePresence>
    </div>
  )
}

export function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-2 md:left-1/2 md:-ml-px top-0 bottom-0 w-px bg-gradient-to-b from-highlight/60 via-border to-highlight/40" />
      <ul className="space-y-8 md:space-y-10 md:pt-32">
        {milestones.map((m, i) => {
          const left = i % 2 === 0
          const textSide = left ? 'md:row-start-1 md:col-start-1 md:pr-12 md:text-right' : 'md:row-start-1 md:col-start-2 md:pl-12'
          const photoSide = left ? 'md:row-start-1 md:col-start-2 md:pl-12' : 'md:row-start-1 md:col-start-1 md:pr-12'
          const photos = timelinePhotos[String(m.year)] ?? []
          return (
            <motion.li
              key={m.year}
              initial={{ opacity: 0, x: left ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative md:grid md:grid-cols-2"
            >
              <div className="absolute left-2 md:left-1/2 md:-ml-2 top-1.5 md:top-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-primary to-highlight shadow ring-2 ring-background" />
              <div className={`pl-8 md:pl-0 ${textSide} md:flex md:flex-col`}>
                <div className="hidden md:block flex-1" />
                <div className="text-sm text-highlight font-medium">{m.year}</div>
                <div className="flex-1 md:pt-2">
                  <h3 className="font-semibold leading-tight">{m.title}</h3>
                  <p className={`text-sm text-muted-foreground mt-1 max-w-prose ${left ? 'md:ml-auto' : ''}`}>{m.desc}</p>
                </div>
              </div>
              <div className={`mt-6 pl-8 md:pl-0 md:mt-0 ${photoSide} md:flex md:flex-col md:justify-center`}>
                <YearPhotos year={m.year} photos={photos} itemIndex={i} />
              </div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}