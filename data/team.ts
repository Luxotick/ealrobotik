export const vision = `FRC aracılığı ile yarışmalara katılarak teknoloji alanında lider projelere katkıda bulunmak, takımca mekanik ve programlama alanlarında ilerleme kaydederek kendimizi geleceğe hazırlamaktır.`

export const mission = `Teknolojinin hayatımızın her alanına girdiği şu günlerde teknolojik gelişmelere katkı sağlayacak gençleri destekleyen bir yarışın parçası olmak, şehrimizi ve ülkemizi en iyi şekilde temsil etmektir. Hem takım hem de bireysel anlamda edindiğimiz bilgi ve tecrübeleri ülkemizin geleceği olan çocuklara aktarmak, onlara rol model olmaktır.`

export interface SeasonPerformance {
  season: number
  game: string
  ranking?: { rank: number; total: number }
  record?: { wins: number; losses: number; ties?: number }
  playoff?: string
  alliancePick?: string
  notes?: string
}

export const performances: SeasonPerformance[] = [
  {
    season: 2022,
    game: 'RAPID REACT',
    playoff: 'Çeyrek Finalist',
    notes: 'Çaylak sezon – play-off başarısı hızlı başlangıcı gösterir.'
  },
  {
    season: 2023,
    game: 'CHARGED UP',
    ranking: { rank: 16, total: 50 },
    record: { wins: 5, losses: 2, ties: 1 },
    playoff: '6. İttifak Üyesi',
    alliancePick: '3. tur seçimi',
    notes: 'Güvenilir destek robotu profili.'
  },
  {
    season: 2025,
    game: 'REEFSCAPE',
    ranking: { rank: 22, total: 35 },
    record: { wins: 5, losses: 6 },
    playoff: 'Çeyrek Finalist',
    alliancePick: '2. tur seçimi (7. ittifak)',
    notes: 'Stratejik niş değeri yüksek, erken tur seçimi.'
  }
]

export interface SponsorGroup {
  group: string
  sponsors: string[]
}

export const sponsors: SponsorGroup[] = [
  { group: 'Kurumlar', sponsors: ['Eskişehir İl Milli Eğitim Müdürlüğü', 'Eskişehir Anadolu Lisesi'] },
  { group: 'Mezun & Dernek', sponsors: ['Eskişehir Anadolu Lisesi Mezunlar Derneği', 'EAL 98 Mezunları'] },
  { group: 'Özel Sektör', sponsors: ['Evrenay İnşaat', 'Crede Danışmanlık & Veri Hizmetleri', 'TGD Konveyör Sistemleri & Üretim Hatları', 'Selka Prefabrik', 'KOREL Elektronik'] }
]

export interface Source { title: string; url: string }
export const sources: Source[] = [
  { title: 'Resmi Site', url: 'https://ealrobotik.com/' },
  { title: 'FRC 2023', url: 'https://frc-events.firstinspires.org/2023/team/8828' },
  { title: 'FRC 2025', url: 'https://frc-events.firstinspires.org/2025/team/8828' },
  { title: 'The Blue Alliance', url: 'https://www.thebluealliance.com/team/8828' }
]

export interface TrainingLink { title: string; url: string; category: 'software' | 'mechanical' | 'document' }

export const trainingLinks: TrainingLink[] = [
  // Software
  { title: 'WPILib Docs', url: 'https://docs.wpilib.org/en/stable/', category: 'software' },
  { title: 'WPILib VSCode Installer (Windows)', url: 'https://packages.wpilib.workers.dev/installer/v2024.3.2/Win64/WPILib_Windows-2024.3.2.iso', category: 'software' },
  { title: 'GitHub', url: 'https://github.com/', category: 'software' },
  { title: 'GitHub Student Pack', url: 'https://education.github.com/pack', category: 'software' },
  { title: 'ChiefDelphi Forum', url: 'https://www.chiefdelphi.com/', category: 'software' },
  { title: 'FRC Java Programming Tutorial Playlist', url: 'https://www.youtube.com/watch?v=PdgXk6D311k&list=PLC3-At2hTK9hVPv623YealxDAHim6FdJQ', category: 'software' },
  // Mechanical
  { title: 'Fusion 360', url: 'https://www.autodesk.com/', category: 'mechanical' },
  { title: 'Fusion 360 Education Pack', url: 'https://www.autodesk.com/education/edu-software/overview', category: 'mechanical' },
  { title: 'Fusion 360 Kurulum & Eğitim Videosu', url: 'https://www.youtube.com/watch?v=ufBiBPoZJuI', category: 'mechanical' },
  { title: 'Fusion Eğitimleri Playlist', url: 'https://www.youtube.com/playlist?list=PL2hEqvQGoz6tvtmszZASqKR_OjwL1hdL_', category: 'mechanical' },
  { title: 'İleri Teknik Fusion Eğitimleri', url: 'https://www.youtube.com/playlist?list=PL0fZjEQc8oaMEkOGcNvueT8lAZvcoKuie', category: 'mechanical' },
  { title: 'ChiefDelphi (Mekanik Referans)', url: 'https://www.chiefdelphi.com/', category: 'mechanical' },
  // Documents
  { title: 'Roboting - A Guide for New Teams (PDF)', url: 'https://ealrobotik.com/sources/Roboting-A-Guide-for-New-Teams.pdf', category: 'document' }
]
