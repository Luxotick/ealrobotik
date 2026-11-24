'use client'

import { useEffect, useRef } from 'react'
import { createBackgroundRenderer } from '@/lib/site-background-shader'

const frameInterval = 1000 / 30

export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let renderer: ReturnType<typeof createBackgroundRenderer> = null
    let frame = 0
    let lastDraw = 0
    let elapsed = 0

    function animate(now: number) {
      const delta = now - lastDraw
      if (delta >= frameInterval - 1) {
        elapsed += delta / 1000
        lastDraw = now
        renderer?.draw(elapsed)
      }
      frame = requestAnimationFrame(animate)
    }

    function updatePlayback() {
      cancelAnimationFrame(frame)
      if (renderer && !reducedMotion.matches && !document.hidden) {
        lastDraw = performance.now()
        frame = requestAnimationFrame(animate)
      }
    }

    function resize() {
      renderer?.resize()
      renderer?.draw(elapsed)
    }

    function updatePalette() {
      renderer?.setPalette(getComputedStyle(root))
      renderer?.draw(elapsed)
    }

    const initialize = () => {
      renderer = createBackgroundRenderer(canvas)
      if (renderer) {
        renderer.resize()
        updatePalette()
      }
      updatePlayback()
    }

    function onContextLost(event: Event) {
      event.preventDefault()
      renderer = null
      updatePlayback()
    }

    const sizeObserver = new ResizeObserver(resize)
    const themeObserver = new MutationObserver(updatePalette)
    sizeObserver.observe(canvas)
    themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', initialize)
    reducedMotion.addEventListener('change', updatePlayback)
    document.addEventListener('visibilitychange', updatePlayback)
    initialize()

    return () => {
      cancelAnimationFrame(frame)
      renderer?.dispose()
      sizeObserver.disconnect()
      themeObserver.disconnect()
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', initialize)
      reducedMotion.removeEventListener('change', updatePlayback)
      document.removeEventListener('visibilitychange', updatePlayback)
    }
  }, [])

  return (
    <div aria-hidden="true" className="site-background">
      <canvas ref={canvasRef} />
    </div>
  )
}
