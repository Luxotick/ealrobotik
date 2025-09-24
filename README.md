# EAL Robotik 8828 Website

Modern Next.js 14 + TypeScript + Tailwind tabanlı tek sayfalık (anchor navigasyon) tanıtım ve kaynak portalı.

## Özellikler
- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS + dark mode (next-themes)
- Shadcn benzeri UI bileşen yaklaşımı (Button, Theme Toggle, vb.)
- Framer Motion ile animasyonlu hero, timeline, stat rozetleri
- Scroll spy (IntersectionObserver) ile aktif menü vurgulama
- Tek sayfa anchor navigasyon (SSR + progressive enhancement)
- Cam / blur (glassmorphism) paneller ve gradient arka plan
- Sponsor marquee animasyonu
- Eğitim linkleri (yazılım / mekanik / doküman) ve kaynak listesi
- Dış link güvenlik öznitelikleri (rel="noopener noreferrer")
- Kullanılmayan bağımlılıkların temizlenmesi (recharts & eski route sayfaları kaldırıldı)

## Bölümler
1. Hero
2. Hakkında (Vizyon / Misyon / Felsefe + Highlights)
3. Performans (Sezon tablosu + Timeline + Sponsor Marquee)
4. Ekosistem & Destek (Sponsor grupları)
5. Kaynaklar (Özet + link listesi)
6. Eğitimler (Kategorize linkler)
7. Sosyal Sorumluluk (Waves of Innovation)
8. İletişim

## Kurulum ve Geliştirme
```bash
npm install      # veya pnpm install / yarn
npm run dev
```
Tarayıcı: http://localhost:3000

Prod build:
```bash
npm run build
npm start
```

## Proje Yapısı
```
app/
	layout.tsx
	page.tsx              # Tek sayfa içerik
components/
	site-header.tsx       # Navigasyon + scroll spy
	sections/             # Hero, timeline, marquee, vb.
	ui/                   # Button, yardımcı bileşenler
data/
	team.ts               # Tüm içerik/veri modelleri
lib/
	utils.ts              # cn helper
tailwind.config.ts
tsconfig.json           # Path alias: @/components, @/data, @/lib
```

## Tip Güvenliği
- `data/team.ts` içinde interface'ler: SeasonPerformance, SponsorGroup, TrainingLink, Source
- Map / filter callback'lerinde explicit tipler
- Hash state için template literal tipi (`#${string}`)

## Stil
- `globals.css` içinde cam efekt: `.glass` ve `.glass-panel`
- Gradient metin: `.gradient-text`
- Tailwind + CSS değişken temelli renk sistemi

## Geliştirme Notları
- Kullanılmayan grafik bileşeni, eski route sayfaları ve `recharts` + `critters` bağımlılığı kaldırıldı
- Dış linkler güvenli: `rel="noopener noreferrer"`
- Performans tablosu manuel veri modeli ile yönetiliyor

## Gelecek İyileştirmeler (Öneri)
- SEO metadata ve JSON-LD
- Lighthouse optimizasyon turu
- Timeline verisini data dosyasına taşıma
- İletişim formu (Server Action)
- Unit test / erişilebilirlik denetimi

## İçerik Güncelleme
Metin, performans, sponsor ve link güncellemeleri için `data/team.ts` düzenleyin. Bölüm eklemek isterseniz `app/page.tsx` içinde yeni bir `<section id="...">` bloğu ekleyin ve header nav listesine anchor ekleyin.

## Lisans
Kod örnek kullanım için serbest (MIT benzeri). İçerik telif hakları EAL Robotik takımına aittir. FIRST markaları ilgili sahiplerine aittir.
