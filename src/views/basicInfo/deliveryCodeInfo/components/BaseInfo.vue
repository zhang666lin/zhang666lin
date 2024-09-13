<template>
  <div class="dialog-content q-px-md">
    <q-form ref="baseInfoFormRef" class="" autocomplete="off">
      <div class="row q-gutter-lg">
        <div class="col">
          <q-input
            v-model="baseInfoForm.delivery_code"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            debounce="500"
            :label="`*${t('common.deliveryCode')}`"
            :maxlength="50"
            :rules="[required]"
          />
        </div>

        <div class="col">
          <Select
            v-model="baseInfoForm.is_enabled"
            :rules="[required]"
            :label="`*${t('common.isEnabled')}`"
            :options="enableOptions"
          />
        </div>
      </div>
      <div class="row q-gutter-lg">
        <div class="col">
          <q-input
            v-model="baseInfoForm.remark"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            debounce="500"
            :label="t('common.remark')"
            :maxlength="200"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

import { useDeliveryCodeInfo } from '../deliveryCodeInfo'

import { required } from '@/utils/formValidRule'
import Select from '@/components/Select/index.vue'

// const props = defineProps({
//   operateTyep: {
//     type: String,
//     default: 'add',
//   },
// })

const { t } = useI18n()
const { enableOptions } = useDeliveryCodeInfo()

const baseInfoForm = ref({})
const baseInfoFormRef = ref(null)

function handleRestore(row) {
  const { delivery_code, is_enabled, remark } = row
  baseInfoForm.value = {
    delivery_code,
    is_enabled,
    remark,
  }
}

defineExpose({ baseInfoFormRef, baseInfoForm, handleRestore })
</script>
<style scoped lang="scss">
.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
