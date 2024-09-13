<template>
  <div class="fit overflow-auto column no-wrap">
    <Form ref="formRef" class="q-mb-md" :schemas="formSchemas" @submit="search">
      <template #suffix>
        <q-btn
          v-auth="'customerAdd'"
          no-caps
          color="primary"
          @click="handleAdd"
          >{{ t('common.add') }}</q-btn
        >
      </template>
    </Form>
    <Table
      ref="tableRef"
      :api="handleGetCustomerList"
      :columns="columns"
      @download="handleDownload"
    >
      <template #operation-column="scope">
        <q-btn
          v-auth="'customerEdit'"
          color="primary"
          flat
          dense
          no-wrap
          no-caps
          :label="t('common.edit')"
          @click="handleEdit(scope.row)"
        />
      </template>
    </Table>
  </div>
  <CustomerDialog
    ref="customerDialogRef"
    :visible="visibleDialog"
    :title="customerDialogTitle"
    :row="rowInfo"
    :operate-type="operateType"
    @close-customer-dialog="status => closeCustomerDialog(status)"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCustomer } from './data'
import CustomerDialog from './components/CustomerDialog.vue'

import Form from '@/components/Form/index.vue'
import Table from '@/components/Table/index.vue'
import {
  splitStringArray,
  handleDownloadTableList,
  removeEmptyValues,
} from '@/utils/helper'
import { getCustomerList } from '@/api/basicInfo/customer'
import { showSuccess } from '@/components'
import { useBasicInfo } from '@/constants/basicInfo'

defineOptions({ name: 'Customer' })

const { t } = useI18n()
const { customerFormSchemas, tableColumns } = useCustomer()
const { tableTypeMap } = useBasicInfo()

const formSchemas = ref(customerFormSchemas)
const columns = ref(tableColumns)
const tableRef = ref()
const formRef = ref(null)
const formValue = ref({})

const visibleDialog = ref(false)
const customerDialogRef = ref(null)
const customerDialogTitle = ref(t('baseInfo.addCustomer'))
const operateType = ref('add')
const rowInfo = ref({})

function search(val) {
  formValue.value = val
  tableRef.value.refresh()
}

function reset() {
  operateType.value = 'add'
  rowInfo.value = {}
}

function closeCustomerDialog(status) {
  reset()
  handleDialogStatus(false)

  if (status) {
    tableRef.value.refresh()
  }
}
function handleDialogStatus(status) {
  visibleDialog.value = status
}
function handleAdd() {
  operateType.value = 'add'
  customerDialogTitle.value = t('baseInfo.addCustomer')
  handleDialogStatus(true)
}
function handleEdit(row) {
  operateType.value = 'edit'
  customerDialogTitle.value = t('baseInfo.editCustomer')
  rowInfo.value = row
  handleDialogStatus(true)
}

function handleFetchParams() {
  const { code, name, abbreviation, is_enable, update_user, update_time } =
    formValue.value

  let params = {
    code,
    name,
    abbreviation,
    is_enable,
    update_user: splitStringArray(update_user),
  }
  if (update_time) {
    params.update_time_start = update_time[0]
    params.update_time_end = update_time[1]
  }
  params = removeEmptyValues(params)

  return params
}

async function handleGetCustomerList({ page, rowsPerPage }) {
  let params = handleFetchParams()
  params.current = page
  params.size = rowsPerPage

  return new Promise((resolve, reject) => {
    getCustomerList(params)
      .then(res => {
        resolve({ data: res.results ?? [], count: res.count })
      })
      .catch(err => {
        reject(err)
      })
  })
}

function successDownloadCallback() {
  showSuccess(t('baseInfo.downloadOk'))
}

async function handleDownload() {
  const params = handleFetchParams()
  handleDownloadTableList(
    'customer',
    successDownloadCallback,
    params,
    tableTypeMap,
  )
}

onMounted(async () => {
  formRef.value.submit()
})
</script>

<style lang="scss" scoped></style>
