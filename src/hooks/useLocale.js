import elementEn from 'element-plus/dist/locale/en.mjs'
import elementDe from 'element-plus/dist/locale/de.mjs'
import elementFr from 'element-plus/dist/locale/fr.mjs'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

import { useAppStore } from '@/store/modules/app'
export function useLocale() {
  const { t, locale } = useI18n()
  const appStore = useAppStore()

  const elementLangMap = { en: elementEn, fr: elementFr, de: elementDe }
  const getElementLocale = computed(
    () => elementLangMap[locale.value] ?? elementEn,
  )
  function setLocale() {
    locale.value = appStore.getLocale
    document.title = t('sys.title')
  }
  return {
    getElementLocale,
    setLocale,
  }
}
