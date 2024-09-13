<template>
  <div class="fit overflow-auto column no-wrap">
    <Form ref="formRef" class="q-mb-md" :schemas="formSchemas" @submit="search">
      <template #suffix>
        <q-btn
          v-auth="'sumaManifestBatchDownload'"
          no-caps
          color="primary"
          :label="t('declaration.downloadSumaManifest')"
          :loading="isDownloadingManifest"
          @click="downloadManifest"
        />
      </template>
    </Form>
    <Table
      ref="tableRef"
      :rows="false"
      :api="getSumaList"
      :columns="columns"
      selection="multiple"
      class="table"
      @click-cell-button="handleClickCellButton"
      @download="handleDownload"
    />
  </div>
  <!-- 详情 -->
  <OrderDetail ref="orderDetail" source="suma" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSuma } from './data'

import { showWarning, showSuccess, showError } from '@/components'
import Form from '@/components/Form/index.vue'
import Table from '@/components/Table/index.vue'
import { getOrderListApi } from '@/api/order'
import {
  handleDownloadManifest,
  splitStringArray,
  removeEmptyValues,
  strSplit2Array,
  handleDownloadDeclareTableList,
} from '@/utils/helper'
import OrderDetail from '@/views/order/components/OrderDetail.vue'
defineOptions({ name: 'Suma' })

const { t } = useI18n()
const { sumaFormSchemas, tableColumns } = useSuma()

const formSchemas = ref(sumaFormSchemas)
const columns = ref(tableColumns)
const tableRef = ref()
const orderDetail = ref()
const formValue = ref({})
const isDownloadingManifest = ref(false)

function successDownloadTableCallback() {
  showSuccess(t('sys.downloadSuccess'))
}
async function handleDownload() {
  const params = handleFetchParams()
  handleDownloadDeclareTableList('suma', successDownloadTableCallback, params)
}

function handleFetchParams() {
  const { update_time, ...rest } = formValue.value
  let params = { ...rest }
  if (update_time) {
    params.created_time_start = update_time[0]
    params.created_time_end = update_time[1]
  }

  if (params.carrier_ref) {
    params.carrier_ref = strSplit2Array(params.carrier_ref)
  }
  params = removeEmptyValues(params)

  return params
}

function getSumaList({ page, rowsPerPage }) {
  let params = handleFetchParams()

  return new Promise((resolve, reject) => {
    getOrderListApi(params, { page, size: rowsPerPage, service_type: 'suma' })
      .then(res => {
        resolve({ data: res.data.results ?? [], count: res.data.count })
      })
      .catch(err => reject(err))
  })
}
const formRef = ref(null)

function search(val) {
  formValue.value = val
  tableRef.value.refresh()
}

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
// 下载Manifest
async function downloadManifest() {
  if (tableRef.value.selected.length === 0) {
    return showWarning(t('order.selectOrder'))
  }
  try {
    const ids = tableRef.value.selected.map(row => row.id)
    let params = { ids: splitStringArray(ids) }
    isDownloadingManifest.value = true
    await handleDownloadManifest(
      params,
      'suma-many',
      successDownloadCallback,
      errorDownloadCallback,
    )
  } catch (err) {
    showError(err?.msg ?? err?.message ?? err)
  }
}

function handleClickCellButton(row, col) {
  if (col.name === 'carrier_ref') {
    orderDetail.value.open(row)
  }
}

onMounted(() => {
  formRef.value.submit()
})
</script>

<style lang="scss" scoped>
td:first-child,
td:last-child {
  background-color: #fff;
  z-index: 1;
}
thead tr th:first-child,
td:first-child {
  left: 0;
  position: sticky;
  border-right: 1px solid $grey-4;
}
thead tr th:last-child,
td:last-child {
  right: 0;
  position: sticky;
  border-left: 1px solid $grey-4;
}
</style>
