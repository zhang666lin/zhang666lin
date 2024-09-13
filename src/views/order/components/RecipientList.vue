<template>
  <div class="row q-pt-xs q-pb-xs">
    <div class="text-subtitle1 q-pt-md text-primary text-weight-bold">
      {{ t('order.consigneeList') }}
      <q-btn
        no-caps
        color="primary"
        :label="downloadBtnLabel"
        class="q-ml-sm"
        :loading="isDownloadingManifest"
        @click="handleMainfestDownload"
      />
    </div>
  </div>
  <Table
    ref="tableRef"
    :table-style="{ height: '400px' }"
    :api="getRecipientListApi"
    :columns="detailColumns"
    @download="handleDownload"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import useData from '../useData'

import Table from '@/components/Table/index.vue'
import { getRecipientList } from '@/api/order/index'
import { showSuccess, showError } from '@/components'
import { handleDownloadManifest } from '@/utils/helper'
import { downloadFile } from '@/utils/http'
import { getCurrentDate } from '@/utils/time.js'
import { useAppStoreWithOut } from '@/store/modules/app'

const { t } = useI18n()
const props = defineProps({
  row: {
    type: Object,
    default: () => {
      return {}
    },
  },
  // 由于申报信息的详情弹窗与订单详情弹窗共用，但显示内容不同，所以需要区分
  source: {
    type: String,
    default: '',
  },
})

const downloadBtnLabel = computed(() => {
  if (props.source === 'suma') {
    return t('declaration.downloadSumaManifest')
  }
  return t('order.downloadManifest')
})
const { detailColumns } = useData()

const tableRef = ref(null)
const isDownloadingManifest = ref(false)

onMounted(() => {
  tableRef.value.refresh()
})

function successDownloadCallback() {
  showSuccess(t('sys.downloadSuccess'))
  isDownloadingManifest.value = false
}
function errorDownloadCallback(error) {
  if (error.code === 20040) {
    showError(t('order.notFoundManifest'))
  } else {
    showError(error?.msg ?? error?.message ?? error)
  }
  isDownloadingManifest.value = false
}

function getRecipientListApi({ page, rowsPerPage }) {
  return new Promise((resolve, reject) => {
    getRecipientList({
      id: props.row.id,
      page,
      size: rowsPerPage,
    })
      .then(res => {
        resolve({
          data: res.results || [],
          count: res.count || 0,
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

function handleMainfestDownload() {
  isDownloadingManifest.value = true
  const { carrier_ref, id, consigned_to_ehub } = props.row
  if (props.source === 'suma') {
    handleDownloadManifest(
      { carrier_ref, id, consigned_to_ehub },
      'suma',
      successDownloadCallback,
      errorDownloadCallback,
    )
  } else {
    // order or ics2
    handleDownloadManifest(
      { carrier_ref, id },
      props.source,
      successDownloadCallback,
      errorDownloadCallback,
    )()
  }
}

async function handleDownload() {
  try {
    const useAppStore = useAppStoreWithOut()
    const language = useAppStore.getLocale
    const filename = `${t('order.consigneeList')}${getCurrentDate()}.xlsx`
    const url =
      `/api/v1/waybill/${props.row.id}/recipients/download` +
      `?name=${filename}&language=${language}`
    await downloadFile(url, {}, filename, successDownloadCb, errorDownloadCb)
  } catch (error) {
    console.error(error)
  }
}
function successDownloadCb() {
  showSuccess(t('sys.downloadSuccess'))
}
function errorDownloadCb() {}
</script>

<style lang="scss" scoped>
.setWidth {
  min-width: 1000px;
  max-width: 1500px;
  margin: 0 auto;
  line-height: 40px;
}
</style>
