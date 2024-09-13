<template>
  <div class="container">
    <q-input
      v-model="inputValue"
      class="q-pa-md"
      clearable
      outlined
      dense
      debounce="500"
      :placeholder="t('timeManage.fillMAWb')"
      @update:model-value="getBatches"
    />
    <q-inner-loading :showing="loading" color="grey" />
    <q-tree
      v-model:ticked="treeTicked"
      v-model:expanded="treeExpanded"
      class="q-ma-md"
      :nodes="treeData"
      node-key="label"
      tick-strategy="leaf"
      :no-nodes-label="t('sys.noData')"
    />
    <div class="bottom-counter">{{ t('common.bulk') }}：{{ opkCount }}</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { showError } from '@/components'
import { getPartsOfWblApi } from '@/api/timeManage'

const { t } = useI18n()
const props = defineProps({
  wah: {
    type: Object,
    default: () => {},
  },
})
const inputValue = ref('')
const treeData = ref([])
const treeTicked = ref([])
const treeExpanded = ref([])
const loading = ref(false)
const dataType = ref(null)
const opkCount = ref(0)
const skNo = ref([])
const emit = defineEmits(['setTypeAndNo'])

function getBatches(val) {
  treeData.value = []
  opkCount.value = 0
  if (!val) {
    return
  }
  loading.value = true
  const wah = props.wah
  getPartsOfWblApi({ carrier_ref: val, wah_code: wah.code })
    .then(res => {
      if (res.data.batch_list.length === 0) {
        opkCount.value = res.data.master_bill_amount
        dataType.value = 2
        skNo.value = [res.data.carrier_ref]
        emit('setTypeAndNo', {
          dataType: dataType.value,
          skNo: skNo.value,
        })
        return
      }
      treeData.value = [
        {
          label: res.data.carrier_ref,
          opk_amount: res.data.master_bill_amount,
          children: res.data.batch_list.map(item => {
            return {
              label: item.batch_no,
              opk_amount: item.master_bill_amount,
            }
          }),
        },
      ]
      treeTicked.value = treeData.value[0].children.map(i => i.label)
      treeExpanded.value = [treeData.value[0].label]
    })
    .finally(() => {
      loading.value = false
    })
}
function validate() {
  if (treeData.value.length === 0 && !inputValue.value) {
    showError(t('timeManage.fillMAWb'))
    return false
  }
  if (treeData.value.length > 0 && treeTicked.value.length === 0) {
    showError(t('timeManage.fillMAWBOrBatch'))
    return false
  }
  if (dataType.value === 2 && opkCount.value === 0) {
    showError(t('timeManage.notFindBulkInMAWB'))
    return
  }
  return true
}

watch(
  treeTicked,
  val => {
    if (val.length === treeData.value[0]?.children?.length) {
      dataType.value = 2
      skNo.value = [treeData.value[0].label]
      opkCount.value = treeData.value[0].opk_amount
    } else {
      dataType.value = 3
      skNo.value = val
      const selectedNodes = treeData.value[0].children.filter(item =>
        val.includes(item.label),
      )
      opkCount.value = selectedNodes.reduce(
        (acc, cur) => acc + cur.opk_amount,
        0,
      )
    }
    emit('setTypeAndNo', {
      dataType: dataType.value,
      skNo: skNo.value,
    })
  },
  { deep: true },
)

defineExpose({
  validate,
})
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
}
.bottom-counter {
  position: absolute;
  right: 12px;
  bottom: -4px;
  font-size: 12px;
}
</style>
