import { useMediaQuery } from '@mui/material'
import { useEffect } from 'react'

import { useThemeStore } from '../stores/theme-store'

export function useThemeMode() {
  const { mode, effectiveMode, setMode, setEffectiveMode } = useThemeStore()

  // Detecta preferência do sistema
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  // Atualiza o modo efetivo quando o modo ou preferência do sistema mudam
  useEffect(() => {
    if (mode === 'system') {
      setEffectiveMode(prefersDarkMode ? 'dark' : 'light')
    } else {
      setEffectiveMode(mode)
    }
  }, [mode, prefersDarkMode, setEffectiveMode])

  return {
    mode,
    setMode,
    effectiveMode,
  }
}
