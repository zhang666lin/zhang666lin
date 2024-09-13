<template>
  <Dialog
    ref="dialogRef"
    v-model="show"
    :title="t('baseInfo.addDeliveryCode')"
    :content-style="contentStyle"
    @confirm="handleOk"
    @cancel="handleCancel"
  >
    <BaseInfo ref="baseInfoRef" />
  </Dialog>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Dialog as QuasarDialog } from 'quasar'

import BaseInfo from './BaseInfo.vue'

import Dialog from '@/components/Dialog/index.vue'
import { addDeliveryCode } from '@/api/basicInfo/deliveryCode'
import { showSuccess, showError } from '@/components'

const { t } = useI18n()

const emit = defineEmits(['closeDialog'])
const dialogRef = ref(null)
const baseInfoRef = ref(null)

const contentStyle = ref({
  'max-width': '800px',
  width: '800px',
})

function reset() {}

function isEmptyObject(obj) {
  // 检查对象是否为空对象（没有任何key）
  if (Object.keys(obj).length === 0) {
    return true
  }

  // 遍历对象的每一个 key
  for (const key in obj) {
    // 如果对象自身拥有该 key 且 key 的值不为 null 并且有值
    if (
      // eslint-disable-next-line no-prototype-builtins
      obj.hasOwnProperty(key) &&
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== ''
    ) {
      return false
    }
  }

  // 如果所有key的值都是 null、undefined 或 空字符串，返回true
  return true
}

function handleCancel() {
  if (!isEmptyObject(baseInfoRef.value.baseInfoForm)) {
    QuasarDialog.create({
      title: 'tips',
      message: t('sys.unsavedChanges'),
      ok: { noCaps: true },
      cancel: { flat: true, noCaps: true },
    })
      .onOk(() => {
        reset()
        handleCloseDialog()
        emit('closeDialog', false)
      })
      .onCancel(() => {})
  } else {
    reset()
    handleCloseDialog()
    emit('closeDialog', false)
  }
}
const show = ref(false)
function handleCloseDialog() {
  show.value = false
}

async function handleOk() {
  const valid = await baseInfoRef.value.baseInfoFormRef.validate()
  if (valid) {
    try {
      const res = await addDeliveryCode(baseInfoRef.value.baseInfoForm)
      if (res.code === 200) {
        showSuccess(t('sys.submitSuccess'))
        handleCloseDialog()
        emit('closeDialog', true)
      }
    } catch (err) {
      showError(err?.msg ?? err?.message ?? err)
    }
  }
}

defineExpose({
  show,
})
</script>
<style scoped lang="scss">
.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
