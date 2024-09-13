<template>
  <q-form
    class="row items-center q-gutter-y-md q-gutter-x-sm"
    autocomplete="off"
    @submit="submit"
    @reset="initFormValue"
  >
    <template v-for="schema in schemas" :key="schema.field">
      <q-input
        v-if="schema.type === 'input'"
        v-model="formValue[schema.field]"
        style="width: 200px"
        outlined
        dense
        clearable
        reactive-rules
        bg-color="white"
        debounce="500"
        :label="schema.label"
        :rules="schema.rules"
      />
      <Select
        v-else-if="schema.type === 'select'"
        v-model="formValue[schema.field]"
        style="width: 200px"
        :label="schema.label"
        :options="getOptions(schema)"
        :option-label="schema.optionLabel"
        :option-value="schema.optionValue"
        :loading="schema.loading"
      />
      <DateRangePicker
        v-else-if="schema.type === 'dateRange'"
        v-model="formValue[schema.field]"
        style="width: 220px"
        :label="schema.label"
        :placeholder="schema.placeholder"
      />
      <MultipleSelect
        v-else-if="schema.type === 'multipleSelect'"
        ref="mulSelectRef"
        v-model="formValue[schema.field]"
        style="width: 200px"
        :schema="schema"
        :api-params="getMultipleSelectApiParams(schema.relatedItems)"
      />
    </template>
    <q-btn v-if="searchBtn" icon="search" type="submit" color="primary" />
    <q-btn
      v-if="resetBtn"
      icon="refresh"
      type="reset"
      color="primary"
      outline
    />
    <slot name="suffix" />
  </q-form>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Select from '@/components/Select/index.vue'
import MultipleSelect from '@/components/Select/MultipleSelect.vue'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { convertUtc } from '@/utils/time'
import {
  inputWrapper,
  multipleInputWrapper,
  selectWrapper,
  multipleSelectWrapper,
  timeRangeWrapper,
} from '@/utils/wrapper'

const { t } = useI18n()
const props = defineProps({
  /** 定义表单内元素的数组 */
  schemas: {
    type: Array,
    required: true,
  },
  /**
   * 是否显示重置按钮
   * 默认显示（true）
   */
  resetBtn: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否显示重置按钮
   * 默认显示（true）
   */
  searchBtn: {
    type: Boolean,
    default: true,
  },
})

const mulSelectRef = ref(null)

const formValue = ref({})
function initFormValue() {
  const defaultFormValue = {}
  props.schemas.forEach(schema => {
    if (schema.defaultValue !== undefined) {
      if (_.isFunction(schema.defaultValue)) {
        defaultFormValue[schema.field] = schema.defaultValue()
      } else {
        defaultFormValue[schema.field] = schema.defaultValue
      }
    } else {
      if (schema.type === 'dateRange' || schema.type === 'input') {
        defaultFormValue[schema.field] = null
      } else if (schema.type === 'multipleSelect') {
        defaultFormValue[schema.field] = []
      } else {
        defaultFormValue[schema.field] = '' // 默认值为空字符串
      }
    }
    if (schema.type === 'dateRange') {
      schema.utc = schema.utc ?? true
    }
  })
  formValue.value = defaultFormValue
}
initFormValue()

const emit = defineEmits(['submit'])
function getValue() {
  const emitValue = _.cloneDeep(formValue.value)
  const dateRangeSchemas = props.schemas.filter(
    schema => schema.type === 'dateRange',
  )
  dateRangeSchemas.forEach(schema => {
    if (schema.utc && emitValue[schema.field]) {
      emitValue[schema.field] = emitValue[schema.field].map(i => convertUtc(i))
    }
  })
  return emitValue
}
function submit() {
  emit('submit', getValue())
}

function getOptions(schema) {
  if (schema.noAllOption) return schema.options
  const all = {}
  all[schema.optionLabel ?? 'label'] = t('sys.all')
  all[schema.optionValue ?? 'value'] = ''
  if (schema?.options?.length > 0) {
    return [all, ...schema.options]
  }
  return [all]
}

function getMultipleSelectApiParams(fields = []) {
  let params = {}
  fields.forEach(field => {
    const filter = props.schemas.find(i => i.field === field)
    const obj = {}
    obj[field] = formValue.value[field]
    convertItemValue(filter, obj)
    params = { ...params, ...obj }
  })
  return params
}

// 转换filter对应的值
function convertItemValue(item, value) {
  if (item.wrapper) {
    // 有传 wrapper 按传的函数转换
    item.wrapper(value, item.field)
  } else {
    // 没传按默认的转换
    if (item.type === 'input') inputWrapper(value, item.field)
    if (item.type === 'multipleInput') multipleInputWrapper(value, item.field)
    if (item.type === 'select') selectWrapper(value, item.field)
    if (item.type === 'multipleSelect') multipleSelectWrapper(value, item.field)
    if (item.type === 'dateRange') timeRangeWrapper(value, item.field)
  }
}

defineExpose({ getValue, submit })
</script>

<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  flex-grow: 0;
}
:deep(.q-field__inner) {
  .q-field__bottom {
    padding: 2px 4px;
    min-height: 12px;
  }
}
.q-field--with-bottom {
  padding-bottom: 0;
}
</style>
