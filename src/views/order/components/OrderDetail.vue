<template>
  <q-dialog
    v-model="show"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="dialog-size">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ t('order.details') }}
          (<span class="text-primary">{{ ladingBillCode }}</span
          >)
        </div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense @click="onReset" />
      </q-card-section>
      <q-card-section
        style="max-height: 80vh; max-width: 90vw"
        class="scroll q-pt-none"
      >
        <div class="q-ml-md q-mr-md">
          <!-- 流程图 -->
          <FlowChart :data="flowInfo" :data-info="dataInfo" />
          <!-- // 基础信息 -->
          <BaseInfo :detail-infor="baseInfo" />
          <!-- 收件人列表 -->
          <RecipientList :row="rowInfo" :source="source" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import FlowChart from './FlowChart.vue'
import BaseInfo from './BaseInfo.vue'
import RecipientList from './RecipientList.vue'

import { getOrderDetailApi } from '@/api/order'
import { convertTz } from '@/utils/time.js'

defineProps({
  // 由于申报信息的详情弹窗与订单详情弹窗共用，但显示内容不同，所以需要区分
  source: {
    type: String,
    default: '',
  },
})
const { t } = useI18n()

// 弹框显隐
const show = ref(false)
// 提单号
const ladingBillCode = ref('')
// 流程图
const dataInfo = ref([])
const flowInfo = ref({})
// 基础信息
const baseInfo = ref({})
// 收件人列表
// const recipientList = ref({})
// 初始化视图

const rowInfo = ref({}) // 行信息

function open(row) {
  show.value = true
  ladingBillCode.value = row.carrier_ref || ''
  flowInfo.value = {}
  getOrderDetail(row.id)
  rowInfo.value = row
}
// 关闭弹窗
function onReset() {
  show.value = false
}
// 将树形结构数据转为G6需要的的数据结构
function convertToG6Datas(data) {
  const edges = []
  const nodes = []
  const changeText = (item, key, code) => {
    if (item[key] && item[code]) {
      return convertTz(item[key], item[code])
    } else if (item[key] && !item[code]) {
      // 无时区
      return item[key]
    }
    return ''
  }
  const changeTz = (item, key, code) => {
    if (item[key] && item[code]) {
      return item[code]
    }
    return ''
  }
  data.forEach((o, index) => {
    Object.keys(o).forEach(key => {
      if (key === 'etd' && index === 0) {
        nodes.push({
          id: '1',
          bottomText: 'ETD',
          active: !!o[key],
          topText1: changeTz(o, key, 'etd_tz'),
          topText2: changeText(o, key, 'etd_tz'),
        })
      } else if (key === 'atd' && index === 0) {
        nodes.push({
          id: '2',
          bottomText: 'ATD',
          active: !!o[key],
          topText1: changeTz(o, key, 'atd_tz'),
          topText2: changeText(o, key, 'atd_tz'),
        })
        edges.push({ source: '1', target: '2' })
      } else if (key === 'eta' && index === 0) {
        nodes.push({
          id: '3',
          bottomText: 'ETA',
          active: !!o[key],
          topText1: changeTz(o, key, 'eta_tz'),
          topText2: changeText(o, key, 'eta_tz'),
        })
        edges.push({ source: '2', target: '3' })
      } else if (key === 'ata') {
        nodes.push({
          id: '4-' + (index + 1),
          bottomText: 'ATA',
          active: !!o[key],
          topText1: changeTz(o, key, 'ata_tz'),
          topText2: changeText(o, key, 'ata_tz'),
        })
        edges.push({
          source: '3',
          target: '4-' + (index + 1),
          code: o.batch_no,
        })
      } else if (key === 'noa') {
        nodes.push({
          id: '5-' + (index + 1),
          bottomText: 'NOA',
          active: !!o[key],
          topText1: changeTz(o, key, 'noa_tz'),
          topText2: changeText(o, key, 'noa_tz'),
        })
        edges.push({
          source: '4-' + (index + 1),
          target: '5-' + (index + 1),
        })
      } else if (key === 'pickup_time') {
        nodes.push({
          id: '6-' + (index + 1),
          bottomText: t('common.pickupTime'),
          active: !!o[key],
          topText1: changeTz(o, key, 'pickup_time_tz'),
          topText2: changeText(o, key, 'pickup_time_tz'),
        })
        edges.push({
          source: '5-' + (index + 1),
          target: '6-' + (index + 1),
        })
      } else if (key === 'arrival_time') {
        nodes.push({
          id: '7-' + (index + 1),
          bottomText: t('common.arrivalTime'),
          active: !!o[key],
          topText1: changeTz(o, key, 'arrival_time_tz'),
          topText2: changeText(o, key, 'arrival_time_tz'),
        })
        edges.push({
          source: '6-' + (index + 1),
          target: '7-' + (index + 1),
        })
      } else if (key === 'custom_clearance_rate') {
        nodes.push({
          id: '8-' + (index + 1),
          bottomText: t('common.customsClearanceQuantity'),
          active: Number(o[key].split('/')[0]) > 0,
          topText: o[key],
        })
        edges.push({
          source: '7-' + (index + 1),
          target: '8-' + (index + 1),
        })
      } else if (key === 'instock_rate') {
        nodes.push({
          id: '9-' + (index + 1),
          bottomText: t('order.inboundProgress'),
          active: Number(o[key].split('/')[0]) > 0,
          topText: o[key],
        })
        edges.push({
          source: '8-' + (index + 1),
          target: '9-' + (index + 1),
        })
      } else if (key === 'ready_for_handover_time') {
        nodes.push({
          id: '10-' + (index + 1),
          bottomText: t('common.readyForHandover'),
          active: !!o[key],
          topText1: changeTz(o, key, 'ready_for_handover_time_tz'),
          topText2: changeText(o, key, 'ready_for_handover_time_tz'),
        })
        edges.push({
          source: '9-' + (index + 1),
          target: '10-' + (index + 1),
        })
      } else if (key === 'outstock_rate') {
        nodes.push({
          id: '11-' + (index + 1),
          bottomText: t('order.outboundProgress'),
          active: Number(o[key].split('/')[0]) > 0,
          topText: o[key],
        })
        edges.push({
          source: '10-' + (index + 1),
          target: '11-' + (index + 1),
        })
      }
    })
  })
  return { nodes, edges }
}
function getOrderDetail(waybill_id) {
  getOrderDetailApi(waybill_id)
    .then(res => {
      dataInfo.value = res.data.track || []
      flowInfo.value = convertToG6Datas(res.data.track) || {}
      baseInfo.value = res.data.basic_info
    })
    .catch(err => {
      console.error(err)
    })
}
defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.dialog-size {
  width: 90vw;
  max-width: 1800px;
}
</style>
