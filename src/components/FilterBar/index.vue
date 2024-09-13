<template>
  <q-form
    ref="form"
    :class="formCls"
    autocomplete="off"
    @submit="submit"
    @reset="reset"
  >
    <div v-if="selectable" class="q-pb-md row no-wrap">
      <q-btn color="primary" icon="add" class="q-mr-sm">
        <q-menu style="height: 460px" :offset="[0, 8]">
          <q-list>
            <template v-for="i in filterBarItems" :key="i.field">
              <q-item
                tag="label"
                style="padding: 0 8px; min-height: 40px"
                :class="{
                  'bg-blue-grey-1': i.show,
                }"
              >
                <q-item-section side class="q-pr-xs">
                  <q-checkbox
                    v-model="i.show"
                    size="xs"
                    :disable="i.__disable"
                    @update:model-value="val => selectFilter(val, i)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ i.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn
        v-if="searchBtn"
        icon="search"
        color="primary"
        type="submit"
        class="q-mr-sm"
      />
      <q-btn
        v-if="resetBtn"
        icon="refresh"
        color="primary"
        outline
        type="reset"
        class="q-mr-sm"
      />
      <slot />
    </div>
    <div v-if="filterBarItems.length" :class="filtersCls">
      <template v-for="item in filterBarItems" :key="item.field">
        <template v-if="item.show">
          <q-input
            v-if="['input', 'multipleInput'].includes(item.type)"
            v-model="filterBarValue[item.field]"
            :style="{ width: vertical ? '100%' : '200px' }"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            :label="item.label"
            :rules="item.rules"
            @update:model-value="
              handleInputLimit($event, item.field, item.limit)
            "
          />
          <Select
            v-else-if="item.type === 'select'"
            v-model="filterBarValue[item.field]"
            :style="{ width: vertical ? '100%' : '200px' }"
            bg-color="white"
            :label="item.label"
            :options="getOptions(item)"
            :option-label="item.optionLabel"
            :option-value="item.optionValue"
            :loading="item.loading"
          />
          <SelectV2
            v-else-if="
              item.type === 'multipleSelectV2' || item.type === 'selectV2'
            "
            v-model="filterBarValue[item.field]"
            v-model:options="item.options"
            bg-color="white"
            :label="item.label"
            :width="vertical ? '100%' : '200px'"
            :multiple="item.type === 'multipleSelectV2'"
            :default-selected="item.defaultSelected"
            :remote-config="item.remoteConfig"
            :local-filter="item.localFilter"
            :real-time-options="item.realTimeOptions"
            :option-label="item.optionLabel"
            :option-value="item.optionValue"
            :stack-label="item.stackLabel"
            :loading="item.loading"
            :disable="item.disable"
            :rules="item.rules"
            :tooltip="item.tooltip"
            :searchable="item.searchable"
          />
          <MultipleSelect
            v-if="item.type === 'multipleSelect'"
            ref="mulSelectRef"
            v-model="filterBarValue[item.field]"
            :style="{ width: vertical ? '100%' : '200px' }"
            bg-color="white"
            :schema="item"
            :api-params="getMultipleSelectApiParams(item.relatedItems)"
          />
          <DateRangePicker
            v-else-if="item.type === 'dateRange'"
            v-model="filterBarValue[item.field]"
            :style="vertical ? 'width: 100%' : 'max-width: 240px'"
            :label="item.label"
            :placeholder="item.placeholder"
          />
        </template>
      </template>
      <template v-if="!vertical">
        <q-btn
          v-if="searchBtn"
          icon="search"
          color="primary"
          type="submit"
          class="q-mr-sm"
        />
        <q-btn
          v-if="resetBtn"
          icon="refresh"
          color="primary"
          outline
          type="reset"
          class="q-mr-sm"
        />
        <slot />
      </template>
    </div>
  </q-form>
</template>

<script setup>
import _ from 'lodash'
import { ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import Select from '@/components/Select/index.vue'
import SelectV2 from '@/components/SelectV2/index.vue'
import MultipleSelect from '@/components/Select/MultipleSelect.vue'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import {
  inputWrapper,
  multipleInputWrapper,
  selectWrapper,
  multipleSelectWrapper,
  timeRangeWrapper,
} from '@/utils/wrapper'

const { t } = useI18n()
const emit = defineEmits(['search'])
const props = defineProps({
  filters: {
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
  /**
   * 是否可选择筛选项
   * 默认显示（true）
   */
  selectable: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否使用垂直布局
   * 默认使用（true）
   */
  vertical: {
    type: Boolean,
    default: false,
  },
})

const formCls = props.vertical ? 'column fit' : 'row'
const filtersCls = props.vertical
  ? 'col custom-overflow bg-grey-3 rounded-borders q-pa-md form-item'
  : 'row items-center q-gutter-y-md q-gutter-x-sm q-mb-md'

function generateFilterBarItems(originItems) {
  return originItems.map(item => {
    if (!props.selectable) {
      item.show = true
    } else {
      if (item.show === 'always') {
        item.show = true
        item.__disable = true
      } else {
        item.show = item.show ?? false
      }
    }
    return item
  })
}
// 根据不同类型赋予对应的默认值
function getItemDefaultValue(item) {
  if (item.defaultValue !== undefined) {
    if (_.isFunction(item.defaultValue)) {
      return item.defaultValue()
    }
    return item.defaultValue
  }
  if (['input', 'multipleInput', 'dateRange'].includes(item.type)) {
    return null
  }
  if (item.type === 'multipleSelect' || item.type === 'multipleSelectV2') {
    return []
  }
  return ''
}
// 根据 filters 生成默认 value
function generateDefaultValue(filters) {
  const defaultFormValue = {}
  filters.forEach(item => {
    if (!item.show) return
    defaultFormValue[item.field] = getItemDefaultValue(item)
  })
  return defaultFormValue
}
const filterBarValue = ref({})
const filterBarItems = ref([])
function setFilters(filters) {
  filterBarItems.value = generateFilterBarItems(filters ?? props.filters)
  filterBarValue.value = generateDefaultValue(filterBarItems.value)
}
setFilters()
// 转换filter对应的值
function convertItemValue(item, value) {
  if (item.wrapper) {
    // 有传 wrapper 按传的函数转换
    item.wrapper(value, item.field)
  } else {
    // 没传按默认的转换
    if (item.type === 'input') inputWrapper(value, item.field)
    if (item.type === 'multipleInput') multipleInputWrapper(value, item.field)
    if (item.type === 'select' || item.type === 'selectV2')
      selectWrapper(value, item.field)
    if (item.type === 'multipleSelect' || item.type === 'multipleSelectV2')
      multipleSelectWrapper(value, item.field)
    if (item.type === 'dateRange') timeRangeWrapper(value, item.field)
  }
}
// 获取当前filterBar筛选条件的值
function getValue() {
  const value = _.cloneDeep(filterBarValue.value)
  filterBarItems.value.forEach(item => {
    convertItemValue(item, value)
  })
  return value
}
function submit() {
  emit('search', getValue())
}

function selectFilter(val, item) {
  if (val) {
    filterBarValue.value[item.field] = getItemDefaultValue(item)
  } else {
    delete filterBarValue.value[item.field]
  }
}

function getMultipleSelectApiParams(fields = []) {
  let params = {}
  fields.forEach(field => {
    const filter = filterBarItems.value.find(i => i.field === field)
    const obj = {}
    obj[field] = filterBarValue.value[field]
    convertItemValue(filter, obj)
    params = { ...params, ...obj }
  })
  return params
}

function reset() {
  filterBarItems.value = generateFilterBarItems(
    _.cloneDeep(props.filters).map(i => {
      const temp = filterBarItems.value.find(f => f.field === i.field)
      if (temp) i.show = temp.show
      return i
    }),
  )
  filterBarValue.value = generateDefaultValue(filterBarItems.value)
}

function getOptions(item) {
  if (item.noAllOption) return item.options
  const all = {}
  all[item.optionLabel ?? 'label'] = t('sys.all')
  all[item.optionValue ?? 'value'] = ''
  if (item?.options?.length > 0) {
    return [all, ...item.options]
  }
  return [all]
}

// 获取当前filterBar信息，保存视图时使用
function getFilterBarInfo() {
  return {
    filterBarItems: filterBarItems.value,
    filterBarValue: filterBarValue.value,
  }
}
// 限制输入框输入，限制规则在 filters 的 limit 中定义
function handleInputLimit(value, field, limit) {
  if (limit && _.isFunction(limit) && value) {
    nextTick(() => (filterBarValue.value[field] = limit(value)))
  }
}

defineExpose({
  reset,
  submit,
  getValue,
  getFilterBarInfo,
  setFilters,
})
</script>

<style lang="scss" scoped>
.form-item {
  > label,
  :deep(.el-date-editor) {
    margin-bottom: 18px;
  }
  label:last-child,
  :deep(.el-date-editor:last-child) {
    margin-bottom: 0;
  }
}
.custom-overflow {
  overflow-y: auto;
  overflow-x: hidden;
}
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
