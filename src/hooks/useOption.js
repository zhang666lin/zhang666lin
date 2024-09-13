import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

import { useUserStore } from '@/store/modules/user'

export function useOption() {
  const userStore = useUserStore()
  const port_list = userStore.getUserInfo.port_list
  const portOptions = port_list.map(i => {
    return { label: i.code, value: i.code }
  })
  const { t } = useI18n()
  const whetherOptions = ref([
    { label: t('sys.yes'), value: 1 },
    { label: t('sys.no'), value: 0 },
  ])
  function getOptionLabel(options, value) {
    const option = options.find(item => item.value === value)
    return option ? option.label : '-'
  }
  function getOption(options, value) {
    const option = options.find(item => item.label === value)
    return option ?? null
  }
  return {
    whetherOptions,
    getOptionLabel,
    getOption,
    portOptions,
  }
}
