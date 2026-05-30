import { onUnmounted } from 'vue'

export interface UseResizeOptions {
  getWidth: () => number
  setWidth: (width: number) => void
  min?: number
  max?: number
}

export function useResize(options: UseResizeOptions) {
  const min = options.min ?? 200
  const max = options.max ?? 400
  let dragging = false
  let startWidth = 0
  let startClientX = 0

  function onMouseDown(event: MouseEvent) {
    event.preventDefault()
    dragging = true
    startWidth = options.getWidth()
    startClientX = event.clientX
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging) return
    const newWidth = startWidth + (event.clientX - startClientX)
    const clamped = Math.min(max, Math.max(min, newWidth))
    options.setWidth(clamped)
  }

  function onMouseUp() {
    dragging = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  function cleanup() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  onUnmounted(cleanup)

  return { onMouseDown }
}
