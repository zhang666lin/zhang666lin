import { Dialog, Loading, Notify, Quasar } from 'quasar'
import quasarEn from 'quasar/lang/en-US.mjs'
import quasarDe from 'quasar/lang/de.mjs'
import quasarFr from 'quasar/lang/fr.mjs'
// Import Quasar css
import 'quasar/src/css/index.sass'
import { ElDatePicker, ElDialog } from 'element-plus'

import { useAppStoreWithOut } from '@/store/modules/app'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import {
  setGlobalOptions,
  showSuccess,
  showError,
  showWarning,
} from '@/components/helper/notify'

export function registerGlobComp(app) {
  const useAppStore = useAppStoreWithOut()
  const lang = useAppStore.getLocale
  const quasarLangMap = { en: quasarEn, de: quasarDe, fr: quasarFr }
  app.use(Quasar, {
    plugins: { Loading, Notify, Dialog },
    lang: quasarLangMap[lang] ?? quasarEn,
  })

  // 按需引入组件
  app.use(ElDatePicker)
  app.use(ElDialog)
}

export { setGlobalOptions, showSuccess, showError, showWarning }
