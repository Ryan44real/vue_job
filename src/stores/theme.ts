import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(
    (localStorage.getItem('theme-mode') as ThemeMode) || 'system'
  )
  const isDark = ref(false)

  function applyTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = mode.value === 'system' ? prefersDark : mode.value === 'dark'
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }

  function setMode(newMode: ThemeMode) {
    mode.value = newMode
    localStorage.setItem('theme-mode', newMode)
    applyTheme()
  }

  function toggle() {
    setMode(isDark.value ? 'light' : 'dark')
  }

  if (mode.value === 'system') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)
  }

  applyTheme()

  return { mode, isDark, setMode, toggle, applyTheme }
}, {
  persist: true
})
