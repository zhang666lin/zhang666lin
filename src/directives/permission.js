import { usePermission } from '@/hooks/usePermission'

export function setupPermissionDirective(app) {
  app.directive('auth', {
    mounted(el, binding) {
      const { hasPermission } = usePermission()
      const value = binding.value
      if (!value) return
      if (!hasPermission(value)) {
        el.parentNode?.removeChild(el)
      }
    },
  })
}
