const YEAR = 2025 // Sabitlenmiş yıl – hydration farklılığı riskini azaltır.

export function SiteFooter() {
  return (
    <footer className="border-t mt-16 py-8 text-sm text-muted-foreground">
      <div className="container flex flex-col md:flex-row gap-4 items-center justify-between">
        <p>EAL Robotik 8828 • Eskişehir Anadolu Lisesi • {YEAR}</p>
        <p className="text-xs">Bu site Next.js, Tailwind CSS ve shadcn/ui ile oluşturulmuştur.</p>
      </div>
    </footer>
  )
}
