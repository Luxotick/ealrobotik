import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ealrobotik.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: 'https://ealrobotik.com/ai',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    }
  ]
}