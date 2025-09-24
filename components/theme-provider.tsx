'use client'
import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

// next-themes paketindeki tipler derin import ile hataya sebep oluyorsa basit bir yerel tip tanımı yeterli.
// Paket runtime API'sini minimal kullanıyoruz: attribute, defaultTheme, enableSystem, children.
interface SimpleThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  themes?: string[]
}

export function ThemeProvider({ children, ...props }: SimpleThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
