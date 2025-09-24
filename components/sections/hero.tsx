"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Kuruluş', value: '2021' },
  { label: 'Play-off Görünümü', value: '3' },
  { label: 'FRC Takım', value: '8828' }
]

export function Hero() {
  return (
    <section className="relative text-center space-y-10 py-8 md:py-14">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-primary/15 via-primary/0 to-accent/10 rounded-full blur-3xl" />
      </div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
      >
        <span className="gradient-text">EAL Robotik</span>{' '}
        <span className="text-muted-foreground">FRC 8828</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="text-muted-foreground max-w-2xl mx-auto text-lg"
      >
        Eskişehir Anadolu Lisesi'nin rekabetçi robotik ve toplumsal etki odaklı gençlik STEM programı.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="flex gap-4 justify-center"
      >
        <Button asChild size="lg">
          <Link href="#hakkinda">Takımı Tanıyın</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="#performans">Performans</Link>
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        {stats.map(s => (
          <div key={s.label} className="px-4 py-2 rounded-full glass text-sm flex items-center gap-2">
            <span className="font-semibold">{s.value}</span>
            <span className="text-muted-foreground text-xs uppercase tracking-wide">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
