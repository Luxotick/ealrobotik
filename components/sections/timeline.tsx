"use client"
import { motion } from 'framer-motion'

const milestones = [
  { year: 2021, title: 'Kuruluş', desc: '23 öğrenci ve 3 mentor ile takım kuruldu.' },
  { year: 2022, title: 'İlk Sezon', desc: 'Çaylak yılda play-off çeyrek final başarısı.' },
  { year: 2023, title: 'Güvenilirlik', desc: 'Orta üst sıralama ve destek rol optimizasyonu.' },
  { year: 2025, title: 'Stratejik Seçim', desc: 'Daha düşük sıralamaya rağmen erken ittifak seçimi.' }
]

export function Timeline() {
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border to-accent/40" />
      <ul className="space-y-8">
        {milestones.map((m, i) => (
          <motion.li
            key={m.year}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -left-[34px] mt-1 w-4 h-4 rounded-full bg-gradient-to-tr from-primary to-accent shadow ring-2 ring-background" />
            <div className="text-sm text-muted-foreground">{m.year}</div>
            <h3 className="font-semibold leading-tight">{m.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-prose">{m.desc}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
