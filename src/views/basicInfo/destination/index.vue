<template>
  <div class="fit overflow-auto column no-wrap">
    <FilterBar
      ref="filterBarRef"
      :filters="filters"
      :selectable="false"
      @search="search"
    >
      <q-btn
        v-auth="'destinationAdd'"
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
      @click-cell-button="handleCellClick"
      @download="handleDownload"
    >
      <template #operation-column="{ row }">
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
  <Dialog
    v-model="show"
    :title="dialogTitle"
    :content-style="{
      minWidth: '60%',
      maxWidth: '70%',
    }"
    @cancel="onDialogCancel"
    @confirm="onDialogConfirm"
    @close-dialog="onDialogCancel"
  >
    <BaseInfoForm
      ref="baseInfoFormRef"
      :title="dialogTitle"
      :row-info="rowInfo"
    />
  </Dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import BaseInfoForm from './components/baseInfoForm.vue'
import { useBasicInfo } from './useData'
import { resErrCode } from './errCode'

import Dialog from '@/components/Dialog/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import Table from '@/components/Table/index.vue'
import { showSuccess, showError } from '@/components'
import {
  getDestinationList,
  addDestination,
  editDestination,
  deleteDestination,
  queryDestinationDetail,
  exportDestinationList,
} from '@/api/basicInfo/destination.js'
defineOptions({ name: 'Destination' })

const $q = useQuasar()
const { t } = useI18n()
const { tableColumns, filters } = useBasicInfo()

const tableRef = ref(null)
const baseInfoFormRef = ref(null)
const filterBarRef = ref(null)
const filtersValue = ref({})
const dialogTitle = ref(t('common.add'))
const rowInfo = ref({})
function search(val) {
  filtersValue.value = val
  tableRef.value.refresh()
}
const show = ref(false)
// 新增
function handleAdd() {
  rowInfo.value = {}
  dialogTitle.value = t('common.add')
  show.value = true
}
// 删除
function handelDelete(row) {
  console.log(row)
  $q.dialog({
    title: t('sys.prompt'),
    message: t('sys.deleteConfirm'),
    cancel: true,
    persistent: true,
    html: true,
  }).onOk(async () => {
    await deleteSingleDestination(row.id)
  })
}
async function deleteSingleDestination(id) {
  try {
    const { message, code } = await deleteDestination({ id })
    if (code === 200) {
      showSuccess(message)
      tableRef.value.refresh()
    }
  } catch (err) {
    if (resErrCode[err?.code] && err?.code) {
      showError(t(`${resErrCode[err?.code]}`))
    } else {
      showError(err?.msg ?? err?.message ?? err)
    }
  }
}
async function handleCellClick(row, col) {
  if (col.name === 'destination_code') {
    const { data = {}, code } = await queryDestinationDetail({
      id: row.id,
    })
    if (code === 200) {
      rowInfo.value = { ...data }
      dialogTitle.value = t('common.edit')
      show.value = true
    }
  }
}
async function handleDownload() {
  const params = filterBarRef.value.getValue()
  try {
    const { data, code } = await exportDestinationList(params)
    if (code === 200) {
      window.location.href = data
    }
  } catch (error) {
    console.error(error)
  }
}

function tableApi({ page, rowsPerPage }) {
  return new Promise((resolve, reject) => {
    getDestinationList({
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

async function onDialogConfirm() {
  try {
    const baseInfoFormValidStatus = await baseInfoFormRef.value.validate()
    if (baseInfoFormValidStatus) {
      const handleParams = baseInfoFormRef.value.baseInfoForm
      const { code, message } =
        dialogTitle.value === t('common.add')
          ? await addDestination(handleParams)
          : await editDestination({
              id: rowInfo.value.id,
              ...handleParams,
            })
      if (code === 200) {
        showSuccess(message)
        show.value = false
        tableRef.value.refresh()
      }
    }
  } catch (err) {
    if (resErrCode[err?.code] && err?.code) {
      showError(t(`${resErrCode[err?.code]}`))
    } else {
      showError(err?.msg ?? err?.message ?? err)
    }
  }
}
function onDialogCancel() {
  if (baseInfoFormRef.value && !baseInfoFormRef.value.isObjEqual()) {
    $q.dialog({
      title: t('sys.prompt'),
      message: t('sys.unsavedChanges'),
      cancel: true,
      persistent: true,
      html: true,
    }).onOk(async () => {
      show.value = false
    })
    return
  }
  show.value = false
}
onMounted(() => {
  filterBarRef.value.submit()
})
</script>
<style scoped lang="scss"></style>
