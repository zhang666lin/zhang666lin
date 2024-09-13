<template>
  <div class="row q-pt-xs q-pb-xs">
    <div class="text-subtitle1 q-pt-md text-primary text-weight-bold">
      {{ t('common.baseInfo') }}
    </div>
  </div>

  <div class="lh q-pl-md q-pr-md q-mb-xs">
    <div class="row">
      <div class="col">
        {{ t('common.carrierRef') }}：{{ detailInfor.carrier_ref || '-' }}
      </div>
      <div class="col">
        {{ t('common.skNo') }}：{{ detailInfor.sk_no || '-' }}
      </div>
      <div class="col">
        {{ t('common.customer') }}：{{ detailInfor.customer || '-' }}
      </div>
      <div class="col">{{ t('common.isBatch') }}：{{ isBatchText }}</div>
      <div class="col">
        {{ t('common.batchAmount') }}：{{ detailInfor.batch_amount }}
      </div>
    </div>
    <div class="row">
      <div class="col">
        {{ t('common.flightNumber') }}：{{ detailInfor.flight_number || '-' }}
      </div>
      <div class="col">
        {{ t('common.consignFrom') }}：{{
          detailInfor.flight_departure_airport || '-'
        }}
      </div>
      <div class="col">
        {{ t('common.protOfArrival') }}：{{
          detailInfor.port_of_arrival || '-'
        }}
      </div>
      <div class="col">
        {{ t('common.warehouse') }}：{{ detailInfor.warehouse || '-' }}
      </div>
      <div class="col">
        {{ t('common.customBroker') }}：{{ detailInfor.custom_broker || '-' }}
      </div>
    </div>
    <div class="row">
      <div class="col">
        {{ t('common.senderName') }}：{{ detailInfor.sender?.name || '-' }}
      </div>
      <div class="col">
        {{ t('common.masterBillRecipient') }}：{{
          detailInfor.master_bill_recipient || '-'
        }}
      </div>
      <div class="col">
        {{ t('common.masterBillPhone') }}：{{
          detailInfor.master_bill_phone || '-'
        }}/
        {{ detailInfor.master_bill_email || '-' }}
      </div>
      <div class="col">
        {{ t('common.serviceCode') }}：{{ detailInfor.service_code || '-' }}
      </div>
      <div class="col">
        {{ t('common.masterBillAmount') }}：{{ detailInfor.master_bill_amount }}
      </div>
    </div>
    <div class="row">
      <div class="col">
        {{ t('common.subBillAmount') }}：{{ detailInfor.sub_bill_amount }}
      </div>
      <div class="col">
        {{ t('common.masterBillWeight') }}：{{
          detailInfor.master_bill_weight
            ? gramsToKilograms(detailInfor.master_bill_weight)
            : '-'
        }}
      </div>
      <div class="col">
        {{ t('common.createAt') }}:
        {{ convertTz(detailInfor.order_time) || '-' }}
      </div>
      <div class="col"></div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import useData from '../useData'

import { convertTz } from '@/utils/time.js'
import { gramsToKilograms } from '@/utils'

const { t } = useI18n()

const props = defineProps({
  detailInfor: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const { isBatchedList } = useData()
const isBatchText = computed(
  () =>
    isBatchedList.value.find(item => item.value === props.detailInfor.is_batch)
      ?.label || '-',
)
</script>

<style lang="scss" scoped>
.lh {
  line-height: 40px;
}
</style>
