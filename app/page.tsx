import { ArrowRight, ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react'
import { Hero } from '@/components/sections/hero'
import { SponsorStrip } from '@/components/sections/sponsor-strip'
import { Timeline } from '@/components/sections/timeline'
import { DevSignature } from '@/components/signature'
import { Wave } from '@/components/ui/wave'
import { competitionHighlights, projects } from '@/data/activities'
import { mission, sources, sponsors, trainingLinks, vision, type TrainingLink } from '@/data/team'

const trainingGroups: { category: TrainingLink['category']; title: string }[] = [
  { category: 'software', title: 'Yazılım eğitimleri' },
  { category: 'mechanical', title: 'Mekanik eğitimleri' },
  { category: 'document', title: 'Dokümanlar' },
]

const resourceGroups = [
  { title: 'Yazılım', items: ['Arduino', 'GitHub', 'Python'] },
  { title: 'Mekanik', items: ['Fusion 360'] },
  { title: 'Eğitim', items: ['Yazılım eğitimleri', 'Fusion 360 eğitim videoları'] },
]

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <header className="section-intro">
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <SponsorStrip />

      <section id="hakkinda" className="site-section">
        <SectionIntro
          title="Kulüp hakkında"
          description="2019’dan beri Eskişehir Anadolu Lisesi’nde robotik ve teknoloji projeleri geliştiriyoruz. Deneyimlerimizi MEB robot yarışmaları, TEKNOFEST, bilim fuarları ve eğitimlerle paylaşıyoruz."
        />
        <div className="division-grid">
          <div>
            <h3>Vizyonumuz</h3>
            <p>{vision}</p>
          </div>
          <div>
            <h3>Misyonumuz</h3>
            <p>{mission}</p>
          </div>
          <div>
            <h3>Öğren - Öğret</h3>
            <p>Deneyimli üyelerimiz öğrendiklerini yeni arkadaşlarına aktarır. Tasarımdan yazılıma, yarışma hazırlıklarını birlikte üstleniriz.</p>
          </div>
        </div>
      </section>

      <section id="performans" className="site-section">
        <SectionIntro
          title="Yarışmalar ve çalışmalar"
          description="Mekanik, elektronik ve yazılımı atölyede bir araya getiriyor, geliştirdiğimiz robotları yarışma sahasında deniyoruz."
        />
        <article className="event-feature">
          <div className="event-copy">
            <p className="technical-label accent-text">Güncel odağımız</p>
            <h3>MEB robot yarışmaları</h3>
            <p>2026’da 18. Uluslararası MEB Robot Yarışması’nda yer aldık. Mekanik, elektronik ve yazılım çalışmalarımızı yarışma deneyimiyle bir araya getiriyoruz.</p>
            <a className="site-text-link" href="https://robot.meb.gov.tr/organizasyon/yarisma-hakkinda" target="_blank" rel="noopener noreferrer">
              MEB Robot Yarışması hakkında <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <figure className="event-figure">
            <img src="/meb/meb-2026.jpg" alt="EAL Robotik ekibi 18. Uluslararası MEB Robot Yarışması’nda" width={896} height={1195} loading="lazy" />
            <figcaption className="technical-label">18. Uluslararası MEB Robot Yarışması, 2026</figcaption>
          </figure>
        </article>

        <div className="section-row">
          <h3>TEKNOFEST yolculuğumuz</h3>
          <div>
            <p>İnsanlık yararına teknolojilerden insansız hava araçlarına uzanan projeler geliştirdik. RoboLig için de bir robot tasarımı hazırladık.</p>
            <a className="site-text-link" href="#projeler">Projelerimizi incele <ArrowRight aria-hidden="true" /></a>
          </div>
        </div>

        <div className="competition-results">
          <h3 id="results-title">TEKNOFEST dereceleri</h3>
          <div className="results-table" role="region" aria-labelledby="results-title" tabIndex={0}>
            <table aria-labelledby="results-title">
              <thead>
                <tr>
                  <th scope="col">Yıl</th>
                  <th scope="col">Takım</th>
                  <th scope="col">Yarışma</th>
                  <th scope="col">Sonuç</th>
                </tr>
              </thead>
              <tbody>
                {competitionHighlights.map(({ year, team, event, result }) => (
                  <tr key={`${year}-${team}`}>
                    <td className="technical-label">{year}</td>
                    <td>{team}</td>
                    <td>{event}</td>
                    <td>{result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-row">
          <h3>Yarışmanın ötesinde</h3>
          <p>TÜBİTAK bilim fuarları için projeler üretiyor, Öğren - Öğret eğitimleriyle deneyimlerimizi paylaşıyoruz. Üyelerimiz Gençtek etkinlikleri ve zirvesi ile Codeavour International’da da yer aldı.</p>
        </div>

        <div className="timeline-section">
          <h3>Zaman çizelgesi</h3>
          <Timeline />
        </div>
      </section>

      <section id="projeler" className="site-section">
        <SectionIntro
          title="Proje arşivi"
          description="Kulübün yarışma projeleri, araştırmaları ve henüz taslak aşamasındaki tasarım fikirleri."
        />
        <ul className="project-list">
          {projects.map(project => (
            <li key={project.name}>
              <article>
                <p className="technical-label accent-text">{project.category}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section id="ekosistem" className="site-section">
        <SectionIntro title="Ekosistem ve destek" description="Çalışmalarımızı destekleyen kurumlar, mezunlar ve şirketler." />
        <div className="division-grid support-grid">
          {sponsors.map(group => (
            <div key={group.group}>
              <h3>{group.group}</h3>
              <ul>{group.sponsors.map(sponsor => <li key={sponsor.name}>{sponsor.name}</li>)}</ul>
              <Wave />
            </div>
          ))}
        </div>
      </section>

      <section id="kaynaklar" className="site-section">
        <SectionIntro title="Kaynaklar" description="Atölyede kullandığımız araçlar ve takip ettiğimiz yarışma programları." />
        <div className="division-grid">
          {resourceGroups.map(({ title, items }) => (
            <div key={title}>
              <h3>{title}</h3>
              <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
        <ul className="source-links" aria-label="Yarışma ve bilim fuarı kaynakları">
          {sources.map(({ title, url }) => (
            <li key={url}>
              <a className="site-text-link" href={url} target="_blank" rel="noopener noreferrer">{title} <ArrowUpRight aria-hidden="true" /></a>
            </li>
          ))}
        </ul>
      </section>

      <section id="egitimler" className="site-section">
        <SectionIntro title="Eğitimler" description="Yazılım, mekanik tasarım ve yarışma hazırlıkları için kulübün derlediği eğitimler ve dokümanlar." />
        <div className="division-grid training-grid">
          {trainingGroups.map(({ category, title }) => (
            <div key={category}>
              <h3>{title}</h3>
              <ul>
                {trainingLinks.filter(link => link.category === category).map(({ title, url }) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer">{title} <ArrowUpRight aria-hidden="true" /></a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="sosyal" className="site-section">
        <SectionIntro title="Sosyal sorumluluk" description="Bilim ve teknolojiyi çevre bilinci ve STEM eğitimine erişimle buluşturan iki girişimimiz." />
        <div className="initiative-grid">
          <article>
            <h3>Waves of Innovation</h3>
            <p>STEM etkinlikleri ve içerikleriyle gençlerde okyanusları ve su ekosistemlerini koruma bilinci geliştirmeyi amaçlıyoruz.</p>
            <a className="site-text-link" href="https://waves.ealrobotik.com/" target="_blank" rel="noopener noreferrer">
              Waves sitesine git <ArrowUpRight aria-hidden="true" />
            </a>
            <Wave />
          </article>
          <article>
            <h3>Girls of Innovation</h3>
            <p>Teknik eğitim ve mentorlukla kız öğrencilerin STEM alanlarındaki önyargıları ve engelleri aşmasını destekliyoruz.</p>
            <a className="site-text-link" href="https://girls.ealrobotik.com/" target="_blank" rel="noopener noreferrer">
              Girls sitesine git <ArrowUpRight aria-hidden="true" />
            </a>
            <Wave backColor="#9d174d" frontColor="#f9a8d4" />
          </article>
        </div>
      </section>

      <section id="iletisim" className="site-section contact-section">
        <div>
          <h2>İletişim</h2>
          <p>Destek ve iş birliği için bize ulaşın.</p>
        </div>
        <ul className="contact-links">
          <li>
            <a href="mailto:info@ealrobotik.com">
              <Mail aria-hidden="true" /> <span>info@ealrobotik.com</span> <ArrowUpRight aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/ealrobotik_8828?igsh=cTI0cGMxZWpydGc1" target="_blank" rel="noopener noreferrer">
              <Instagram aria-hidden="true" /> <span>@ealrobotik_8828</span> <ArrowUpRight aria-hidden="true" />
            </a>
          </li>
          <li><p><MapPin aria-hidden="true" /> <span>Eskişehir Anadolu Lisesi</span></p></li>
        </ul>
      </section>

      <DevSignature />
    </>
  )
}
