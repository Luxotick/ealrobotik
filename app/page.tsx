import { Hero } from '@/components/sections/hero'
import { Highlights } from '@/components/sections/highlights'
import { Timeline } from '@/components/sections/timeline'
import { SponsorMarquee } from '@/components/sections/sponsor-marquee'
import { Wave } from '@/components/ui/wave'
import { mission, vision, performances, sponsors, sources, trainingLinks, type SeasonPerformance, type SponsorGroup, type Sponsor, type TrainingLink, type Source } from '@/data/team'
import { DevSignature } from '@/components/signature'

export default function HomePage() {
  return (
    <div className="space-y-28">
      <div className="space-y-8 md:space-y-10">
        <div id="hero"><Hero /></div>
        <section className="space-y-4 md:-mx-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground text-center fade-in-up" style={{ animationDelay: '0.4s' }}>Sponsorlar</h3>
          <SponsorMarquee />
        </section>
      </div>
      <section id="hakkinda" className="space-y-12 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Hakkında</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">Seçkin akademik zemin, program felsefesi ve toplumsal etki odağı ile sürdürülebilir bir FRC modeli. Takım aynı zamanda Teknofest gibi ulusal teknoloji yarışmalarında da deneyim kazanmış ve çeşitli başarılar elde etmiştir.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="space-y-3 md:col-span-1">
            <h3 className="text-lg font-semibold">Vizyonumuz</h3>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{vision}</p>
          </div>
            <div className="space-y-3 md:col-span-1">
            <h3 className="text-lg font-semibold">Misyonumuz</h3>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{mission}</p>
          </div>
          <div className="space-y-3 md:col-span-1">
            <h3 className="text-lg font-semibold">Felsefe</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">Akademik seçiciliğin sunduğu yetenek yoğunluğu + toplumsal etki odaklı uzun vadeli program vizyonu ile sürdürülebilir başarı modeli.</p>
            <Highlights />
          </div>
        </div>
      </section>
      <section id="performans" className="space-y-8 scroll-mt-24">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Performans</h2>
          <p className="text-muted-foreground text-sm">Sezonlar arası gelişimi gösteren konsolide tablo.</p>
        </div>
  <div className="relative overflow-hidden rounded-lg border glass-panel mx-auto max-w-5xl">
          <div className="relative z-10 overflow-x-auto">
            <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="p-2">Sezon</th>
                <th className="p-2">Oyun</th>
                <th className="p-2">Sıralama</th>
                <th className="p-2">Kayıt</th>
                <th className="p-2">Play-off</th>
                <th className="p-2">Seçim</th>
                <th className="p-2">Not</th>
              </tr>
            </thead>
            <tbody>
              {performances.map((p: SeasonPerformance) => (
                <tr key={p.season} className="border-t">
                  <td className="p-2 font-medium">{p.season}</td>
                  <td className="p-2">{p.game}</td>
                  <td className="p-2">{p.ranking ? `${p.ranking.rank}/${p.ranking.total}` : '—'}</td>
                  <td className="p-2">{p.record ? `${p.record.wins}-${p.record.losses}${p.record.ties ? '-' + p.record.ties : ''}` : '—'}</td>
                  <td className="p-2">{p.playoff}</td>
                  <td className="p-2">{p.alliancePick || '—'}</td>
                  <td className="p-2 text-xs text-muted-foreground max-w-xs">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-14 md:h-20 bg-gradient-to-t from-background/85 via-background/35 to-transparent backdrop-blur-[3px] z-[5]" />
          <Wave />
        </div>
        <div className="max-w-5xl mx-auto space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Zaman Çizelgesi</h3>
          <Timeline />
        </div>
      </section>
      <section id="ekosistem" className="space-y-8 scroll-mt-24 max-w-5xl mx-auto">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Ekosistem & Destek</h2>
          <p className="text-sm text-muted-foreground">Çeşitlendirilmiş kamu, özel sektör ve mezun ağı.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {sponsors.map((group: SponsorGroup) => (
            <div key={group.group} className="relative overflow-hidden rounded-lg border p-4 glass-panel">
              <h4 className="font-semibold mb-2 text-xs tracking-wide uppercase text-muted-foreground">{group.group}</h4>
              <ul className="space-y-1 text-sm relative z-10">
                {group.sponsors.map((s: Sponsor) => (
                  <li key={s.name}>{s.name}</li>
                ))}
              </ul>
              <Wave />
            </div>
          ))}
        </div>
      </section>
      <section id="kaynaklar" className="space-y-6 scroll-mt-24 max-w-5xl mx-auto">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Kaynaklar</h2>
          <p className="text-sm text-muted-foreground">Teknik öğrenmeyi destekleyen temel araç seti.</p>
        </div>

        <div className="hidden md:block relative w-full h-10 my-2" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -ml-[1px] w-[2px] h-3 bg-highlight/70" />
          
          <div 
            className="absolute top-3 h-[2px] bg-highlight/70"
            style={{
              left: 'calc(100% / 6 - 0.6667rem)',
              right: 'calc(100% / 6 - 0.6667rem)'
            }}
          />

          <div 
            className="absolute top-3 w-[2px] h-7 bg-highlight/70 -ml-[1px]"
            style={{ left: 'calc(100% / 6 - 0.6667rem)' }}
          />

          <div className="absolute top-3 left-1/2 -ml-[1px] w-[2px] h-7 bg-highlight/70" />

          <div 
            className="absolute top-3 w-[2px] h-7 bg-highlight/70 -ml-[1px]"
            style={{ left: 'calc(100% * 5 / 6 + 0.6667rem)' }}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-2 text-center">
            <h3 className="font-medium text-highlight">Yazılım</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>WPILib</li>
              <li>GitHub</li>
              <li>ChiefDelphi Forum</li>
            </ul>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="font-medium text-highlight">Mekanik</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Fusion 360</li>
            </ul>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="font-medium text-highlight">Eğitim</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>FRC Java Eğitim Videoları</li>
              <li>Fusion 360 Eğitim Videoları</li>
            </ul>
          </div>
        </div>
        <div className="text-xs text-muted-foreground flex flex-wrap gap-3">
          {sources.map((src: Source) => (
            <a key={src.url} href={src.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{src.title}</a>
          ))}
        </div>
      </section>
      <section id="egitimler" className="space-y-6 scroll-mt-24 max-w-6xl mx-auto">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Eğitimler</h2>
          <p className="text-sm text-muted-foreground">Programımız öğrenme kültürünü sistematik kaynaklarla destekler: Yazılım ve mekanik alanlarında küratörlü linkler.</p>
        </div>

        <div className="hidden md:block relative w-full h-10 my-2" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -ml-[1px] w-[2px] h-3 bg-highlight/70" />
          
          <div 
            className="absolute top-3 h-[2px] bg-highlight/70"
            style={{
              left: 'calc(100% / 6 - 0.6667rem)',
              right: 'calc(100% / 6 - 0.6667rem)'
            }}
          />

          <div 
            className="absolute top-3 w-[2px] h-7 bg-highlight/70 -ml-[1px]"
            style={{ left: 'calc(100% / 6 - 0.6667rem)' }}
          />

          <div className="absolute top-3 left-1/2 -ml-[1px] w-[2px] h-7 bg-highlight/70" />

          <div 
            className="absolute top-3 w-[2px] h-7 bg-highlight/70 -ml-[1px]"
            style={{ left: 'calc(100% * 5 / 6 + 0.6667rem)' }}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-3 text-center">
            <h3 className="font-medium text-highlight">Yazılım Eğitimleri</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {trainingLinks.filter((l: TrainingLink) => l.category==='software').map((l: TrainingLink) => (
                <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{l.title}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 text-center">
            <h3 className="font-medium text-highlight">Mekanik Eğitimleri</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {trainingLinks.filter((l: TrainingLink) => l.category==='mechanical').map((l: TrainingLink) => (
                <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{l.title}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 text-center">
            <h3 className="font-medium text-highlight">Dokümanlar</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {trainingLinks.filter((l: TrainingLink) => l.category==='document').map((l: TrainingLink) => (
                <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{l.title}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section id="sosyal" className="space-y-8 scroll-mt-24 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Sosyal Sorumluluk</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">Waves of Innovation girişimimiz, genç nesilleri okyanusları ve su ekosistemlerini koruma konusunda bilinçlendirmeyi, STEM ve çevresel sorumluluk kavramlarını birleştiren etkinlik ve içerikler üretmeyi amaçlıyor.</p>
        </div>
  <div className="relative overflow-hidden rounded-xl border p-6 glass-panel space-y-4">
          <h3 className="font-semibold text-lg text-highlight relative z-10">Waves of Innovation</h3>
          <p className="text-sm text-muted-foreground relative z-10">"Empowering future generations to protect our oceans, one wave at a time." Yaklaşımıyla çevresel duyarlılığı teknik problem çözme ile buluşturan bir sosyal etki programı.</p>
          <div className="relative z-10">
            <a href="https://waves.ealrobotik.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">Proje Sitesini Ziyaret Et</a>
          </div>
          <Wave />
        </div>
      </section>
      <section id="iletisim" className="space-y-6 scroll-mt-24 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">İletişim</h2>
          <p className="text-sm text-muted-foreground">Destek ve iş birliği için bize ulaşın.</p>
        <ul className="space-y-2 text-sm">
          <li><strong className="text-highlight">E-posta:</strong> <a className="text-primary hover:underline" href="mailto:info@ealrobotik.com">info@ealrobotik.com</a></li>
          <li><strong className="text-highlight">Okul:</strong> Eskişehir Anadolu Lisesi</li>
          <li><strong className="text-highlight">FRC Takım:</strong> 8828</li>
        </ul>
      </section>
      <DevSignature />
    </div>
  )
}
