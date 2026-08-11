"use client"
import { motion } from 'framer-motion'

const milestones = [
  { year: 2021, title: 'Kuruluş', desc: '23 öğrenci ve 3 mentor ile takım kuruldu.' },
  { year: 2022, title: 'İlk Sezon', desc: 'Çaylak yılda play-off çeyrek final başarısı.' },
  { year: 2023, title: 'Güvenilirlik', desc: 'Orta üst sıralama ve destek rol optimizasyonu.' },
  { year: 2025, title: 'Stratejik Seçim', desc: 'Daha düşük sıralamaya rağmen erken ittifak seçimi.' },
  { year: 2026, title: 'Kilit Oyuncu', desc: "21. sıradan 5. ittifakın ilk tercihi olarak play-off'a geçiş." }
]

export function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-2 md:left-1/2 md:-ml-px top-0 bottom-0 w-px bg-gradient-to-b from-highlight/60 via-border to-highlight/40" />
      <ul className="space-y-8 md:space-y-12">
        {milestones.map((m, i) => {
          const left = i % 2 === 0
          return (
            <motion.li
              key={m.year}
              initial={{ opacity: 0, x: left ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative md:grid md:grid-cols-2"
            >
              <div className="absolute left-2 md:left-1/2 md:-ml-2 mt-1 w-4 h-4 rounded-full bg-gradient-to-tr from-primary to-highlight shadow ring-2 ring-background" />
              <div className={`pl-8 md:pl-0 ${left ? 'md:col-start-1 md:pr-12 md:text-right' : 'md:col-start-2 md:pl-12'}`}>
                <div className="text-sm text-highlight font-medium">{m.year}</div>
                <h3 className="font-semibold leading-tight">{m.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-prose md:ml-auto">{m.desc}</p>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}