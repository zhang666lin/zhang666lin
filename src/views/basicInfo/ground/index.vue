<template>
  <div class="fit overflow-auto column no-wrap">
    <Form ref="formRef" :schemas="formSchemas" @submit="search">
      <template #suffix>
        <q-btn
          v-auth="'groundAdd'"
          no-caps
          color="primary"
          @click="() => handleAdd()"
          >{{ t('common.add') }}</q-btn
        >
      </template>
    </Form>

    <Table
      ref="tableRef"
      :rows="false"
      :api="handleGetGroundList"
      class="q-my-lg"
      :columns="columns"
      row-key="__rowKey"
      selection="none"
      @download="handleDownload"
    >
      <template #operation-column="scope">
        <q-btn
          v-auth="'groundEdit'"
          flat
          dense
          no-wrap
          no-caps
          color="primary"
          :label="t('common.edit')"
          @click="handleEdit(scope.row)"
        />
      </template>
    </Table>
  </div>
  <GroundDialog
    ref="groundDialogRef"
    :visible="visibleDialog"
    :title="groundDialogTitle"
    :row="rowInfo"
    :operate-type="operateType"
    @close-ground-dialog="status => closeGroundDialog(status)"
  />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import GroundDialog from './components/GroundDialog.vue'

import Form from '@/components/Form/index.vue'
import { getGroundList } from '@/api/basicInfo/ground'
import { useBasicInfo } from '@/constants/basicInfo'
import Table from '@/components/Table/index.vue'
import {
  splitStringArray,
  handleDownloadTableList,
  removeEmptyValues,
} from '@/utils/helper'
import { showSuccess } from '@/components'
defineOptions({ name: 'Ground' })

const { t } = useI18n()
const { groundTableColumns, groundSearchForm, tableTypeMap } = useBasicInfo()

const formSchemas = ref(groundSearchForm)

const columns = ref(groundTableColumns)
const tableRef = ref()
const formRef = ref(null)
const formValue = ref({})
const visibleDialog = ref(false)
const groundDialogRef = ref(null)
const groundDialogTitle = ref(t('baseInfo.addGround'))
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

function closeGroundDialog(status) {
  reset()
  handleDialogStatus(false)

  if (status) {
    tableRef.value.refresh()
  }
}

function handleAdd() {
  operateType.value = 'add'
  groundDialogTitle.value = t('baseInfo.addGround')
  handleDialogStatus(true)
}

function handleDialogStatus(status) {
  visibleDialog.value = status
}

function handleEdit(row) {
  operateType.value = 'edit'
  groundDialogTitle.value = t('baseInfo.editGround')
  rowInfo.value = row

  handleDialogStatus(true)
}

function successDownloadCallback() {
  showSuccess(t('baseInfo.downloadOk'))
}

async function handleDownload() {
  const params = handleFetchParams()
  handleDownloadTableList(
    'ground',
    successDownloadCallback,
    params,
    tableTypeMap,
  )
}

function handleFetchParams() {
  const { name, destination, is_enable, update_user, update_time } =
    formValue.value

  let params = {
    name,
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

function handleGetGroundList({ page, rowsPerPage }) {
  let params = handleFetchParams()
  params.current = page
  params.size = rowsPerPage

  return new Promise((resolve, reject) => {
    getGroundList(params)
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
