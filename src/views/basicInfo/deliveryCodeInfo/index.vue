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
      :api="handleGetDeliveryCodeList"
      :columns="columns"
      :download="false"
      @click-cell-button="handleClickCellButton"
    >
      <!-- <template #operation-column="scope">
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
      </template> -->
    </Table>
  </div>
  <AddDialog ref="AddDialogRef" @close-dialog="handleCloseDialog" />
  <DetailDialog ref="DetailDialogRef" @close-dialog="handleCloseDialog" />
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import AddDialog from './components/AddDialog.vue'
import DetailDialog from './components/DetailDialog.vue'
import { useDeliveryCodeInfo } from './deliveryCodeInfo'

import Form from '@/components/Form/index.vue'
import Table from '@/components/Table/index.vue'
import { getDeliveryCodeList } from '@/api/basicInfo/deliveryCode'
import { strSplit2Array, removeEmptyValues } from '@/utils/helper'
// import { showSuccess } from '@/components'

defineOptions({ name: 'DeliveryCodeInfo' })

const { t } = useI18n()
const { deliveryCodeTableColumns, deliveryCodeSearchForm } =
  useDeliveryCodeInfo()

const formSchemas = ref(deliveryCodeSearchForm)

const columns = ref(deliveryCodeTableColumns)
const tableRef = ref()
const formRef = ref(null)
const formValue = ref({})
const AddDialogRef = ref(null)
const DetailDialogRef = ref(null)

function search(val) {
  formValue.value = val
  tableRef.value.refresh()
}

function reset() {}

function handleClickCellButton(row, col) {
  if (col.name === 'delivery_code') {
    handleEdit(row)
  }
}

function handleCloseDialog(status) {
  reset()

  if (status) {
    tableRef.value.refresh()
  }
}

function handleAdd() {
  AddDialogRef.value.show = true
}

function handleEdit(row) {
  DetailDialogRef.value.show = true
  DetailDialogRef.value.rowInfo = row

  nextTick(() => {
    DetailDialogRef.value.baseInfoRef.handleRestore(row)
    DetailDialogRef.value.destinationInfoRef.handleRestore(row)
  })
}

function handleFetchParams() {
  const { delivery_code, is_enabled, update_time, updated_by } = formValue.value

  let params = {
    delivery_codes: strSplit2Array(delivery_code),
    is_enabled,
    updated_by,
  }
  if (update_time) {
    params.from_updated_at = update_time[0]
    params.to_updated_at = update_time[1]
  }
  params = removeEmptyValues(params)

  return params
}

async function handleGetDeliveryCodeList({ page, rowsPerPage }) {
  let params = handleFetchParams()

  params.page_num = page
  params.page_size = rowsPerPage

  return new Promise((resolve, reject) => {
    getDeliveryCodeList(params)
      .then(res => {
        resolve({ data: res.data.list ?? [], count: res.data.page_num_total })
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
