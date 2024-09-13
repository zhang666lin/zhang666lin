<template>
  <q-select
    ref="selectRef"
    v-model="model"
    :multiple="schema?.multiple ?? multiple"
    :options="filterOptionsRef"
    :loading="isLoading"
    :label="schema.label"
    :option-value="schema?.optionValue ?? 'value'"
    :option-label="schema?.optionLabel ?? 'label'"
    :disable="schema?.disable"
    :class="{ multipleOpsInOneRow: !schema?.selectedOpsCanWrap }"
    clearable
    emit-value
    map-options
    dense
    outlined
    use-input
    :input-debounce="schema?.apiURL ? '500' : 0"
    :rules="schema?.rules ?? []"
    :popup-content-class="'select-popup-content-class'"
    :popup-content-style="{
      width: '200px',
      height:
        filterOptionsRef && filterOptionsRef.length > 10 ? `200px` : 'auto',
    }"
    @filter="filterOptions"
    @update:model-value="handleInput"
    @clear="reset"
  >
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      :offset="[10, 10]"
      style="z-index: 9999"
    >
      {{
        selectedLabels.length > 0
          ? schema.label + ': ' + selectedLabels.join(',')
          : schema.label
      }}
    </q-tooltip>
  </q-select>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import _ from 'lodash'

import http from '@/utils/http/index'
const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  schema: {
    type: Object,
    default: () => {
      return {}
    },
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  // API请求参数
  apiParams: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const emits = defineEmits(['update:modelValue'])
const model = useVModel(props, 'modelValue', emits)
const selectRef = ref(null)
const options = ref([])
const filterOptionsRef = ref([]) // 过滤后的options
const isLoading = ref(false)
const optionLabel = ref('') // option的 label字段
const optionValue = ref('') // // option的 value 字段

optionLabel.value = props.schema?.optionLabel ?? 'label'
optionValue.value = props.schema?.optionValue ?? 'value'

const selectedLabels = computed(() => {
  const result = []
  if (Array.isArray(filterOptionsRef.value) && filterOptionsRef.value.length) {
    filterOptionsRef.value.forEach(option => {
      if (model.value?.includes(option[optionValue.value])) {
        result.push(option[optionLabel.value])
      }
    })
  }
  return result
})
const optionsRes = ref([])
watch(
  optionsRes,
  res => {
    const temp = res.filter(i => i)
    if (temp[temp.length - 1]) filterOptionsRef.value = temp[temp.length - 1]
  },
  { deep: true },
)
async function fetchOptionsManually() {
  const loadingIndex = optionsRes.value.length
  // 从后端获取的数据
  try {
    optionsRes.value.push(false)
    isLoading.value = true
    if (props.schema?.apiURL) {
      let url = props.schema.apiURL
      if (!_.isEmpty(props.apiParams)) {
        const keyValues = []
        Object.keys(props.apiParams).forEach(key => {
          keyValues.push(`${key}=${props.apiParams[key]}`)
        })
        if (url.indexOf('?') === -1) {
          url += '?' + keyValues.join('&')
        } else {
          url += '&' + keyValues.join('&')
        }
      }
      filterOptionsRef.value = props.schema?.options ?? []
      const res = await http.get(url)
      if (res.code === 200) {
        optionsRes.value[loadingIndex] = res.data
      }
      isLoading.value = false
    } else {
      // 外部传入的数据
      options.value = props.schema?.options ?? []
      filterOptionsRef.value = props.schema?.options ?? []
    }
  } catch (error) {
    if (error.name === 'CanceledError') return
    console.error('Error fetching options:', error)
    isLoading.value = false
  }
}
// 通过 API 请求数据
async function fetchOptionsFromAPI(query) {
  const loadingIndex = optionsRes.value.length
  try {
    if (props.schema?.apiURL) {
      optionsRes.value.push(false)
      isLoading.value = true
      // 从后端获取的数据
      let url = ``
      const isExistQueryParams = props.schema.apiURL.indexOf('?') !== -1
      if (isExistQueryParams) {
        url = `${props.schema.apiURL}&query=${query}`
      } else {
        url = `${props.schema.apiURL}?query=${query}`
      }
      if (props.apiParams) {
        Object.keys(props.apiParams).forEach(key => {
          url += `&${key}=${props.apiParams[key]}`
        })
      }
      filterOptionsRef.value = []
      const optionsData = await http.get(url)
      isLoading.value = false
      if (optionsData.code === 200) {
        optionsRes.value[loadingIndex] = optionsData.data
      }
    } else {
      // 从现有数据源过滤

      filterOptionsRef.value = options.value.filter(option => {
        const labelStr = option[optionLabel.value]?.toLowerCase()

        const queryStr = query.toLowerCase()

        return labelStr.indexOf(queryStr) !== -1
      })
    }
  } catch (error) {
    if (error.name === 'CanceledError') return
    isLoading.value = false
    console.error('Error fetching options:', error)
  }
}

// 处理输入过滤
function filterOptions(filter, update) {
  if (filter) {
    // 通过 API 请求数据
    fetchOptionsFromAPI(filter)
  } else {
    // 如果没有输入，则手动获取数据源
    fetchOptionsManually()
  }
  update(() => {
    // 更新 options
    return filterOptionsRef.value
  })
}

// 处理选择
function handleInput(value) {
  if (!value) return
  emits('update:modelValue', value)
}

// 初始加载数据
fetchOptionsManually()

function reset() {
  emits('update:modelValue', [])
}

function setSelectedOptionsAndLabels(val) {
  emits('update:modelValue', val)
}

defineExpose({
  options,
  filterOptionsRef,
  setSelectedOptionsAndLabels,
})
</script>

<style lang="scss" scoped>
.multipleOpsInOneRow {
  :deep(
      .q-field__control-container.col.relative-position.row.no-wrap.q-anchor--skip
        > .q-field__native
        > span
    ) {
    display: block;
    max-width: calc(100% - 50px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

:deep(.q-field__bottom) {
  padding: 8px 12px 0;
}
</style>
