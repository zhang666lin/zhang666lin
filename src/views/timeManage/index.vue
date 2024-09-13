<template>
  <div class="fit overflow-auto column no-wrap">
    <FilterBar
      ref="filterBarRef"
      :filters="filters"
      :selectable="false"
      @search="search"
    >
      <q-btn
        no-caps
        color="primary"
        :label="t('common.add')"
        @click="handleAdd"
      />
    </FilterBar>
    <Table
      ref="tableRef"
      :api="tableApi"
      :columns="tableColumns"
      @download="handleDownload"
    />
    <AddDialog ref="addDialogRef" @success="filterBarRef?.submit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import useData from './useData'
import AddDialog from './components/AddDialog.vue'

import FilterBar from '@/components/FilterBar/index.vue'
import Table from '@/components/Table/index.vue'
import { getTimeManageListApi } from '@/api/timeManage/index'
import { downloadFile } from '@/utils/http'
import { showSuccess, showError } from '@/components'
import { getUserTimeZone, getCurrentDate } from '@/utils/time.js'

defineOptions({ name: 'TimeManage' })

const { t } = useI18n()

const {
  filters,
  tableColumns,
  timeTypeOptions,
  timeNameOptions,
  dataTypeOptions,
  remarkOptions,
} = useData()

const filtersValue = ref({})
const tableRef = ref(null)
const filterBarRef = ref(null)
const addDialogRef = ref(null)
onMounted(() => {
  filterBarRef.value.submit()
})
function search(val) {
  filtersValue.value = val
  tableRef.value.refresh()
}
function tableApi({ page, rowsPerPage }) {
  const params = filtersValue.value
  return new Promise((resolve, reject) => {
    getTimeManageListApi(params, { page, size: rowsPerPage })
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

function handleAdd() {
  addDialogRef.value.open()
}
function handleDownload(title) {
  const params = { ...filtersValue.value }
  params.title = title
  params.tz = getUserTimeZone()
  params.content = {
    time_type: timeTypeOptions,
    time_name: timeNameOptions,
    data_type: dataTypeOptions,
    update_customs_parcel: remarkOptions,
  }
  downloadFile(
    `/api/v1/time/input/logs/download`,
    params,
    `${t('menu.timeManage')}${getCurrentDate()}.xlsx`,
    () => showSuccess(t('sys.downloadSuccess')),
    () => showError(t('sys.downloadFailed')),
    { method: 'post' },
  )
}
</script>

<style lang="scss" scoped></style>
