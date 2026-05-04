import { ref, onMounted, onUnmounted } from 'vue'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export function useResponsive() {
  const breakpoint = ref<Breakpoint>('desktop')
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(true)

  let cleanup: (() => void) | null = null

  function update() {
    const width = window.innerWidth
    if (width < 768) {
      breakpoint.value = 'mobile'
    } else if (width < 1024) {
      breakpoint.value = 'tablet'
    } else {
      breakpoint.value = 'desktop'
    }
    isMobile.value = breakpoint.value === 'mobile'
    isTablet.value = breakpoint.value === 'tablet'
    isDesktop.value = breakpoint.value === 'desktop'
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
    cleanup = () => window.removeEventListener('resize', update)
  })

  onUnmounted(() => {
    cleanup?.()
  })

  return { breakpoint, isMobile, isTablet, isDesktop }
}
