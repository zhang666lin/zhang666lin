<template>
  <!-- 展开内容的表头 -->
  <q-tr
    v-show="batchInfo.length > 0"
    :class="'text-secondary ' + bgColor"
    :props="scope"
  >
    <q-td v-if="selection !== 'none'" auto-width :class="bgColor"></q-td>
    <template v-for="col in scope.cols" :key="col.name">
      <q-td v-if="col.name === 'carrier_ref'"> </q-td>
      <q-td v-else-if="col.name === 'sk_no'" class="text-center">
        {{ t('common.batchNo') }}
      </q-td>
      <q-td v-else-if="col.name === 'is_batch'" class="text-center" colspan="2">
        {{ t('order.batchType') }}
      </q-td>
      <template v-else-if="col.name === 'batch_amount'"> </template>
      <q-td v-else-if="col.name === 'master_bill_amount'" class="text-center">
        {{ t('order.subBillAmount') }}
      </q-td>
      <q-td v-else-if="col.name === 'master_bill_weight'" class="text-center">
        {{ t('order.batchWeight') }}(KG)
      </q-td>
      <q-td v-else :class="bgColor"> </q-td>
    </template>
  </q-tr>
  <!-- 展开内容的主体-->
  <q-tr
    v-for="(item, index) in batchInfo"
    :key="index"
    :props="scope"
    :class="bgColor"
  >
    <q-td v-if="selection !== 'none'" auto-width :class="bgColor"></q-td>
    <template v-for="col in scope.cols" :key="col.name">
      <q-td v-if="col.name === 'carrier_ref'"> </q-td>
      <q-td v-else-if="col.name === 'sk_no'" class="text-center">
        <q-input
          v-if="
            item.type !== 2 &&
            ((action === 'add' && !item.__readonly) || action === 'edit')
          "
          :ref="'for_validate_' + col.name + '_' + scope.rowIndex"
          v-model.trim="item.batch_no"
          style="width: 200px"
          outlined
          dense
          clearable
          reactive-rules
          bg-color="white"
          debounce="500"
          :maxlength="20"
          :rules="[
            val => validNo(val, 20, true),
            val => repeatedBactchRule(val),
          ]"
        />
        <template v-else>
          {{ item.batch_no || '-' }}
        </template>
      </q-td>
      <q-td v-else-if="col.name === 'is_batch'" class="text-center" colspan="2">
        {{ getBatchTypeLabel(item.type) }}
      </q-td>
      <template v-else-if="col.name === 'batch_amount'"> </template>
      <q-td v-else-if="col.name === 'service_code'" class="text-center"></q-td>
      <q-td
        v-else-if="col.name === 'master_bill_recipient'"
        v-overflow-tooltip="{ offset: [0, -6] }"
        class="text-center ellipsis"
        :style="{ maxWidth: '200px' }"
      >
        {{ item.master_bill_recipient || '-' }}
      </q-td>
      <q-td
        v-else
        :class="'text-center ' + bgColor"
        :style="{
          padding:
            (col.name === 'etd' ||
              col.name === 'eta' ||
              col.name === 'atd' ||
              col.name === 'ata' ||
              col.name === 'noa' ||
              col.name === 'pickup_time' ||
              col.name === 'arrival_time' ||
              col.name === 'ready_for_handover_time') &&
            '0 16px',
        }"
      >
        <template v-if="col.name === 'flight_number'">
          <q-input
            v-if="
              item.type !== 2 &&
              ((action === 'add' && !item.__readonly) || action === 'edit')
            "
            :ref="'for_validate_' + col.name + '_' + scope.rowIndex"
            v-model.trim="item[col.name]"
            style="width: 120px"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            debounce="500"
            :maxlength="10"
            :rules="[val => validNo(val, 10, true)]"
          />
          <span v-else>
            {{ item[col.name] || '-' }}
          </span>
        </template>
        <template
          v-else-if="
            [
              'customer',
              'flight_departure_airport',
              'port_of_arrival',
              'warehouse',
              'custom_broker',
              'sub_bill_amount',
            ].includes(col.name)
          "
        >
          <span>
            {{ item[col.name] ?? '-' }}
          </span>
        </template>
        <template v-else-if="col.name === 'sender'">
          <span>
            {{ item[col.name]?.name ?? '-' }}
          </span>
        </template>
        <template v-else-if="col.name === 'master_bill_phone'">
          <span>
            {{
              `${item.master_bill_phone ?? '-'}/${item.master_bill_email ?? '-'}`
            }}
          </span>
        </template>
        <template v-else-if="col.name === 'master_bill_amount'">
          <q-input
            v-if="(action === 'add' && !item.__readonly) || action === 'edit'"
            :ref="'for_validate_' + col.name + '_' + scope.rowIndex"
            v-model="item.master_bill_amount"
            style="width: 200px"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            debounce="500"
            :maxlength="9"
            :rules="[val => validNumData(val, 9, true)]"
          />
          <span v-else>
            {{ item.master_bill_amount ?? '-' }}
          </span>
        </template>
        <template v-else-if="col.name === 'master_bill_weight'">
          <q-input
            v-if="(action === 'add' && !item.__readonly) || action === 'edit'"
            :ref="'for_validate_' + col.name + '_' + scope.rowIndex"
            v-model="item.master_bill_weight"
            style="width: 200px"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            debounce="500"
            :maxlength="10"
            :rules="[val => validWeight(val, true)]"
          />
          <div v-else>
            {{ item.master_bill_weight ?? '-' }}
          </div>
        </template>
        <template
          v-else-if="
            col.name === 'etd' ||
            col.name === 'eta' ||
            col.name === 'atd' ||
            col.name === 'ata' ||
            col.name === 'noa' ||
            col.name === 'pickup_time' ||
            col.name === 'arrival_time' ||
            col.name === 'ready_for_handover_time'
          "
        >
          <el-date-picker
            v-if="(action === 'add' && !item.__readonly) || action === 'edit'"
            v-model="item[col.name]"
            style="width: 200px; height: 100%; padding: 7px 0 !important"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            :placeholder="t('sys.plsSelectTime')"
          />
          <template v-else>
            <template v-if="item[col.name + '_tz'] && item[col.name]">
              <div>{{ item[col.name + '_tz'] }}</div>
              <div>{{ item[col.name] }}</div>
            </template>
            <span v-else>{{ item[col.name] || '-' }}</span>
          </template>
        </template>
        <template v-else-if="col.name === 'customs_clearance_quantity'">
          <q-input
            v-if="(action === 'add' && !item.__readonly) || action === 'edit'"
            :ref="'for_validate_' + col.name + '_' + scope.rowIndex"
            v-model="item.customs_clearance_quantity"
            style="width: 200px"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            debounce="500"
            :maxlength="9"
            :rules="[val => validNumData(val, 9, false)]"
          />
          <span v-else-if="action !== 'edit'">
            <span class="text-secondary">
              {{ item.customs_clearance_quantity ?? '-' }} </span
            >/{{ item.sub_bill_amount }}
          </span>
          <span v-else></span>
        </template>
        <template v-else-if="col.name === 'instock_quantity'">
          <q-input
            v-if="(action === 'add' && !item.__readonly) || action === 'edit'"
            :ref="'for_validate_' + col.name + '_' + scope.rowIndex"
            v-model="item.instock_quantity"
            style="width: 200px"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            debounce="500"
            :maxlength="9"
            :rules="[val => validNumData(val, 9, false)]"
          />
          <span v-else-if="action !== 'edit'">
            <span class="text-secondary">
              {{ item.instock_quantity ?? '-' }} </span
            >/{{ item.sub_bill_amount }}
          </span>
          <span v-else></span>
        </template>
        <template v-else-if="col.name === 'outstock_quantity'">
          <q-input
            v-if="(action === 'add' && !item.__readonly) || action === 'edit'"
            :ref="'for_validate_' + col.name + '_' + scope.rowIndex"
            v-model="item.outstock_quantity"
            style="width: 200px"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            debounce="500"
            :maxlength="9"
            :rules="[val => validNumData(val, 9, false)]"
          />
          <span v-else-if="action !== 'edit'">
            <span class="text-secondary">{{
              item.outstock_quantity ?? '-'
            }}</span
            >/{{ item.sub_bill_amount }}
          </span>
          <span v-else></span>
        </template>
        <template v-else-if="col.name === 'operation'">
          <q-btn
            v-if="!action"
            v-auth="'orderFetchWarehousingData'"
            flat
            dense
            no-wrap
            no-caps
            color="secondary"
            :label="t('order.getInData')"
            @click="refreshInstock(scope.row, item)"
          />
          <q-btn
            v-if="action === 'add' && !item.__readonly && !bacthDeleteable"
            flat
            dense
            no-wrap
            no-caps
            color="negative"
            :label="t('sys.delete')"
            @click="handelDelete(scope, index)"
          />
        </template>
        <template v-else>
          {{ col.value || '-' }}
        </template>
      </q-td>
    </template>
  </q-tr>
  <!-- 展开内容的末尾操作行-->
  <q-tr v-show="batchInfo.length > 0 && action" :class="bgColor">
    <q-td v-if="selection !== 'none'" auto-width :class="bgColor"></q-td>
    <template v-for="col in scope.cols" :key="col.name">
      <q-td :class="'text-center ' + bgColor">
        <template v-if="col.name === 'sk_no' && action === 'add'">
          <q-btn
            flat
            dense
            no-wrap
            no-caps
            color="primary"
            icon="add"
            @click="addOneBatch"
          />
        </template>
        <template v-if="col.name === 'operation'">
          <q-btn
            flat
            dense
            no-wrap
            no-caps
            color="negative"
            :label="t('sys.cancel')"
            style="margin-right: 8px"
            @click="handleCancel"
          />
          <q-btn
            flat
            dense
            no-wrap
            no-caps
            color="primary"
            :label="t('sys.submit')"
            @click="handleSubmit(scope)"
          />
        </template>
      </q-td>
    </template>
  </q-tr>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue'
import { Loading } from 'quasar'
import { useVModel } from '@vueuse/core'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

import useData from '../useData'

import { showSuccess, showError } from '@/components'
import { convertTz, convertUtc } from '@/utils/time.js'
import {
  getBatchInfoListApi,
  createBatchesApi,
  editBatchesApi,
  batchBindOpksApi,
} from '@/api/order/index'
import { validNo, validNumData, validWeight } from '@/utils/formValidRule'

const { t } = useI18n()
const bgColor = 'bg-grey-3'
const props = defineProps({
  action: {
    type: String,
    required: true,
  },
  scope: {
    type: Object,
    required: true,
  },
  selection: {
    type: String,
    default: 'none',
  },
})
const emit = defineEmits(['update:action', 'modified', 'cancel'])

const action = useVModel(props, 'action', emit)

const batchInfo = ref([])
const { batchedTypeList } = useData()

async function expand(parentRow) {
  const { id } = parentRow
  batchInfo.value = await getBatchInfo(id)
}

async function add(parentRow) {
  batchInfo.value = await getBatchInfo(parentRow.id)
  const defaultBatchRow = generateDefualtBatchRow(parentRow)
  if (batchInfo.value.length > 0) {
    batchInfo.value.push({ ...defaultBatchRow })
  } else {
    // 没有分批数据的情况下，新增两行
    batchInfo.value.push({ ...defaultBatchRow }, { ...defaultBatchRow })
  }
}

async function edit(parentRow) {
  batchInfo.value = await getBatchInfo(parentRow.id)
}

function getBatchTypeLabel(value) {
  const option = batchedTypeList.value.find(item => item.value === value)
  return option?.label || '-'
}

const bacthDeleteable = computed(() => {
  let editRowCount = 0
  let readonlyRowCount = 0
  batchInfo.value.forEach(i => {
    if (i.__readonly) {
      readonlyRowCount++
    } else {
      editRowCount++
    }
  })
  if (readonlyRowCount > 0) {
    return editRowCount <= 1
  }
  return editRowCount <= 2
})

function handleTime(time, tz) {
  if (time && tz) {
    return time && convertTz(time, tz)
  }
  return time
}
function getBatchInfo(id) {
  Loading.show()
  return new Promise((resolve, reject) => {
    getBatchInfoListApi(id)
      .then(res => {
        // 只有一条数据且type=2，表示该条数据是后台自动生成的航空分批，分批时可以编辑
        const isAutoBatch = res.data.length === 1 && res.data[0].type === 2
        resolve(
          res.data.map(i => {
            i.__readonly = !isAutoBatch
            i.type = isAutoBatch ? 1 : i.type // 将自动生成的数据改成手工分批
            i.master_bill_weight = i.master_bill_weight / 1000
            i.created_at = convertTz(i.created_at)
            i.etd = handleTime(i.etd, i.etd_tz)
            i.eta = handleTime(i.eta, i.eta_tz)
            i.atd = handleTime(i.atd, i.atd_tz)
            i.ata = handleTime(i.ata, i.ata_tz)
            i.noa = handleTime(i.noa, i.noa_tz)
            i.pickup_time = handleTime(i.pickup_time, i.pickup_time_tz)
            i.arrival_time = handleTime(i.arrival_time, i.arrival_time_tz)
            i.ready_for_handover_time = handleTime(
              i.ready_for_handover_time,
              i.ready_for_handover_time_tz,
            )
            return i
          }),
        )
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

function generateDefualtBatchRow(order) {
  return {
    type: 1, // 手工分批
    customer: order.customer,
    sender: order.sender,
    flight_departure_airport: order.flight_departure_airport,
    port_of_arrival: order.port_of_arrival,
    warehouse: order.warehouse,
    custom_broker: order.custom_broker,
    master_bill_recipient: order.master_bill_recipient,
    master_bill_phone: order.master_bill_phone,
    master_bill_email: order.master_bill_email,
    created_at: order.created_at,
  }
}

// 新增一行分批
function addOneBatch() {
  const defaultBatchRow = generateDefualtBatchRow(props.scope.row)
  batchInfo.value.push({ ...defaultBatchRow })
}

// 获取入库外箱
async function refreshInstock(orderRow, batchRow) {
  Loading.show()
  batchBindOpksApi(batchRow.id)
    .then(async () => {
      showSuccess(t('sys.getSuccess'))
      batchInfo.value = await getBatchInfo(orderRow.id)
    })
    .catch(err => {
      showError(err?.msg ?? err?.message ?? err)
    })
    .finally(() => {
      Loading.hide()
    })
}

// 删除分批
function handelDelete(scope, index) {
  batchInfo.value.splice(index, 1)
}
const { proxy } = getCurrentInstance()
function handleCancel() {
  batchInfo.value = []
  emit('cancel')
}
// 新增/修改分批
async function handleSubmit(scope) {
  const validateRefs = []
  Object.keys(proxy.$refs).forEach(item => {
    if (item.includes('for_validate')) {
      validateRefs.push(...proxy.$refs[item])
    }
  })
  let validateFlag = true
  let firstErrorRef = null
  validateRefs.forEach(item => {
    if (!item.validate()) {
      if (!firstErrorRef) firstErrorRef = item
      validateFlag = false
    }
  })
  if (firstErrorRef) scrollToErrorRef(firstErrorRef)
  if (validateFlag) {
    const batch_infos = _.cloneDeep(batchInfo.value)
    batch_infos.forEach(i => {
      i.master_bill_weight = i.master_bill_weight * 1000
      i.created_at = convertUtc(i.created_at)
      i.etd = i.etd || null
      i.eta = i.eta || null
      i.atd = i.atd || null
      i.ata = i.ata || null
      i.noa = i.noa || null
      i.pickup_time = i.pickup_time || null
      i.arrival_time = i.arrival_time || null
      i.ready_for_handover_time = i.ready_for_handover_time || null
      if (!i.customs_clearance_quantity && i.customs_clearance_quantity !== 0) {
        delete i.customs_clearance_quantity
      }
      if (!i.instock_quantity && i.instock_quantity !== 0) {
        delete i.instock_quantity
      }
      if (!i.outstock_quantity && i.outstock_quantity !== 0) {
        delete i.outstock_quantity
      }
    })
    Loading.show()
    try {
      if (action.value === 'add') {
        await createBatchesApi(
          scope.row.id,
          batch_infos.filter(i => !i.__readonly),
        )
        emit('modified')
      } else {
        await editBatchesApi(scope.row.id, batch_infos)
        emit('modified')
      }
      showSuccess(t('sys.submitSuccess'))
    } catch (err) {
      switch (err.code) {
        case undefined:
          showError(err.message)
          break
        case 20101:
          showError(t('order.bacthNoOrder'))
          break
        case 20103:
          showError(t('order.bacthExists'))
          break
        default:
          showError('[Client] Unknown error')
      }
    } finally {
      Loading.hide()
    }
  } else {
    showError(t('order.checkInput'))
  }
}

// 滚动到校验不通过的元素
function scrollToErrorRef(errorRef) {
  const td =
    errorRef.nativeEl.parentElement.parentElement.parentElement.parentElement
      .parentElement
  const table = document.querySelector('.q-table__middle.scroll')
  const top = td.offsetTop - table.offsetHeight + td.offsetHeight * 2
  const left = td.offsetLeft - table.offsetWidth + td.offsetWidth + 150
  table.scrollTo({ top, left, behavior: 'smooth' })
}

function repeatedBactchRule(val) {
  const isRepeated = batchInfo.value.filter(i => i.batch_no === val).length > 1
  return isRepeated ? t('order.batchDuplicate') : true
}

defineExpose({ expand, add, edit })
</script>

<style lang="scss" scoped>
.lh {
  display: inline-block;
  line-height: 40px;
}
td:first-child {
  background-color: #fff;
  z-index: 2;
}
td:last-child {
  background-color: #fff;
  z-index: 1;
}
thead tr th:first-child,
td:first-child {
  left: 0;
  position: sticky;
}
thead tr th:last-child,
td:last-child {
  right: 0;
  position: sticky;
}
:deep(.el-input__wrapper) {
  height: 40px;
}
:deep(.q-field__inner) {
  .q-field__bottom {
    z-index: 1;
    padding: 2px 4px;
    min-height: 12px;
  }
}
.q-td label.q-field {
  padding: 0;
}
</style>
