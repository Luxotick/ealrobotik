import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/stat-card'

const items = [
  { title: 'Kuruluş', value: '2021', desc: '23 öğrenci, 3 mentor ile başlangıç' },
  { title: 'Play-off Görünümü', value: '3', desc: '2022, 2023, 2025 çeyrek finaller' },
  { title: 'Felsefe', value: 'Eğitim + Etki', desc: 'İkili misyon yaklaşımı' }
]

export function Highlights() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {items.map(it => (
        <Card key={it.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{it.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight">{it.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{it.desc}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
