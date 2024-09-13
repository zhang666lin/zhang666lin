<template>
  <q-dialog v-model="uploaderVisible" persistent>
    <q-card row items-center style="width: 1000px; max-width: 30vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5">
          {{ t('order.importOrder') }}
          <a
            style="
              cursor: pointer;
              text-decoration: underline;
              font-size: 16px;
              color: rgba(26, 128, 228, 1);
            "
            @click="downloadTemplate"
            >{{ t('order.templateDownload') }}</a
          >
        </div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense @click="onReset" />
      </q-card-section>

      <q-form
        class="q-pa-md q-mt-xs q-gutter-md"
        @submit="onSubmit"
        @reset="onReset"
      >
        <section class="column q-pa-md">
          <q-file
            v-model="ladingBillfile"
            clearable
            outlined
            counter
            accept=".pdf"
            style="margin-bottom: 10px"
            color="primary"
            :loading="ladingBillLoading"
            :filter="files => checkFile(files, 1)"
            :label="t('order.importCarrierFileLimit')"
            @finish="ladingBillFileLoaded"
          >
            <template #prepend>
              <q-icon name="cloud_upload" />
            </template>
          </q-file>
          <q-file
            v-model="orderFile"
            clearable
            outlined
            counter
            :loading="orderLoading"
            accept=".xlsx,.xls"
            color="primary"
            :label="t('order.importOrderFileLimit')"
            @finish="orderFileLoaded"
          >
            <template #prepend>
              <q-icon name="cloud_upload" />
            </template>
          </q-file>
        </section>
        <q-card-actions align="right">
          <q-btn
            no-caps
            flat
            :label="t('sys.submit')"
            color="primary"
            :loading="subLoading"
            @click="onSubmit"
          />
          <q-btn
            v-close-popup
            no-caps
            flat
            :label="t('sys.cancel')"
            color="primary"
            @click="onReset"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import useData from '../useData.js'

import { exportUpload, uploadCarrierFile } from '@/api/order'
import { showWarning, showError } from '@/components'
import { useAppStoreWithOut } from '@/store/modules/app'
import { orderImportResErrCode } from '@/constants/order'
import { sortArrayByField } from '@/utils/helper'

const { t } = useI18n()

const uploaderVisible = ref(false)
const subLoading = ref(false)
const ladingBillLoading = ref(false)
const orderLoading = ref(false)
const ladingBillfile = ref(null)
const orderFile = ref(null)

const props = defineProps({
  // 控制弹窗显示隐藏，父组件通过 v-modal 传入
  visible: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['successed', 'closeBox'])

const { orderTemplateDownloadURL } = useData()

watch(
  () => props.visible,
  newValue => {
    uploaderVisible.value = newValue
  },
)

function ladingBillFileLoaded() {}
function orderFileLoaded() {}

function handleSortLines(res) {
  if (Array.isArray(res?.data?.failed) && res?.data?.failed.length) {
    const sortedFailed = sortArrayByField(res.data.failed, 'line', true)
    res.data.failed = sortedFailed
  }
  return res
}

async function onSubmit() {
  if (!ladingBillfile.value || !orderFile.value) {
    const validateText = !ladingBillfile.value
      ? t('order.carrierFileEmpty')
      : !orderFile.value
        ? t('order.orderFileEmpty')
        : t('order.empty')
    return showWarning(validateText)
  }
  subLoading.value = true
  try {
    const ladingFilename = ladingBillfile.value.name
    // 先上传提单文件  再上传订单文件
    const result = await uploadCarrierFile({ file: ladingBillfile.value })

    if (result.code !== 200) {
      showError(result?.msg ?? result?.message ?? result)
      subLoading.value = false
      return
    }
    const params = {
      carrier_link: ladingFilename,
    }
    const res = await exportUpload(
      {
        waybill_file: orderFile.value,
      },
      params,
    )
    if (res.code === 200) {
      onReset()
      // 前端对错误信息按行号过滤
      const sortedRes = handleSortLines(res)
      emit('successed', sortedRes)
    }
  } catch (err) {
    if (orderImportResErrCode.includes(err?.code?.toString())) {
      showError(t(`errorCode.${err?.code}`))
    } else {
      showError(err?.msg ?? err?.message ?? err)
    }
  } finally {
    subLoading.value = false
  }
}
function checkFile(files, size) {
  const isValid = Array.from(files).every(file => {
    return file.size / 1024 / 1024 > size
  })
  if (isValid) {
    showWarning(t('order.fileSizeLimit', [size]))
    return []
  }
  return files
}
function downloadTemplate() {
  const useAppStore = useAppStoreWithOut()
  const language = useAppStore.getLocale
  const url = orderTemplateDownloadURL[language]
  window.location.assign(url)
}
function onReset() {
  ladingBillfile.value = null
  orderFile.value = null
  emit('closeBox', false)
}
</script>

<style lang="scss" scoped></style>
