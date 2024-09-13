<template>
  <div class="fit overflow-auto column no-wrap">
    <Form ref="formRef" class="q-mb-md" :schemas="formSchemas" @submit="search">
      <template #suffix>
        <q-btn
          v-auth="'airlineAdd'"
          no-caps
          color="primary"
          @click="() => handleAdd()"
          >{{ t('common.add') }}</q-btn
        >
      </template>
    </Form>
    <Table
      ref="tableRef"
      :api="handleGetAirlineList"
      :columns="columns"
      @download="handleDownload"
    >
      <template #operation-column="scope">
        <q-btn
          v-auth="'airlineEdit'"
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
  <AireLineDialog
    ref="aireLineDialogRef"
    :visible="visibleDialog"
    :title="aireLineDialogTitle"
    :row="rowInfo"
    :operate-type="operateType"
    @close-airline-dialog="closeAirlineDialog"
  />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import AireLineDialog from './components/AireLineDialog.vue'

import Form from '@/components/Form/index.vue'
import { useBasicInfo } from '@/constants/basicInfo'
import Table from '@/components/Table/index.vue'
import { getAirlineList } from '@/api/basicInfo/airline'
import {
  splitStringArray,
  handleDownloadTableList,
  removeEmptyValues,
} from '@/utils/helper'
import { showSuccess } from '@/components'

defineOptions({ name: 'Airline' })

const { t } = useI18n()
const { airlineTableColumns, airlineSearchForm, tableTypeMap } = useBasicInfo()

const formSchemas = ref(airlineSearchForm)

const columns = ref(airlineTableColumns)
const tableRef = ref()
const formRef = ref(null)
const formValue = ref({})
const visibleDialog = ref(false)
const aireLineDialogRef = ref(null)
const aireLineDialogTitle = ref(t('baseInfo.addAirline'))
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

function closeAirlineDialog(status) {
  reset()
  handleDialogStatus(false)

  if (status) {
    tableRef.value.refresh()
  }
}

function successDownloadCallback() {
  showSuccess(t('baseInfo.downloadOk'))
}

async function handleDownload() {
  const params = handleFetchParams()
  handleDownloadTableList(
    'airline',
    successDownloadCallback,
    params,
    tableTypeMap,
  )
}

function handleAdd() {
  operateType.value = 'add'
  aireLineDialogTitle.value = t('baseInfo.addAirline')
  handleDialogStatus(true)
}

function handleDialogStatus(status) {
  visibleDialog.value = status
}

function handleEdit(row) {
  operateType.value = 'edit'
  aireLineDialogTitle.value = t('baseInfo.eidtAirline')
  rowInfo.value = row
  handleDialogStatus(true)
}

function handleFetchParams() {
  const {
    airline_name,
    awb_prefix,
    destination,
    is_enable,
    update_user,
    update_time,
  } = formValue.value

  let params = {
    airline_name,
    awb_prefix,
    destination: splitStringArray(destination),
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

async function handleGetAirlineList({ page, rowsPerPage }) {
  let params = handleFetchParams()

  params.current = page
  params.size = rowsPerPage

  return new Promise((resolve, reject) => {
    getAirlineList(params)
      .then(res => {
        resolve({ data: res.results ?? [], count: res.count })
      })
      .catch(err => reject(err))
  })
}

onMounted(() => {
  formRef.value.submit()
})
</script>
<style scoped lang="scss">
.custom-dialog {
  width: 300px;
  height: auto;
}
</style>
