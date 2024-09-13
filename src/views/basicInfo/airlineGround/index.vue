<template>
  <div class="fit overflow-auto column no-wrap">
    <Form ref="formRef" class="q-mb-md" :schemas="formSchemas" @submit="search">
      <template #suffix>
        <q-btn
          v-auth="'airlineGroundAdd'"
          no-caps
          color="primary"
          @click="() => handleAdd()"
          >{{ t('common.add') }}</q-btn
        >
      </template>
    </Form>
    <Table
      ref="tableRef"
      :api="handleGetAirlineGroundList"
      :columns="columns"
      @download="handleDownload"
      @click-cell-button="handleCellClick"
    >
      <template #operation-column="scope">
        <q-btn
          v-auth="'airlineGroundEdit'"
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
  <AirlineGroundDialog
    ref="airlineGroundDialogRef"
    :visible="visibleDialog"
    :title="airlineGroundDialogTitle"
    :row="rowInfo"
    :operate-type="operateType"
    @close-airline-ground-dialog="status => closeAirlineGroundDialog(status)"
  />
  <ContactDialog
    ref="contactDialogRef"
    :visible="visibleContactDialog"
    :title="''"
    :row="rowInfo"
    :contact-type="contactType"
    :contact-row="rowInfo"
    @close-contact-dialog="status => closeContactDialog(status)"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAirlineGround } from './data'
import AirlineGroundDialog from './components/AirlineGroundDialog.vue'
import ContactDialog from './components/ContactDialog.vue'

import Form from '@/components/Form/index.vue'
import Table from '@/components/Table/index.vue'
import {
  splitStringArray,
  handleDownloadTableList,
  removeEmptyValues,
} from '@/utils/helper'
import { getAirlineGroundList } from '@/api/basicInfo/airlineGround'
import { showSuccess } from '@/components'
import { useBasicInfo } from '@/constants/basicInfo'

defineOptions({ name: 'AirlineGround' })

const { t } = useI18n()
const { airlineGroundFormSchemas, tableColumns } = useAirlineGround()
const { tableTypeMap } = useBasicInfo()

const formSchemas = ref(airlineGroundFormSchemas)
const columns = ref(tableColumns)
const tableRef = ref()
const formRef = ref(null)
const formValue = ref({})

const visibleDialog = ref(false)
const visibleContactDialog = ref(false)
const airlineGroundDialogRef = ref(null)
const contactDialogRef = ref(null)
const airlineGroundDialogTitle = ref(t('baseInfo.addGround'))
const contactType = ref('')
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

function closeContactDialog() {
  contactType.value = ''
  visibleContactDialog.value = false
}

function closeAirlineGroundDialog(status) {
  reset()
  handleDialogStatus(false)

  if (status) {
    tableRef.value.refresh()
  }
}

function handleFetchParams() {
  const { airline_name, gha, shed_code, is_enable, update_user, update_time } =
    formValue.value

  let params = {
    airline_name,
    gha,
    shed_code,
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

async function handleGetAirlineGroundList({ page, rowsPerPage }) {
  let params = handleFetchParams()
  params.current = page
  params.size = rowsPerPage

  return new Promise((resolve, reject) => {
    getAirlineGroundList(params)
      .then(res => {
        resolve({ data: res.results ?? [], count: res.count })
      })
      .catch(err => {
        reject(err)
      })
  })
}

onMounted(async () => {
  formRef.value.submit()
})

function handleDialogStatus(status) {
  visibleDialog.value = status
}

function handleAdd() {
  operateType.value = 'add'
  airlineGroundDialogTitle.value = t('baseInfo.addAirlineGround')
  handleDialogStatus(true)
}
function handleEdit(row) {
  operateType.value = 'edit'
  airlineGroundDialogTitle.value = t('baseInfo.editAirlineGround')
  rowInfo.value = row
  handleDialogStatus(true)
}
function handleCellClick(row, col) {
  visibleContactDialog.value = true
  contactType.value = col.name
  rowInfo.value = row
}
function successDownloadCallback() {
  showSuccess(t('baseInfo.downloadOk'))
}

async function handleDownload() {
  const params = handleFetchParams()
  handleDownloadTableList(
    'airline_ground',
    successDownloadCallback,
    params,
    tableTypeMap,
  )
}
</script>

<style lang="scss" scoped></style>
