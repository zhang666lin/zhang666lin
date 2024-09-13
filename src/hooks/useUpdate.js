import { Dialog } from 'quasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
export function useUpdate() {
  const dialogVisible = ref(false)
  const { t } = useI18n()
  function addUpdateListener() {
    document.body.addEventListener('plugin_web_update_notice', e => {
      const { version, options } = e.detail
      console.log(version, options)
      if (dialogVisible.value) return
      dialogVisible.value = true
      Dialog.create({
        title: t('sys.updateDialogTitle'),
        message: t('sys.updateDialogMessage'),
        ok: { label: t('sys.refresh'), noCaps: true },
        cancel: { label: t('sys.dismiss'), flat: true, noCaps: true },
        position: 'top',
      })
        .onOk(() => {
          window.location.reload()
        })
        .onDismiss(() => {
          dialogVisible.value = false
        })
    })
  }
  return { addUpdateListener }
}
