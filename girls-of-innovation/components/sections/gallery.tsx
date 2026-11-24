import { SectionHeading } from '@/components/ui/section-heading'
import { galleryPhotos } from '@/data/gallery'

const sizes = '(min-width: 1360px) 304px, (min-width: 880px) 23vw, 46vw'

export function Gallery() {
  return (
    <section id="gallery" className="editorial-section">
      <SectionHeading title="From the workshop" subtitle="Photos from our workshops, talks and events." />
      <ul className="photo-grid" aria-label="Girls of Innovation event photos">
        {galleryPhotos.map((photo, index) => (
          <li key={photo.src}>
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes={sizes}
              width={photo.width}
              height={photo.height}
              alt={'Girls of Innovation event photo ' + (index + 1)}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
