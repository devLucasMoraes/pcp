import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  effectiveMode: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  setEffectiveMode: (mode: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      effectiveMode: 'light',
      setMode: (mode) => set({ mode }),
      setEffectiveMode: (effectiveMode) => set({ effectiveMode }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
