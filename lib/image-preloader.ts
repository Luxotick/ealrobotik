import { timelinePhotos } from '@/data/timeline-photos'
import { sponsors } from '@/data/team'

const imageCache = new Set<HTMLImageElement>()
const loadedUrls = new Set<string>()

export function preloadSingleImage(src: string): Promise<void> {
  if (typeof window === 'undefined' || !src || loadedUrls.has(src)) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.src = src

    const finish = () => {
      loadedUrls.add(src)
      imageCache.add(img)
      resolve()
    }

    if (img.decode) {
      img.decode().then(finish).catch(finish)
    } else {
      img.onload = finish
      img.onerror = finish
    }
  })
}

export function getOrderedPreloadList(): string[] {
  const list: string[] = []
  const added = new Set<string>()

  const add = (url?: string) => {
    if (url && !added.has(url)) {
      added.add(url)
      list.push(url)
    }
  }

  // sponsor logolarini one alalim
  for (const group of sponsors) {
    for (const item of group.sponsors) {
      add(item.logo)
      add(item.logoLight)
    }
  }

  // yillari sirayla gezip siradaki fotograflari ekleyelim
  const years = Object.keys(timelinePhotos)
  const maxPhotos = Math.max(...years.map((y) => timelinePhotos[y]?.length || 0))

  for (let i = 0; i < maxPhotos; i++) {
    for (const year of years) {
      const photos = timelinePhotos[year]
      if (photos && i < photos.length) {
        add(photos[i])
      }
    }
  }

  return list
}

export function startSequentialPreload(): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const urls = getOrderedPreloadList()
  let isCancelled = false
  let currentIndex = 0
  const maxConcurrent = 3
  let activeCount = 0

  const loadNext = () => {
    if (isCancelled || currentIndex >= urls.length) return

    while (activeCount < maxConcurrent && currentIndex < urls.length) {
      const url = urls[currentIndex++]
      activeCount++
      preloadSingleImage(url).finally(() => {
        activeCount--
        if (!isCancelled) {
          loadNext()
        }
      })
    }
  }

  // tarayici bosa ciktiginda veya hemen baslatalim
  if ('requestIdleCallback' in window) {
    const idleId = (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(
      () => {
        loadNext()
      }
    )
    return () => {
      isCancelled = true
      if ('cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId)
      }
    }
  } else {
    const timeoutId = setTimeout(loadNext, 50)
    return () => {
      isCancelled = true
      clearTimeout(timeoutId)
    }
  }
}
