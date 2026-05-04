import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const themeStore = useThemeStore()
  return {
    isDark: themeStore.isDark,
    mode: themeStore.mode,
    toggle: themeStore.toggle,
    setMode: themeStore.setMode,
  }
}
