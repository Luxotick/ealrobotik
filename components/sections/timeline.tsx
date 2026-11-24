const milestones = [
  { year: '2019', title: 'Kulübün kuruluşu', description: 'Eskişehir Anadolu Lisesi Robotik Kulübü kuruldu; ilk yılında eğitimlere ve atölye altyapısına odaklandı.' },
  { year: '2020', title: 'TEKNOFEST ile ilk başarı', description: 'VITECH, İnsanlık Yararına Teknolojiler Yarışması’nda Türkiye 13.sü oldu.' },
  { year: '2021', title: 'Yeni takımlar, yeni alanlar', description: 'VITECH ve EAL.ino, İnsanlık Yararına Teknolojiler’de sırasıyla Türkiye 18.si ve 21.si oldu. Gökdoğan, Liseler Arası İHA Yarışması’nda finale kaldı.', image: '/timeline/2021/649590704_18083905697460203_2252134629097400636_n.webp' },
  { year: '2022', title: 'Gökdoğan ilk onda', description: 'Gökdoğan, TEKNOFEST Liseler Arası İHA Yarışması’nda Türkiye 10.su oldu.' },
  { year: '2023', title: 'İHA Performans Ödülü', description: 'Gökdoğan, TEKNOFEST Liseler Arası İHA Yarışması’nda Performans Ödülü aldı. İnsanlık yararına teknoloji projeleri için de raporlar hazırlandı.' },
  { year: '2024', title: 'Fikirden proje raporuna', description: 'Gökdoğan için yangın gözlem ve müdahale tasarımı; Akıllı Saksı, BebekDuyu ve Güvenli Nefes için proje açıklamaları hazırlandı.' },
  { year: '2025', title: 'Yeni fikirler ve bilim fuarları', description: 'SmartPark, SafePlug, EcoWarm, AutoScale ve deniz taşıtı için ön değerlendirme taslakları hazırlandı. Üyelerimiz TÜBİTAK 4006 projelerinde ve Gençtek etkinliklerinde yer aldı.' },
  { year: '2026', title: 'MEB robot yarışmaları', description: '18. Uluslararası MEB Robot Yarışması’na katıldık. TEKNOFEST RoboLig için de bir mobil robot tasarım çalışması hazırladık.' }
]

export function Timeline() {
  return (
    <div className="timeline">
      <ol>
        {milestones.map((milestone) => (
          <li key={milestone.year}>
            <time dateTime={milestone.year} className="technical-label"><span className="registration-mark" aria-hidden="true" />{milestone.year}</time>
            <div>
              <h4>{milestone.title}</h4>
              <p>{milestone.description}</p>
              {milestone.image && (
                <img src={milestone.image} alt="2021 yılında TEKNOFEST’te EAL Robotik ekibi" loading="lazy" />
              )}
            </div>
          </li>
        ))}
      </ol>
      <aside className="timeline-aside">
        <div>
          <p className="technical-label accent-text">2022–2026 arşiv notu</p>
          <h4>FRC yolculuğumuz</h4>
          <p>8828 numaralı takımımız 2022, 2023, 2025 ve 2026 sezonlarında FIRST Robotics Competition’a katıldı. 2022 İzmir Regional’da Quality Award kazandı.</p>
        </div>
        <img src="/timeline/2022/8828 (1).webp" alt="EAL Robotik 2022 İzmir Regional takım fotoğrafı" loading="lazy" />
      </aside>
    </div>
  )
}
