'use client'
import { useEffect } from 'react'

// Ayrı client bileşeni: SSR çıktısını etkilemeden yalnızca tarayıcı konsoluna imza basar.
export function DevSignature() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('%cEAL Robotik 8828','color:#6366F1;font-size:16px;font-weight:bold;')
  }, [])
  return null
}
