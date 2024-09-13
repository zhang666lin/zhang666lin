import tippy from 'tippy.js'
export function setupTooltipDirective(app) {
  let tippyInstance = null
  app.directive('tooltip', {
    mounted(el, binding) {
      if (!binding.value) return
      tippyInstance = tippy(el, {
        content: el.innerText,
        placement: 'top',
        arrow: false,
        ...binding.value,
      })
    },
    updated(el, binding) {
      if (!binding.value) return
      if (tippyInstance) {
        tippyInstance.setContent(binding.value?.content ?? el.innerText)
      } else {
        tippyInstance = tippy(el, {
          content: el.innerText,
          placement: 'top',
          arrow: false,
          ...binding.value,
        })
      }
    },
  })
}
