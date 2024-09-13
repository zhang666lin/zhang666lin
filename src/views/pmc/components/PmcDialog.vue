<template>
  <q-dialog
    v-model="show"
    persistent
    transition-show="scale"
    transition-hide="scale"
    style="z-index: 3000"
    allow-focus-outside
  >
    <q-card class="dialog-size">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ dialogTitle }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section
        style="max-height: 70vh; min-height: 200px"
        class="scroll q-py-none"
      >
        <q-form ref="formRef" class="row q-mx-md" @submit="onSubmit">
          <div class="row justify-between items-center full-width q-my-sm">
            <q-input
              v-model="form.pmc_no"
              :label="'*' + t('common.pmcNo')"
              class="col-4 q-px-sm q-pb-md"
              style="max-width: 240px"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :rules="[required]"
            />
            <MultipleSelect
              ref="carrierSelectRef"
              v-model="form.waybill_id"
              class="col-4 q-px-sm q-pb-md"
              style="max-width: 240px"
              :multiple="false"
              :schema="{
                label: '*' + t('common.carrierRef'),
                apiURL: '/api/v1/uld/inbound/choice',
                optionLabel: 'carrier_ref',
                optionValue: 'waybill_id',
                options: [
                  {
                    carrier_ref: form.carrier_ref,
                    waybill_id: form.waybill_id,
                  },
                ],
                rules: [required],
              }"
            />
            <MultipleSelect
              ref="batchSelectRef"
              v-model="form.batch_id"
              class="col-4 q-px-sm q-pb-md"
              style="max-width: 240px"
              :multiple="false"
              :schema="{
                label: t('common.batchNo'),
                apiURL: '/api/v1/uld/inbound/choice',
                disable: !form.carrier_ref,
                optionLabel: 'batch_no',
                optionValue: 'batch_id',
                options: [
                  {
                    batch_no: form.batch_no,
                    batch_id: form.batch_id,
                  },
                ],
              }"
              :api-params="{
                carrier_ref: form.carrier_ref,
              }"
              @update:model-value="setBatchNo"
            />
          </div>
          <div class="row justify-between items-center full-width q-my-sm">
            <q-input
              v-model="form.airline_name"
              :label="t('common.airlineName')"
              class="col-4 q-px-sm q-pb-md"
              :disable="true"
              style="max-width: 240px"
              outlined
              dense
              bg-color="white"
            />
            <q-input
              v-model="form.ground_name"
              :label="t('common.gha')"
              class="col-4 q-px-sm q-pb-md"
              style="max-width: 240px"
              :disable="true"
              outlined
              dense
              bg-color="white"
            />
            <div class="col-4 q-px-sm q-pb-md" style="max-width: 240px"></div>
          </div>
          <div class="row justify-between items-center full-width q-my-sm">
            <el-date-picker
              v-model="form.ata"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="t('common.ata')"
              size="large"
              class="col-4 q-px-sm q-mb-md"
              style="max-width: 240px"
            />
            <el-date-picker
              v-model="form.deadline"
              type="date"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="t('common.deadlineTime')"
              size="large"
              class="col-4 q-px-sm q-mb-md"
              style="max-width: 240px"
            />
            <el-date-picker
              v-model="form.actual_return_time"
              type="date"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="t('common.actualReturnTime')"
              size="large"
              class="col-4 q-px-sm q-mb-md"
              style="max-width: 240px"
            />
          </div>
          <q-input
            v-model="form.remark"
            :label="t('common.remark')"
            type="textarea"
            class="full-width q-my-sm q-px-sm"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            :rules="[
              val =>
                !val || val.length <= 200
                  ? true
                  : t('sys.atMostLetterNum', [200]),
            ]"
          />
          <div class="row justify-between items-center full-width q-mb-md">
            <q-file
              v-model="form.cmr"
              outlined
              dense
              :label="t('common.cmr')"
              class="col-4 q-px-sm q-pb-md"
              style="max-width: 240px"
              :max-file-size="5 * 1024 * 1024"
              clearable
              :loading="cmrFileLoading"
              @rejected="fileRejected"
              @update:model-value="updateCmrFile"
            >
              <template #prepend>
                <q-icon name="attach_file" />
              </template>
              <template #file="{ file }">
                <div
                  v-overflow-tooltip="{ placement: 'bottom' }"
                  class="ellipsis relative-position"
                >
                  {{ getFilenameByLink(file.name) }}
                </div>
              </template>
            </q-file>
            <q-file
              v-model="form.pod"
              outlined
              dense
              :label="t('common.pod')"
              class="col-4 q-px-sm q-pb-md"
              style="max-width: 240px"
              :max-file-size="5 * 1024 * 1024"
              clearable
              :loading="podFileLoading"
              @rejected="fileRejected"
              @update:model-value="updatePodFile"
            >
              <template #prepend>
                <q-icon name="attach_file" />
              </template>
              <template #file="{ file }">
                <div
                  v-overflow-tooltip="{ placement: 'bottom' }"
                  class="ellipsis relative-position"
                >
                  {{ getFilenameByLink(file.name) }}
                </div>
              </template>
            </q-file>
            <div class="col-4 q-px-sm q-pb-md" style="max-width: 240px"></div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions class="q-pa-md" align="right">
        <q-btn v-close-popup no-caps :label="t('sys.cancel')" />
        <q-btn
          no-caps
          :label="t('sys.submit')"
          color="primary"
          @click="formRef?.submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loading } from 'quasar'

import { convertUtc, convertTz, getPortTz } from '@/utils/time'
import { showError, showSuccess, showWarning } from '@/components'
import { uploadFileApi, addPmcApi, editPmcApi } from '@/api/pmc'
import MultipleSelect from '@/components/Select/MultipleSelect.vue'
import { required } from '@/utils/formValidRule'

const emits = defineEmits(['success'])
const { t } = useI18n()
const show = ref(false)
const formRef = ref(null)
const form = ref({})
const type = ref('')

const dialogTitle = computed(() => {
  return type.value === 'add'
    ? t('pmc.addDialogTitle')
    : t('pmc.editDialogTitle')
})

const port = ref('')
const id = ref('')
function getFilenameByLink(link) {
  return link ? link.split('/').pop() : ''
}
function open(val, consigned_to_ehub, row) {
  port.value = consigned_to_ehub
  id.value = row?.id
  type.value = val
  const temp = { ...row }
  temp.ata = temp.ata ? convertTz(temp.ata, temp.ata_tz || null) : null
  temp.deadline = temp.deadline
    ? convertTz(temp.deadline, temp.deadline_tz || null)
    : null
  temp.actual_return_time = temp.actual_return_time
    ? convertTz(temp.actual_return_time, temp.actual_return_time_tz || null)
    : null
  if (temp.pod_link) {
    temp.pod = new File([temp.pod_link], temp.pod_link)
  }
  if (temp.cmr_link) {
    temp.cmr = new File([temp.cmr_link], temp.cmr_link)
  }
  if (row) {
    form.value = temp
  } else {
    form.value = {}
  }
  show.value = true
}
function onSubmit() {
  const portTz = getPortTz(port.value)
  const params = { ...form.value }
  params.deadline = params.deadline ? convertUtc(params.deadline, portTz) : null
  params.deadline_tz = params.deadline ? portTz : null

  params.actual_return_time = params.actual_return_time
    ? convertUtc(params.actual_return_time, portTz)
    : null
  params.actual_return_time_tz = params.actual_return_time ? portTz : null

  params.ata = params.ata ? convertUtc(params.ata, portTz) : null
  params.ata_tz = params.ata ? portTz : null

  delete params.cmr
  delete params.pod
  if (!params.batch_id || params.batch_id.length === 0) {
    params.batch_id = null
    params.batch_no = ''
  }
  formRef.value
    .validate()
    .then(() => {
      if (type.value === 'add') {
        Loading.show()
        addPmcApi(params)
          .then(() => {
            showSuccess(t('sys.submitSuccess'))
            emits('success')
            show.value = false
          })
          .catch(err => {
            if (err.code === 70001) {
              showError(t('pmc.duplicateError'))
            } else if (err.code === 70003) {
              showError(t('pmc.emptyError'))
            } else {
              showError(err?.msg ?? err?.message ?? err)
            }
          })
          .finally(() => {
            Loading.hide()
          })
      } else {
        delete params.updated_at
        editPmcApi(id.value, params)
          .then(() => {
            showSuccess(t('sys.submitSuccess'))
            emits('success')
            show.value = false
          })
          .catch(err => {
            showError(err?.msg ?? err?.message ?? err)
          })
          .finally(() => {
            Loading.hide()
          })
      }
    })
    .catch(err => {
      showError(err?.msg ?? err?.message ?? err)
    })
}
const carrierSelectRef = ref(null)
const batchSelectRef = ref(null)
watch(
  () => form.value.waybill_id,
  val => {
    if (!carrierSelectRef.value) return
    const temp = carrierSelectRef.value.filterOptionsRef.find(
      item => item.waybill_id === val,
    )
    form.value.carrier_ref = temp?.carrier_ref
    form.value.airline_name = temp?.airline_name
    form.value.airline_id = temp?.airline_id
    form.value.ground_name = temp?.ground_name
    form.value.ground_handler_id = temp?.ground_handler_id
    form.value.batch_no = ''
    form.value.batch_id = ''
  },
)
const cmrFileLoading = ref(false)
function updateCmrFile(file) {
  if (!file) {
    form.value.cmr_link = null
    return
  }
  cmrFileLoading.value = true
  uploadFileApi(file)
    .then(res => {
      form.value.cmr_link = res.data
    })
    .finally(() => {
      cmrFileLoading.value = false
    })
}
function fileRejected(errors) {
  const firstError = errors[0]
  if (firstError?.failedPropValidation === 'max-file-size') {
    showWarning(t('order.fileSizeLimit', [5]))
  }
}
const podFileLoading = ref(false)
function updatePodFile(file) {
  if (!file) {
    form.value.pod_link = null
    return
  }
  podFileLoading.value = true
  uploadFileApi(file)
    .then(res => {
      form.value.pod_link = res.data
    })
    .finally(() => {
      podFileLoading.value = false
    })
}

function setBatchNo(val) {
  const temp = batchSelectRef.value.filterOptionsRef.find(
    item => item.batch_id === val,
  )
  form.value.batch_no = temp.batch_no
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.dialog-size {
  width: 80vw;
  max-width: 800px;
}
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}
</style>
