import { Dialog } from 'quasar'

import CustomDialog from './index.vue'

export function useDialog() {
  function openDialog({ title, message }) {
    console.log({ title, message })
    return Dialog.create({
      component: CustomDialog,
      componentProps: {
        title,
        message,
      },
    })
  }
  return { openDialog }
}
