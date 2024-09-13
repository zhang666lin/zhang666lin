<template>
  <div class="container">
    <q-input
      ref="inputRef"
      v-model="inputValue"
      class="fit"
      filled
      clearable
      type="textarea"
      standout
      square
      :placeholder="t('timeManage.splitBulksWithSpaceAndBr')"
      :rules="[val => (val && val.length > 0) || t('order.empty'), rule]"
      @update:model-value="handleInput"
    />
    <div class="bottom-counter">{{ t('common.bulk') }}：{{ opkCount }}</div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { splitByMulti, hasDuplicates } from '@/utils'

const { t } = useI18n()

const emit = defineEmits(['setTypeAndNo'])
const inputRef = ref()
const inputValue = ref('')
const inputArr = ref([])
const opkCount = ref(0)

function handleInput(val) {
  inputArr.value = splitByMulti(val)
  opkCount.value = inputArr.value.length
  emit('setTypeAndNo', {
    dataType: 1, // 外件为1
    skNo: inputArr.value,
  })
}
function rule() {
  if (inputArr.value.length > 1 && hasDuplicates(inputArr.value)) {
    return t('timeManage.exsitDuplicate')
  } else if (inputArr.value.length > 1000) {
    return t('sys.max', [1000])
  }
  return true
}
function validate() {
  return inputRef.value.validate()
}
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
