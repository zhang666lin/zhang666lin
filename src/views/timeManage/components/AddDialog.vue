<template>
  <Dialog
    v-model="show"
    :title="t('menu.timeManage')"
    :content-style="{
      minWidth: '1200px',
      minHeight: '620px',
    }"
    @confirm="handleSubmit"
    @cancel="show = false"
  >
    <div class="fit column no-wrap">
      <div class="row q-ml-sm q-mb-sm items-center">
        {{ t('common.operator') }}: {{ userInfo.name }}
      </div>
      <div class="row">
        <div class="col-5 q-pl-sm">
          <q-tabs
            v-model="tabsValue"
            class="text-grey-8 bg-primary-3"
            active-color="primary"
            indicator-color="primary"
            align="left"
          >
            <q-tab name="awb" no-caps :label="t('common.carrierRef')" />
            <q-tab name="opk" no-caps :label="t('common.bulkNo')" />
            <q-tab name="pcl" no-caps :label="t('common.flatNo')" />
          </q-tabs>
          <q-separator />
          <AwbTab
            v-if="tabsValue === 'awb'"
            ref="awbTabRef"
            class="col"
            :wah="wah"
            @set-type-and-no="setTypeAndNo"
          />
          <OpkTab
            v-if="tabsValue === 'opk'"
            ref="opkTabRef"
            class="col"
            @set-type-and-no="setTypeAndNo"
          />
          <PclTab
            v-if="tabsValue === 'pcl'"
            ref="pclTabRef"
            class="col"
            @set-type-and-no="setTypeAndNo"
          />
        </div>
        <div class="col-7 q-pl-md time-select-panel">
          <template v-if="tabsValue === 'awb'">
            <div class="subtitle">{{ t('common.flight') }}:</div>
            <div class="time-item">
              <div class="label">{{ t('common.atd') }}</div>
              <el-date-picker
                v-model="atd"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="t('sys.plsSelectTime')"
                size="large"
              />
            </div>
            <div class="time-item">
              <div class="label">{{ t('common.ata') }}</div>
              <el-date-picker
                v-model="ata"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="t('sys.plsSelectTime')"
                size="large"
              />
            </div>
          </template>
          <div class="subtitle">{{ t('common.customTime') }}:</div>
          <div class="time-item">
            <div class="label">{{ t('common.customTime') }}</div>
            <el-date-picker
              v-model="custom_time"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="t('sys.plsSelectTime')"
              size="large"
            />
            <q-checkbox
              v-if="tabsValue !== 'pcl'"
              v-model="checkedList"
              size="xs"
              :val="3"
              :label="t('timeManage.noUpdateInspection')"
            />
          </div>
          <div class="subtitle">{{ t('common.warehouse') }}:</div>
          <div v-if="tabsValue !== 'pcl'" class="time-item">
            <div class="label">{{ t('common.pickupTime') }}</div>
            <el-date-picker
              v-model="pickup_time"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="t('sys.plsSelectTime')"
              size="large"
            />
          </div>
          <div v-if="tabsValue !== 'pcl'" class="time-item">
            <div class="label">{{ t('common.arrivalTime') }}</div>
            <el-date-picker
              v-model="arrival_time"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="t('sys.plsSelectTime')"
              size="large"
            />
          </div>
          <div class="time-item">
            <div class="label">{{ t('common.inboundTime') }}</div>
            <el-date-picker
              v-model="inbound_time"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="t('sys.plsSelectTime')"
              size="large"
            />
          </div>
          <div v-if="tabsValue !== 'pcl'" class="time-item">
            <div class="label">{{ t('common.readyForHandover') }}</div>
            <el-date-picker
              v-model="ready_for_handover_time"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="t('sys.plsSelectTime')"
              size="large"
            />
          </div>
          <div class="time-item">
            <div class="label">{{ t('common.outboundTime') }}</div>
            <el-date-picker
              v-model="outbound_time"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="t('sys.plsSelectTime')"
              size="large"
            />
            <q-checkbox
              v-if="tabsValue !== 'pcl'"
              v-model="checkedList"
              size="xs"
              :val="8"
              :label="t('timeManage.noUpdateInspection')"
            />
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import AwbTab from './AwbTab.vue'
import OpkTab from './OpkTab.vue'
import PclTab from './PclTab.vue'

import { showError, showSuccess } from '@/components'
import { useUserStore } from '@/store/modules/user'
import { timeManageSumbitApi } from '@/api/timeManage'
import { convertUtc, getPortTz } from '@/utils/time.js'
import Dialog from '@/components/Dialog/index.vue'

defineOptions({ name: 'TimeManage' })
const emits = defineEmits(['success'])
const { t } = useI18n()
const $q = useQuasar()
const userStore = useUserStore()
const userInfo = userStore.getUserInfo
const atd = ref(null)
const ata = ref(null)
const custom_time = ref(null)
const pickup_time = ref(null)
const arrival_time = ref(null)
const inbound_time = ref(null)
const ready_for_handover_time = ref(null)
const outbound_time = ref(null)
const show = ref(false)
function open() {
  tabsValue.value = 'awb'
  show.value = true
}

const errorMsgArr = ref([])
function reset() {
  atd.value = null
  ata.value = null
  custom_time.value = null
  pickup_time.value = null
  arrival_time.value = null
  inbound_time.value = null
  ready_for_handover_time.value = null
  outbound_time.value = null
}
const tabsValue = ref('awb')
watch(tabsValue, val => {
  reset()
  if (val === 'pcl') {
    checkedList.value = []
  } else {
    checkedList.value = [3, 8]
  }
})

const awbTabRef = ref(null)
const opkTabRef = ref(null)
const pclTabRef = ref(null)
function handleSubmit() {
  // 校验左侧 tabs 是否填了内容
  if (tabsValue.value === 'awb' && !awbTabRef.value.validate()) {
    return
  }
  if (tabsValue.value === 'opk' && !opkTabRef.value.validate()) {
    return
  }
  if (tabsValue.value === 'pcl' && !pclTabRef.value.validate()) {
    return
  }
  // 校验所有时间
  if (
    !atd.value &&
    !ata.value &&
    !custom_time.value &&
    !pickup_time.value &&
    !arrival_time.value &&
    !inbound_time.value &&
    !ready_for_handover_time.value &&
    !outbound_time.value
  ) {
    return showError(t('timeManage.noTimes'))
  }
  $q.dialog({
    title: t('sys.prompt'),
    message: t('sys.submitTip'),
  }).onOk(() => {
    submit()
  })
}

const currentPort = userStore.getPort
const port_list = userInfo?.port_list || []
const wah = computed(() => {
  const wah_list =
    port_list.find(item => item.code === currentPort.value)?.wah_list || []
  return wah_list[0] || {}
})
const checkedList = ref([3, 8]) // 默认勾选 Customs released 和 Outbound, 不更新检查件
const portTz = getPortTz(currentPort.value)

function submit() {
  $q.loading.show()
  timeManageSumbitApi({
    wah_code: wah.value.code || '',
    port_code: currentPort.value,
    data_type: dataType.value,
    sk_no: skNo.value,
    atd: atd.value || null,
    ata: ata.value || null,
    custom_time: custom_time.value && convertUtc(custom_time.value, portTz),
    pickup_time: pickup_time.value && convertUtc(pickup_time.value, portTz),
    arrival_time: arrival_time.value && convertUtc(arrival_time.value, portTz),
    inbound_time: inbound_time.value && convertUtc(inbound_time.value, portTz),
    ready_for_handover_time:
      ready_for_handover_time.value &&
      convertUtc(ready_for_handover_time.value, portTz),
    outbound_time:
      outbound_time.value && convertUtc(outbound_time.value, portTz),
    skip_customs_parcel_time_name: checkedList.value,
  })
    .then(res => {
      errorMsgArr.value = generateErrorMsgs(res.data)
      if (errorMsgArr.value.length === 0) {
        showSuccess(t('sys.submitSuccess'))
        show.value = false
        emits('success')
        reset()
      } else {
        $q.dialog({
          title: t('sys.prompt'),
          message:
            t('common.handleFailed') +
            ':<br/>' +
            errorMsgArr.value.join('<br/>'),
          html: true,
        })
      }
    })
    .finally(() => {
      $q.loading.hide()
    })
}
function generateErrorMsgs(data) {
  const errorArr = []
  data.common_error.forEach(i => {
    const no = Object.keys(i)[0]
    if (i[no] === 50001) {
      errorArr.push(`[${no}]` + t('timeManage.scanInvalid'))
    } else {
      errorArr.push(`[${no}]unknown error`)
    }
  })
  return errorArr
}
const dataType = ref(2)
const skNo = ref([])
function setTypeAndNo(val) {
  dataType.value = val.dataType
  skNo.value = val.skNo
}
defineExpose({ open })
</script>

<style lang="scss" scoped>
.subtitle {
  font-size: 16px;
  font-weight: 600;
}
.time-item {
  width: 100%;
  display: flex;
  justify-items: space-between;
  align-items: center;
  margin: 16px 0;
  .label {
    min-width: 180px;
  }
  .q-checkbox {
    max-width: 220px;
  }
}
</style>
