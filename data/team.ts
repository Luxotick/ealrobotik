export const vision = `Bilim ve teknolojiyle topluma fayda sağlayan projeler üretmek; mekanik, elektronik ve yazılım alanlarında birlikte öğrenen, öğrendiklerini paylaşan bir topluluk olmaktır.`

import eskisehirLogo from '@/assets/eskisehir.webp'
import mezunlarLogo from '@/assets/mezunlar.webp'
import evrenayLogo from '@/assets/evrenay.webp'
import tgdLogo from '@/assets/tgd makine.webp'
import solidworksLogo from '@/assets/solidworks.webp'
import ikizlerLogo from '@/assets/ikizler.webp'
import fikretyukselLogo from '@/assets/fikretyuksel.webp'
import boeingLogo from '@/assets/boeing.webp'
import baranisikLogo from '@/assets/baranisik.webp'
import ealLogo from '@/assets/eal.webp'
import korelLogo from '@/assets/korel.webp'
import m3Logo from '@/assets/3m.webp'

export const mission = `Öğrencilere robotik ve STEM alanlarında uygulamalı deneyim kazandırmak, yarışmalar ve projelerle takım çalışmasını geliştirmek, edindiğimiz bilgileri yeni kuşaklarla paylaşmaktır.`

export interface Sponsor {
  name: string
  logo?: string
  logoClass?: string
}

export interface SponsorGroup {
  group: string
  sponsors: Sponsor[]
}

export const sponsors: SponsorGroup[] = [
  {
    group: 'Kurumlar',
    sponsors: [
      { name: 'Eskişehir İl Milli Eğitim Müdürlüğü', logo: eskisehirLogo.src },
      { name: 'Eskişehir Anadolu Lisesi', logo: ealLogo.src },
      { name: 'Fikret Yüksel Vakfı', logo: fikretyukselLogo.src }
    ]
  },
  {
    group: 'Mezun & Dernek',
    sponsors: [
      { name: 'Eskişehir Anadolu Lisesi Mezunlar Derneği', logo: mezunlarLogo.src },
      { name: 'EAL 98 Mezunları', logo: mezunlarLogo.src }
    ]
  },
  {
    group: 'Özel Sektör',
    sponsors: [
      { name: 'Evrenay İnşaat', logo: evrenayLogo.src },
      { name: 'TGD Konveyör Sistemleri & Üretim Hatları', logo: tgdLogo.src },
      { name: 'KOREL Elektronik', logo: korelLogo.src, logoClass: 'sponsor-white' },
      { name: 'SolidWorks Corp.', logo: solidworksLogo.src },
      { name: 'İkizler Mantı ve Börek', logo: ikizlerLogo.src },
      { name: 'Boeing Corp.', logo: boeingLogo.src },
      { name: 'Baran Işık', logo: baranisikLogo.src },
      { name: '3M Company', logo: m3Logo.src }
    ]
  }
]

export interface Source { title: string; url: string }
export const sources: Source[] = [
  { title: 'MEB Robot Yarışması', url: 'https://robot.meb.gov.tr/organizasyon/yarisma-hakkinda' },
  { title: 'TEKNOFEST Yarışmaları', url: 'https://www.teknofest.org/tr/competitions/' },
  { title: 'TÜBİTAK 4006 Bilim Fuarları', url: 'https://tubitak.gov.tr/tr/destekler/bilim-toplum/ulusal-destek-programlari/4006-tubitak-bilim-fuarlari-destekleme-programi' }
]

export interface TrainingLink { title: string; url: string; category: 'software' | 'mechanical' | 'document' }

export const trainingLinks: TrainingLink[] = [
  { title: 'Python Full Course', url: 'https://www.youtube.com/watch?v=K5KVEU3aaeQ', category: 'software' },
  { title: '1 Saatte Python (Türkçe)', url: 'https://www.youtube.com/watch?v=_wZUNiGtkcw', category: 'software' },
  { title: 'Arduino Dokümantasyonu', url: 'https://docs.arduino.cc/', category: 'software' },
  { title: 'Python Dokümantasyonu', url: 'https://docs.python.org/3/', category: 'software' },
  { title: 'GitHub', url: 'https://github.com/', category: 'software' },
  { title: 'GitHub Student Pack', url: 'https://education.github.com/pack', category: 'software' },
  { title: 'Fusion 360', url: 'https://www.autodesk.com/', category: 'mechanical' },
  { title: 'Fusion 360 Education Pack', url: 'https://www.autodesk.com/education/edu-software/overview', category: 'mechanical' },
  { title: 'Fusion 360 Kurulum & Eğitim Videosu', url: 'https://www.youtube.com/watch?v=ufBiBPoZJuI', category: 'mechanical' },
  { title: 'Fusion Eğitimleri Playlist', url: 'https://www.youtube.com/playlist?list=PL2hEqvQGoz6tvtmszZASqKR_OjwL1hdL_', category: 'mechanical' },
  { title: 'İleri Teknik Fusion Eğitimleri', url: 'https://www.youtube.com/playlist?list=PL0fZjEQc8oaMEkOGcNvueT8lAZvcoKuie', category: 'mechanical' },
  { title: 'MEB Robot Yarışması', url: 'https://robot.meb.gov.tr/organizasyon/yarisma-hakkinda', category: 'document' },
  { title: 'TEKNOFEST Yarışmaları', url: 'https://www.teknofest.org/tr/competitions/', category: 'document' }
]
