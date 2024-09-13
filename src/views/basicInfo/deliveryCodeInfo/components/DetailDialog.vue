<template>
  <Dialog
    v-model="show"
    :title="rowInfo.delivery_code"
    :content-style="contentStyle"
    :show-extra-btn="isDestinationInfoTab"
    @confirm="handleOk"
    @cancel="handleCancel"
    @extra-btn-click="handleExtraBtnClick"
  >
    <div class="dialog-content q-px-md">
      <div class="q-gutter-y-md" style="max-width: 55vw">
        <q-tabs v-model="activeTab" inline-label class="text-teal">
          <q-tab name="baseInfo" :label="t('common.baseInfo')" />
          <q-tab
            name="destinationInfo"
            :label="t('baseInfo.destinationInfo')"
          />
        </q-tabs>
        <BaseInfo v-show="!isDestinationInfoTab" ref="baseInfoRef" />
        <DestinationInfo
          v-show="isDestinationInfoTab"
          ref="destinationInfoRef"
        />
      </div>
    </div>
  </Dialog>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
import { Dialog as QuasarDialog } from 'quasar'

import BaseInfo from './BaseInfo.vue'
import DestinationInfo from './DestinationInfo.vue'

import { updateDeliveryCode } from '@/api/basicInfo/deliveryCode'
import Dialog from '@/components/Dialog/index.vue'
import { showSuccess, showError, showWarning } from '@/components'

const emit = defineEmits(['closeDialog'])

const { t } = useI18n()

const baseInfoRef = ref(null)
const destinationInfoRef = ref(null)

const activeTab = ref('baseInfo')
const rowInfo = ref({})

const isDestinationInfoTab = computed(() => {
  return activeTab.value === 'destinationInfo'
})

const contentStyle = ref({
  'max-width': '60vw',
  width: '60vw',
})

function reset() {
  activeTab.value = 'baseInfo'
}

function handleDetailIsChange() {
  const target = {
    ...baseInfoRef.value.baseInfoForm,
    destinations: destinationInfoRef.value.destinationInfoForm,
  }

  const { delivery_code, is_enabled, remark, destinations } = rowInfo.value
  const rawObject = { delivery_code, is_enabled, remark, destinations }
  return _.isEqual(target, rawObject)
}

function handleCancel() {
  if (!handleDetailIsChange()) {
    QuasarDialog.create({
      title: 'tips',
      message: t('sys.unsavedChanges'),
      ok: { noCaps: true },
      cancel: { flat: true, noCaps: true },
    })
      .onOk(() => {
        reset()
        handleCloseDialog()
        emit('closeDialog', false)
      })
      .onCancel(() => {})
  } else {
    reset()
    handleCloseDialog()
    emit('closeDialog', false)
  }
}
const show = ref(false)
function handleCloseDialog() {
  show.value = false
}
async function handleOk(isSubmitApply) {
  let params = {}
  let res = null
  if (!isDestinationInfoTab.value) {
    const valid = await baseInfoRef.value.baseInfoFormRef.validate()
    if (valid) {
      params = baseInfoRef.value.baseInfoForm
    } else {
      return
    }
  } else {
    const valid = await destinationInfoRef.value.destinationFormRef.validate()
    if (valid) {
      const { is_enabled, delivery_code } = rowInfo.value
      params.is_enabled = is_enabled
      params.delivery_code = delivery_code
      params.destinations = destinationInfoRef.value.destinationInfoForm.map(
        des => {
          const { destination_id, is_enabled, apply_warehouses } = des
          return { destination_id, is_enabled, apply_warehouses }
        },
      )
      // 只能有一个启用的目的地
      const filterDesList = params.destinations.filter(des => des.is_enabled)
      if (filterDesList.length > 1) {
        showWarning(t('baseInfo.onlyOneEnabledDestination'))
        return
      }
    } else {
      return
    }
  }
  params.id = rowInfo.value.id
  if (isSubmitApply) {
    params.submit_apply = true
  }
  try {
    res = await updateDeliveryCode(params)
    if (res.code === 200) {
      showSuccess(t('sys.submitSuccess'))

      handleCloseDialog()
      emit('closeDialog', true)
    }
  } catch (err) {
    showError(err?.msg ?? err?.message ?? err)
  }
}
async function handleExtraBtnClick() {
  handleOk(true)
}

defineExpose({
  show,
  rowInfo,
  baseInfoRef,
  destinationInfoRef,
})
</script>
<style scoped lang="scss">
.dialog-content {
  min-height: 45vh;
  overflow-y: auto;
}
</style>
