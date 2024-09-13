<template>
  <div class="fit overflow-auto column no-wrap">
    <FilterBar
      ref="filterBarRef"
      :filters="filters"
      :selectable="false"
      @search="search"
    >
      <q-btn
        v-auth="'pmcAdd'"
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
      <template #operation-column="scope">
        <q-btn
          color="primary"
          flat
          dense
          no-wrap
          no-caps
          :label="t('common.operation')"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                v-close-popup
                v-auth="'pmcEdit'"
                clickable
                @click="handleEdit(scope.row)"
              >
                <q-item-section>{{ t('common.edit') }}</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                :disable="!scope.row?.cmr_link?.startsWith('http')"
                clickable
                :href="scope.row?.cmr_link"
                :download="getFilenameByLink(scope.row?.cmr_link)"
              >
                <q-item-section>{{ t('pmc.downloadCmr') }}</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                :disable="!scope.row?.pod_link?.startsWith('http')"
                clickable
                :href="scope.row?.pod_link"
                :download="getFilenameByLink(scope.row?.pod_link)"
              >
                <q-item-section>{{ t('pmc.downloadPod') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </Table>
  </div>
  <PmcDialog ref="pmcDialogRef" @success="filterBarRef?.submit" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import useData from './useData'
import PmcDialog from './components/PmcDialog.vue'

import FilterBar from '@/components/FilterBar/index.vue'
import Table from '@/components/Table/index.vue'
import { getPmcListApi } from '@/api/pmc/index'
import { downloadFile } from '@/utils/http'
import { getUserTimeZone, getCurrentDate } from '@/utils/time'
import { showSuccess, showError } from '@/components'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'Pmc' })

const { t } = useI18n()

const { filters, tableColumns } = useData()

const userStore = useUserStore()
const currentPort = userStore.getPort

const filtersValue = ref({})
const tableRef = ref(null)
const filterBarRef = ref(null)
const pmcDialogRef = ref(null)
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
    getPmcListApi(params, { page, size: rowsPerPage })
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
  pmcDialogRef.value.open('add', currentPort.value)
}
function handleEdit(row) {
  pmcDialogRef.value.open('edit', currentPort.value, row)
}
function getFilenameByLink(link) {
  return link ? link.split('/').pop() : ''
}
function handleDownload(title) {
  const params = { ...filtersValue.value }
  params.title = title
  params.tz = getUserTimeZone()
  downloadFile(
    `/api/v1/uld/inbound/download`,
    params,
    `${t('menu.pmc')}${getCurrentDate()}.xlsx`,
    () => showSuccess(t('sys.downloadSuccess')),
    () => showError(t('sys.downloadFailed')),
    { method: 'post' },
  )
}
</script>

<style lang="scss" scoped></style>
