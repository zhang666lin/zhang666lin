<template>
  <div class="fit overflow-auto column no-wrap">
    <Form
      ref="formRef"
      class="q-mb-md"
      :schemas="formSchemas"
      filters-select
      @submit="search"
    >
      <template #suffix>
        <q-btn
          v-auth="'orderImport'"
          no-caps
          color="primary"
          :label="t('common.orderImport')"
          @click="importOrder"
        />
        <q-btn
          v-auth="'updateNOA'"
          no-caps
          color="primary"
          :label="t('common.updateNoa')"
          @click="updateNoa"
        />
        <q-btn
          v-auth="'orderBatch'"
          no-caps
          color="primary"
          :label="t('common.splitShipment')"
          @click="addBatches"
        />
        <q-btn
          v-auth="'orderEdit'"
          color="primary"
          no-caps
          :label="t('common.edit')"
          @click="editBatches"
        />
        <q-btn
          v-auth="'orderManifestBatchDownload'"
          no-caps
          color="primary"
          :label="t('common.manifestBatchDownload')"
          :loading="isDownloadingManifest"
          @click="downloadManifest"
        />
        <q-btn
          v-auth="'orderLadingDocBatchDownload'"
          no-caps
          color="primary"
          :label="t('order.carrierFileDownload')"
          :loading="isDownloadladingBillfile"
          @click="handleDownloadLadingBillfile"
        />
      </template>
    </Form>
    <Table
      ref="tableRef"
      :api="tableApi"
      :columns="tableColumns"
      row-key="id"
      selection="multiple"
      :prevent-pagination="preventPagination"
      @click-cell-button="handleCellClick"
      @download="handleDownload"
    >
      <template #expand="{ scope, selection }">
        <Batches
          v-if="scope.expand && scope.key === expandRowId"
          ref="batchesRef"
          v-model:action="action"
          :scope="scope"
          :selection="selection"
          @modified="onModifiedBatches"
          @cancel="resetAction"
        />
      </template>
    </Table>

    <!-- 详情 -->
    <OrderDetail ref="orderDetail" source="order" />
    <!-- 导入弹框 -->
    <Uploader
      :title="t('common.orderImport')"
      :visible="fileUploaderVisible"
      @successed="successed"
      @close-box="fileUploaderVisible = false"
    />
    <!-- // 更新NOA -->
    <DraggableDialog
      :visible="visible"
      :title="title"
      :cancel-btn="t('sys.cancel')"
      :confirm-btn="t('common.update')"
      :cancel-fn="closeDialog"
      :confirm-fn="confirmFn"
      :dialog-width="'30%'"
      @close-dialog="closeDialog"
    >
      <div class="dialog-content q-px-md">
        <el-date-picker
          v-model="time"
          style="width: 100%"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime"
          :placeholder="t('sys.plsSelectTime')"
        />
      </div>
    </DraggableDialog>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useQuasar } from 'quasar'
import { onMounted, ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import useData from './useData'
import OrderDetail from './components/OrderDetail.vue'
import Uploader from './components/Uploader.vue'
import Batches from './components/Batches.vue'

import { showWarning, showSuccess, showError } from '@/components'
import { getUserTimeZone, getCurrentDate } from '@/utils/time.js'
import Form from '@/components/Form/index.vue'
import Table from '@/components/Table/index.vue'
import DraggableDialog from '@/components/DraggableDialog.vue'
import {
  getOrderListApi,
  updateBatchesNoaApi,
  ladingBillfileURL,
  orderListfileURL,
} from '@/api/order/index'
import {
  handleDownloadManifest,
  splitStringArray,
  strSplit2Array,
} from '@/utils/helper'
import { downloadFile } from '@/utils/http'
import { errorCodeI18n } from '@/constants/order'
import { useAppStore } from '@/store/modules/app'

defineOptions({ name: 'Order' })
const { formSchemas, tableColumns, addHandleColumn, removeHandleColumn } =
  useData()

const { t } = useI18n()

const $q = useQuasar()
const tableRef = ref()
const formRef = ref()
const orderDetail = ref()
const formValue = ref({})
const isDownloadingManifest = ref(false)
const isDownloadladingBillfile = ref(false)

// 导入弹窗
const fileUploaderVisible = ref(false)

// 更新NOA
const visible = ref(false)
const title = ref(t('order.updateNoa'))
const time = ref('')

const appStore = useAppStore()
const lang = appStore.getLocale
const handleApiParams = () => {
  const params = _.pickBy(formValue.value, val => val !== '' && val !== null)
  if (params.created_time_range) {
    params.created_time_start = params.created_time_range[0]
    params.created_time_end = params.created_time_range[1]
    delete params.created_time_range
  }
  if (params.carrier_ref) {
    params.carrier_ref = strSplit2Array(params.carrier_ref)
  }
  if (params.client_ref) {
    params.client_ref = strSplit2Array(params.client_ref)
  }
  params.sender_name?.length === 0 && delete params.sender_name
  params.customer_id?.length === 0 && delete params.customer_id
  params.warehouse?.length === 0 && delete params.warehouse
  params.custom_broker?.length === 0 && delete params.custom_broker
  return params
}
function tableApi({ page, rowsPerPage }) {
  const params = handleApiParams()
  return new Promise((resolve, reject) => {
    getOrderListApi(params, { page, size: rowsPerPage })
      .then(res => {
        resolve({
          data: res?.data?.results,
          count: res?.data?.count,
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

function search(val) {
  if (action.value) return showWarning(t('order.finishCurrent'))
  resetAction()
  formValue.value = val
  tableRef.value.refresh()
}

// 导入操作
function importOrder() {
  if (action.value) return showWarning(t('order.finishCurrent'))
  fileUploaderVisible.value = true
}

function parseDetails(details) {
  let res = ``
  if (Array.isArray(details) && details.length) {
    details.forEach((detail, index) => {
      const fields = splitStringArray(detail?.fields)
      const msg = errorCodeI18n[detail?.err_code]
      // 如果不是第一条数据，则在前面添加换行符
      res += `${index !== 0 ? '<br />' : ''}${fields}: ${msg}; `
    })
  }

  return res
}

// 导入成功
function successed(response) {
  if (response.code === 200) {
    if (response.data.failed) {
      let allMessage = `<p>${t('sys.importFailed')}</p>`
      if (response.data.failed.length > 0) {
        let message = ''
        response.data.failed.forEach(item => {
          message += `<li style="list-style: none;line-height: 30px;font-size: 20px;margin-bottom: 10px;">
            ${t('order.rowIndex', [item.line])}：${parseDetails(item.details)}</li>`
        })
        allMessage = `<ul style="margin:0;max-height:500px;overflow-y:auto">${message}</ul>`
        $q.dialog({
          title: `<img style="margin-bottom: -7px" src="/static/img/checkNotPassed.svg"/>${t('sys.prompt')}`,
          message: allMessage,
          style: 'width: 600px;',
          ok: t('sys.confirm'),
          html: true,
        })
      } else {
        fileUploaderVisible.value = false
        showSuccess(t('sys.importSuccess'))
        tableRef.value.refresh()
      }
    }
  }
}

// 更新NOA
function updateNoa() {
  if (action.value) return showWarning(t('order.finishCurrent'))
  if (checkedRows.value.length === 0) {
    return showWarning(t('order.selectOrder'))
  }
  if (checkedRows.value.length > 1) {
    return showWarning(t('order.selectOnly1Order'))
  }
  visible.value = true
}

async function confirmFn() {
  if (!time.value) {
    return showWarning(t('order.updateTimePls'))
  }
  const row = checkedRows.value[0]
  try {
    tableRef.value.setExpanded([row.id])
    expandRowId.value = row.id
    const { data: result = {}, code } = await updateBatchesNoaApi({
      waybill_id: row.id,
      noa: time.value,
    })
    if (code === 200) {
      showSuccess(t('order.updateNoaSuccess'))
      visible.value = false
      time.value = ''
      row.noa = result?.order_info?.noa
      row.noa_tz = result?.order_info?.noa_tz
      if (row.is_batch) {
        nextTick(async () => {
          await batchesRef.value.expand(row)
        })
      }
    }
  } catch (err) {
    time.value = ''
    visible.value = false
    showError(err?.msg ?? err?.message ?? err)
  } finally {
    time.value = ''
    visible.value = false
  }
}

function closeDialog() {
  visible.value = false
  time.value = ''
}

function handleCellClick(row, col) {
  if (col.name === 'carrier_ref') {
    openDetail(row)
  } else if (col.name === 'batch_amount') {
    expandBatches(row)
  }
}
function openDetail(row) {
  orderDetail.value.open(row)
}

const action = ref('') // 记录当前操作类型：默认 '', 'add', 'edit'
const batchesRef = ref(null)
const expandRowId = ref('')
const checkedRows = computed(() => tableRef.value.selected)

// 展开/收起 分批信息
function expandBatches(row) {
  if (action.value) return showWarning(t('order.finishCurrent'))
  if (expandRowId.value === row.id) {
    // 收起当前展开行
    resetAction()
  } else {
    tableRef.value.selected = [row]
    tableRef.value.setExpanded([row.id])
    expandRowId.value = row.id
    nextTick(async () => {
      await batchesRef.value.expand(row)
      addHandleColumn()
    })
  }
}
// 分批
async function addBatches() {
  if (action.value) return showWarning(t('order.finishCurrent'))
  if (checkedRows.value.length === 0) {
    return showWarning(t('order.selectOrder'))
  }
  if (checkedRows.value.length > 1) {
    return showWarning(t('order.selectOnly1Order'))
  }
  const row = checkedRows.value[0]
  tableRef.value.setExpanded([row.id])
  expandRowId.value = row.id
  nextTick(async () => {
    await batchesRef.value.add(row)
    action.value = 'add'
    addHandleColumn()
  })
}
// 编辑
async function editBatches() {
  if (action.value) return showWarning(t('order.finishCurrent'))
  const row = checkedRows.value[0]
  if (checkedRows.value.length === 0) {
    return showWarning(t('order.selectOrder'))
  }
  if (checkedRows.value.length > 1) {
    return showWarning(t('order.selectOnly1Order'))
  }
  if (!row.is_batch) {
    return showWarning(t('order.noBatch'))
  }
  tableRef.value.setExpanded([row.id])
  expandRowId.value = row.id
  nextTick(async () => {
    await batchesRef.value.edit(row)
    action.value = 'edit'
    addHandleColumn()
  })
}

function resetAction() {
  tableRef.value.setExpanded([])
  expandRowId.value = ''
  action.value = ''
  removeHandleColumn()
}

function onModifiedBatches() {
  resetAction()
  formRef.value.submit()
}

function preventPagination() {
  if (action.value) {
    showWarning(t('order.finishCurrent'))
    return true
  }
  return false
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
  if (action.value) return showWarning(t('order.finishCurrent'))
  if (checkedRows.value.length === 0) {
    return showWarning(t('order.selectOrder'))
  }
  try {
    const ids = checkedRows.value.map(row => row.id)
    let params = { ids: splitStringArray(ids) }

    isDownloadingManifest.value = true
    await handleDownloadManifest(
      params,
      'order-many',
      successDownloadCallback,
      errorDownloadCallback,
    )
  } catch (err) {
    showError(err?.msg ?? err?.message ?? err)
  }
}

// 下载提单文件
async function handleDownloadLadingBillfile() {
  if (checkedRows.value.length === 0) {
    return showWarning(t('order.selectOrder'))
  }
  if (action.value) return showWarning(t('order.finishCurrent'))
  try {
    const ids = checkedRows.value.map(row => row.id)
    const filename = t('order.carrierFile') + `${getCurrentDate()}.zip`
    const url = ladingBillfileURL + `?name=${filename}`
    isDownloadladingBillfile.value = true
    await downloadFile(
      url,
      {
        ids,
      },
      filename,
      successDownloadCb,
      errorDownloadCb,
      {
        method: 'post',
      },
    )
  } catch (err) {
    showError(err?.msg ?? err?.message ?? err)
  }
}
function successDownloadCb() {
  showSuccess(t('sys.downloadSuccess'))
  isDownloadladingBillfile.value = false
}
function errorDownloadCb(error) {
  if (error.code === 20025) {
    showError(t('order.notFoundMAWB'))
  } else {
    showError(error?.msg ?? error?.message ?? error)
  }
  isDownloadladingBillfile.value = false
}
// 订单列表下载
async function handleDownload() {
  const portTz = getUserTimeZone()
  if (action.value) return showWarning(t('order.finishCurrent'))
  try {
    const params = handleApiParams()
    const filename = `${t('menu.order')}${getCurrentDate()}.xlsx`
    const url =
      orderListfileURL +
      `?name=${filename}&current_tz=${portTz}&headers_type=${lang}`
    await downloadFile(
      url,
      { ...params },
      filename,
      successOrderDownloadCb,
      errorOrderDownloadCb,
      {
        method: 'post',
      },
    )
  } catch (error) {
    console.error(error)
  }
}
function successOrderDownloadCb() {}
function errorOrderDownloadCb() {}

onMounted(() => {
  formRef.value.submit()
})
</script>
