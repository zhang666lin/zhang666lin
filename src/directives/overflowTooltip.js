import tippy from 'tippy.js'
export function setupOverflowTooltipDirective(app) {
  let tippyInstance = null
  app.directive('overflow-tooltip', {
    mounted(el, binding) {
      if (!binding.value) return
      if (el.scrollWidth > el.offsetWidth) {
        tippyInstance = tippy(el, {
          content: el.innerText,
          placement: 'top',
          arrow: false,
          ...binding.value,
        })
      }
    },
    updated(el, binding) {
      if (!binding.value) return
      if (el.scrollWidth > el.offsetWidth) {
        if (tippyInstance) {
          tippyInstance.setContent(binding.value?.content || el.innerText)
        } else {
          tippyInstance = tippy(el, {
            content: el.innerText,
            placement: 'top',
            arrow: false,
            ...binding.value,
          })
        }
      } else {
        if (tippyInstance) {
          tippyInstance.destroy()
          tippyInstance = null
        }
      }
    },
  })
}
