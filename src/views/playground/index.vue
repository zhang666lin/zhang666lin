<template>
  <div class="fit overflow-auto column no-wrap items-center justify-center">
    <Select
      v-model="selected"
      :label="t('common.airlineName')"
      multiple
      :remote-config="remoteConfig"
      option-label="carrier_ref"
      option-value="waybill_id"
      local-filter
      allow-add-option
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Select from '@/components/SelectV2/index.vue'
const selected = ref('')
const { t } = useI18n()
const remoteConfig = ref({
  url: '/api/v1/uld/inbound/choice',
  method: 'get',
  params: { consigned_to_ehub: 'FRA' },
  queryField: 'query',
})
</script>
