<template>
  <BoardLayout>
    <template #filter-bar>
      <FilterBar
        ref="filterBarRef"
        vertical
        :filters="filters"
        @search="search"
      />
    </template>
    <template #view-select>
      <ViewSelect
        ref="viewSelectRef"
        :type="type"
        @select="setView"
        @create-view="handleCreateView"
      />
    </template>
    <template #table>
      <Table
        ref="tableRef"
        setable
        class="flex full-width"
        :columns="tableColumns"
        :api="getTableDataApi"
        @download="handleDownload"
      />
    </template>
  </BoardLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loading } from 'quasar'
import _ from 'lodash'

import ViewSelect from '../components/ViewSelect.vue'
import BoardLayout from '../components/BoardLayout.vue'

import { showSuccess, showError } from '@/components'
import Table from '@/components/Table/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import { createViewApi, getBoardsListApi } from '@/api/boards'
import { downloadFile } from '@/utils/http'
import { getUserTimeZone, getCurrentDate } from '@/utils/time'
import { useOption } from '@/hooks/useOption'

defineOptions({ name: 'BulkBoard' })
const { t } = useI18n()
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  filters: {
    type: Array,
    required: true,
  },
  tableColumns: {
    type: Array,
    required: true,
  },
})
const filterBarRef = ref(null)
const viewSelectRef = ref(null)
const tableRef = ref(null)
const formValue = ref({})

function search(val) {
  formValue.value = val
  tableRef.value.refresh()
}
function getTableDataApi({ page, rowsPerPage }) {
  const params = formValue.value
  return new Promise((resolve, reject) => {
    getBoardsListApi(props.type, params, {
      page,
      size: rowsPerPage,
    })
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
// 创建视图
function handleCreateView(viewName) {
  const { filterBarItems, filterBarValue } =
    filterBarRef.value.getFilterBarInfo()
  const tableData = tableRef.value.getColumns()
  Loading.show()
  createViewApi({
    view_name: viewName,
    report_id: props.type,
    view_content: {
      filter: pruneFilterBarData(filterBarItems, filterBarValue),
      table: pruneTableColumnsData(tableData),
    },
  })
    .then(res => {
      if (res.code === 200) {
        viewSelectRef.value.getViewList(viewName)
        showSuccess(t('sys.submitSuccess'))
      } else if (res.code === 60001) {
        showError(t('sys.viewNameExist'))
      }
    })
    .catch(err => {
      if (err.code === 60001) {
        showError(t('sys.viewNameExist'))
      } else {
        showError(err)
      }
    })
    .finally(() => {
      Loading.hide()
    })
}

// 选中某个视图
function setView(viewContent) {
  // 回显 filter
  const filterBarData = restoreFilterBarData(props.filters, viewContent?.filter)
  filterBarRef.value.setFilters(filterBarData)
  // 回显 table
  const tableColumnsData = restoreTableColumns(
    props.tableColumns,
    viewContent?.table,
  )
  tableRef.value.setColumns(tableColumnsData)
  filterBarRef.value.submit()
}
// 修剪 filter 数据
function pruneFilterBarData(filers, value) {
  return filers.map(i => {
    const result = { field: i.field, show: i.show }
    if (Object.keys(value).includes(i.field)) {
      result.defaultValue = value[i.field]
    }
    return result
  })
}
// 修剪 table 数据
function pruneTableColumnsData(columns) {
  return columns.map(i => {
    return { name: i.name, show: i.show }
  })
}
// 还原 filter 数据
function restoreFilterBarData(rawData, viewData) {
  if (viewData) {
    return _.cloneDeep(rawData).map(r => {
      const temp = viewData.find(v => v.field === r.field)
      if (temp) {
        r.show = temp.show
        r.defaultValue = temp.defaultValue
      }
      return r
    })
  }
  return rawData
}
// 还原 table 数据
function restoreTableColumns(rawColumns, viewColumns) {
  if (viewColumns) {
    return _.cloneDeep(rawColumns).map(r => {
      const temp = viewColumns.find(v => v.name === r.name)
      if (temp) r.show = temp.show
      return r
    })
  }
  return rawColumns
}
// 下载
const { whetherOptions } = useOption()
async function handleDownload(val) {
  const params = { ...formValue.value }
  params.title = val
  params.content = { inspection_status: whetherOptions.value }
  params.tz = getUserTimeZone()
  const typeFilenameMap = {
    order: t('menu.orderBoard'),
    batch: t('menu.batchBoard'),
    bulk: t('menu.bulkBoard'),
    flat: t('menu.flatBoard'),
    main_line: t('menu.mainLineBoard'),
    pmc: t('menu.pmcBoard'),
  }
  downloadFile(
    `/api/v1/report_view/${props.type}/download`,
    params,
    `${typeFilenameMap[props.type]}${getCurrentDate()}.xlsx`,
    () => showSuccess(t('sys.downloadSuccess')),
    () => showError(t('sys.downloadFailed')),
    { method: 'post' },
  )
}
</script>
