import { createI18n } from 'vue-i18n'

import de from './lang/de.json'
import en from './lang/en.json'
import fr from './lang/fr.json'

const i18n = createI18n({
  legacy: false, // VUE3 组合式API
  messages: {
    de: { ...de },
    en: { ...en },
    fr: { ...fr },
  },
})

export function registerI18n(app) {
  app.use(i18n)
}

export const t = i18n.global.t
