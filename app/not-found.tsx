import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wave } from '@/components/ui/wave'

export default function NotFound() {
  return (
    <div className="relative overflow-hidden rounded-xl border glass-panel mx-auto max-w-xl text-center space-y-6 px-6 py-16">
      <p className="text-[6rem] leading-none font-bold tracking-tight gradient-text">404</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Sayfa Bulunamadı</h1>
        <p className="text-sm text-muted-foreground">Aradığın sayfa kaybolmuş ya da hiç var olmamış olabilir. Rotaya geri dön.</p>
      </div>
      <div className="relative z-10">
        <Button asChild size="lg">
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-14 md:h-16 bg-gradient-to-t from-background/85 via-background/35 to-transparent backdrop-blur-[3px] z-[5]" />
      <Wave />
    </div>
  )
}
