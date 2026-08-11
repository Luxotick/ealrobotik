const YEAR = 2026

export function SiteFooter() {
  return (
    <footer className="border-t mt-16 py-8 text-sm text-muted-foreground">
      <div className="container flex flex-col md:flex-row gap-4 items-center justify-between">
        <p>EAL Robotik 8828 • Eskişehir Anadolu Lisesi • {YEAR}</p>
        <p className="text-xs text-center">
          <a href="https://github.com/Luxotick" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">Made with ❤️ by @Luxotick on GitHub</a>
          <br />
          <a href="https://github.com/yamanist0" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">Maintained with ❤️ by @Yamanist0 on GitHub</a>
        </p>
      </div>
    </footer>
  )
}
