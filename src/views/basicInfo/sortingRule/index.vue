<template>
  <div class="fit overflow-auto column no-wrap">
    <FilterBar
      ref="filterBarRef"
      :filters="filters"
      :selectable="false"
      @search="search"
    >
      <q-btn
        v-auth="'sortingRuleAdd'"
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
    >
      <template #operation-column="{ row }">
        <q-btn
          flat
          dense
          no-wrap
          no-caps
          color="secondary"
          :label="t('common.edit')"
          @click="handelEdit(row)"
        />
        <q-btn
          flat
          dense
          no-wrap
          no-caps
          color="negative"
          :label="t('sys.delete')"
          :disable="row.is_enabled"
          @click="handelDelete(row)"
        />
      </template>
    </Table>
  </div>
  <AddEditDialog ref="addEditDialogRef" @success="() => tableRef.refresh()" />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import { useBasicInfo } from './useData'
import AddEditDialog from './components/AddEditDialog.vue'

import { showSuccess, showError } from '@/components'
import FilterBar from '@/components/FilterBar/index.vue'
import {
  getSortingRuleList,
  getSortingRulesDownloadUrl,
  deleteSortingRule,
} from '@/api/basicInfo/sortingRule.js'
import Table from '@/components/Table/index.vue'

defineOptions({ name: 'SortingRule' })
const $q = useQuasar()
const { t } = useI18n()
const { filters, tableColumns } = useBasicInfo()

const tableRef = ref()
const filterBarRef = ref(null)
const filtersValue = ref({})

function search(val) {
  filtersValue.value = val
  tableRef.value.refresh()
}
const addEditDialogRef = ref(null)
// 新增
function handleAdd() {
  addEditDialogRef.value.open({ type: 'add' })
}
// 编辑
function handelEdit(row) {
  addEditDialogRef.value.open({ type: 'edit', data: row })
}
// 删除
function handelDelete(row) {
  $q.dialog({
    title: t('sys.prompt'),
    message: t('sys.deleteConfirm'),
    cancel: true,
  }).onOk(() => {
    deleteSortingRule({ id: row.id })
      .then(() => {
        showSuccess(t('sys.deleteSuccess'))
        tableRef.value.refresh()
      })
      .catch(err => {
        showError(err?.message ?? err)
      })
  })
}
// 下载
async function handleDownload() {
  const params = { ...filtersValue.value }
  $q.loading.show()
  getSortingRulesDownloadUrl(params)
    .then(res => {
      window.open(res.data)
      showSuccess(t('sys.downloadSuccess'))
    })
    .catch(err => {
      showError(t('sys.downloadFailed') + ': ' + err?.message ?? err)
    })
    .finally(() => {
      $q.loading.hide()
    })
}

function tableApi({ page, rowsPerPage }) {
  return new Promise((resolve, reject) => {
    getSortingRuleList({
      ...filtersValue.value,
      page_num: page,
      page_size: rowsPerPage,
    })
      .then(res => {
        resolve({
          data: res?.data?.list,
          count: res?.data?.page_num_total,
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

onMounted(() => {
  filterBarRef.value.submit()
})
</script>
<style scoped lang="scss"></style>
