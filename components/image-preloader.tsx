"use client"
import { useEffect } from 'react'
import { startSequentialPreload } from '@/lib/image-preloader'

export function ImagePreloader() {
  useEffect(() => {
    // site acilinca gorselleri sirayla onceden cekelim
    const cleanup = startSequentialPreload()
    return () => {
      cleanup()
    }
  }, [])

  return null
}
