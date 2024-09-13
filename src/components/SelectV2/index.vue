<template>
  <q-select
    ref="selectRef"
    v-model="model"
    :label="label"
    :multiple="multiple"
    :options="innerOptions"
    :option-label="optionLabel"
    :option-value="optionValue"
    :disable="disable"
    :clearable="clearable"
    :rules="rules"
    :stack-label="!!stackLabel"
    emit-value
    map-options
    dense
    outlined
    behavior="menu"
    :menu-offset="[0, 4]"
    :style="{ width }"
    :popup-content-style="{
      width,
      height: innerOptions?.length > 6 ? '240px' : 'auto',
    }"
    @popup-hide="filterValue = ''"
    @popup-show="handlePopupShow"
  >
    <template #label>
      <div ref="labelRef" class="ellipsis">
        {{ label }}
      </div>
    </template>
    <template #selected>
      <div ref="selectedLabelsRef" class="ellipsis">
        {{ selectedLabels || stackLabel }}
      </div>
    </template>
    <template v-if="searchable" #before-options>
      <div style="position: sticky; top: 0; z-index: 6000" class="bg-white">
        <q-input
          v-model="filterValue"
          autofocus
          class="q-mx-md bg-white"
          :placeholder="t('sys.search')"
          dense
          square
          borderless
          :debounce="localFilter ? '0' : '500'"
          @keyup.enter="handleEnter"
        >
          <template #append>
            <q-icon
              v-if="tooltip"
              v-tooltip="{
                placement: 'right',
                offset: [0, 26],
                allowHTML: true,
                content: tooltip,
              }"
              class="cursor-pointer"
              name="info"
            />
          </template>
        </q-input>
        <q-separator />
      </div>
    </template>
    <template #option="scope">
      <q-item
        v-if="scope.opt !== 'noDataMark' && scope.opt !== 'loadingMark'"
        v-bind="scope.itemProps"
        style="padding: 0 8px; min-height: 40px"
        :class="{
          'bg-blue-grey-1': scope.itemProps.active,
        }"
      >
        <q-item-section side class="q-pr-xs">
          <q-checkbox
            v-if="multiple"
            size="xs"
            toggle-indeterminate
            :model-value="scope.selected"
            @update:model-value="scope.toggleOption(scope.opt)"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.label }}</q-item-label>
        </q-item-section>
      </q-item>
      <div
        v-if="scope.opt === 'noDataMark'"
        class="row justify-center items-center text-grey"
        style="min-height: 40px"
      >
        {{ t('sys.noData') }}
      </div>
      <div
        v-if="scope.opt === 'loadingMark'"
        class="row justify-center items-center text-grey"
        style="min-height: 40px"
      >
        <q-spinner color="primary" size="1.8em" />
      </div>
    </template>
  </q-select>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUpdated, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'
import _ from 'lodash'
import tippy from 'tippy.js'

import http from '@/utils/http'
import { showError } from '@/components'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null,
  },
  label: {
    type: String,
    default: undefined,
  },
  width: {
    type: String,
    default: '200px',
  },
  /** 是否可搜索下拉项 */
  searchable: {
    type: Boolean,
    default: true,
  },
  /** 是否多选 */
  multiple: {
    type: Boolean,
    default: false,
  },
  /** 默认初始选中的选项
   * 注：直接将默认初始选中项的 value 赋值给 modelValue，
   * 会出现 "无法立即显示对应 label" 的问题，
   * 原因是拉下数据还在 loading，找不到对应的 label
   */
  defaultSelected: {
    type: Array,
    default: () => [],
  },
  /** 远程请求下拉选项相关配置 */
  remoteConfig: {
    type: Object,
    default: undefined,
  },
  /** 是否本地过滤选项 */
  localFilter: {
    type: Boolean,
    default: false,
  },
  /** 下拉选项，若传了 remoteConfig, 该配置将失效 */
  options: {
    type: Array,
    default: () => [],
  },
  optionLabel: {
    type: String,
    default: 'label',
  },
  optionValue: {
    type: String,
    default: 'value',
  },
  /** 是否禁用 */
  disable: {
    type: Boolean,
    default: false,
  },
  /** 是否可清空 */
  clearable: {
    type: Boolean,
    default: true,
  },
  /** 校验规则 */
  rules: {
    type: Array,
    default: () => [],
  },
  /** 搜索框校验 */
  newOptionRules: {
    type: Array,
    default: () => [],
  },
  /** 搜索框的tooltip */
  tooltip: {
    type: String,
    default: '',
  },
  /** 允许新增不存在的选项, 本地过滤才可用, 单选才可用 */
  allowNewOption: {
    type: Boolean,
    default: false,
  },
  /** 未选中任何选项，input框中固定显示的文本 */
  stackLabel: {
    type: String,
    default: '',
  },
  /** 是否实时更新 options, 每次展开下拉都重新请求 */
  realTimeOptions: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'update:options'])
const model = useVModel(props, 'modelValue', emit)
if (props.defaultSelected && props.defaultSelected.length > 0) {
  if (props.multiple) {
    model.value = props.defaultSelected.map(v => v[props.optionValue])
  } else {
    model.value = props.defaultSelected[0][props.optionValue]
  }
}
const { t } = useI18n()
const loading = ref(false)
const innerOptions = ref([])
const originOptions = ref([])
const newOptions = ref([])

watch(
  () => props.options,
  val => {
    innerOptions.value = val ?? []
    originOptions.value = _.cloneDeep(innerOptions.value)
    emit('update:options', innerOptions.value)
  },
  { immediate: true, deep: true },
)

if (props.remoteConfig) {
  if (props.options?.length > 0) {
    // 传了 props.remoteConfig 表示使用接口获取下拉数据
    // 却还传了 props.options (非空数组) 则初始化时不请求接口
  } else {
    fetchOptions(props.remoteConfig)
  }
}

function handlePopupShow() {
  if (props.realTimeOptions) {
    fetchOptions(props.remoteConfig)
  }
}

const selectedLabels = computed(() => {
  const temp = []
  _.uniqBy(
    [...props.defaultSelected, ...originOptions.value, ...newOptions.value],
    props.optionValue,
  ).forEach(o => {
    if (o) {
      if (_.isArray(model.value)) {
        if (model.value.includes(o[props.optionValue])) {
          temp.push(o[props.optionLabel])
        }
      } else {
        if (model.value === o[props.optionValue]) {
          temp.push(o[props.optionLabel])
        }
      }
    }
  })
  return temp.join(', ')
})

function fetchOptions(config, value) {
  loading.value = true
  const params = { ...config.params }
  if (!props.localFilter && value) params[config.queryField] = value
  http[config.method](config.url, params)
    .then(res => {
      loading.value = false
      let options
      if (config.responseWrapper) {
        options = config.responseWrapper(res)
      } else {
        options = res.data || res.results || []
      }
      // 处理下拉接口返回格式为 ['a', 'b', 'c'] 的情况
      innerOptions.value = options.map(o => {
        if (!_.isObject(o)) {
          const objOption = {}
          objOption[props.optionLabel] = o
          objOption[props.optionValue] = o
          return objOption
        }
        return o
      })
      emit('update:options', innerOptions.value)
      originOptions.value = _.cloneDeep(innerOptions.value)
    })
    .catch(error => {
      if (error.name === 'CanceledError') return
      console.error(error)
      loading.value = false
      innerOptions.value = []
      emit('update:options', [])
    })
}

const filterValue = ref('')
watch(filterValue, val => {
  handleFilter(val)
})

// 下拉数据还在 loading 时，输入过滤内容：
// [本地过滤]记录输入的内容，等 loading 结束再按输入内容过滤
// [远程过滤]取消正在loading的请求，增加过滤参数再次请求
const waitToSearchValue = ref('')
watch(
  loading,
  val => {
    if (val) innerOptions.value = ['loadingMark']
    if (props.localFilter && !val && waitToSearchValue.value) {
      // loading 结束再按输入内容过滤
      handleFilter(waitToSearchValue.value)
      waitToSearchValue.value = ''
    }
  },
  { immediate: true },
)
// q-select 会判断传入的 options 是否为空数组
// 如果为空数组，则显示 no-option 插槽，隐藏 before-options 插槽，
// 为了保证写在 before-options 插槽中的输入框始终显示，所以当 innerOptions 为空时传一个占位符
watch(innerOptions, val => {
  if (val.length === 0 && !loading.value) {
    innerOptions.value = ['noDataMark']
  }
})
function handleFilter(val) {
  if (props.localFilter) {
    if (loading.value) {
      waitToSearchValue.value = val //记录输入的内容
      return
    }
    if (val) {
      const needle = val.toLowerCase()
      innerOptions.value = originOptions.value.filter(v => {
        return v[props.optionLabel].toLowerCase().indexOf(needle) > -1
      })
    } else {
      innerOptions.value = _.cloneDeep(originOptions.value)
    }
  } else {
    fetchOptions(props.remoteConfig, val)
  }
}

function handleEnter(e) {
  const inputValue = e.target.value
  if (!inputValue) return
  if (!props.allowNewOption) return
  if (props.newOptionRules.length > 0) {
    let ruleError
    props.newOptionRules.find(rule => {
      if (rule(inputValue) !== true) {
        ruleError = rule(inputValue)
        return true
      }
    })
    if (ruleError) return showError(ruleError)
  }
  const temp = _.uniqBy(
    [...props.defaultSelected, ...originOptions.value, ...newOptions.value],
    props.optionValue,
  ).find(i => i[props.optionLabel] === inputValue)
  let newOptionValue, isNew
  if (!temp) {
    const newOption = {}
    newOption[props.optionValue] = inputValue
    newOption[props.optionLabel] = inputValue
    newOptions.value.push(newOption)
    newOptionValue = inputValue
    isNew = true
  } else {
    newOptionValue = temp[props.optionValue]
    isNew = false
  }
  if (props.multiple) {
    if (!model.value.includes(newOptionValue)) {
      emit('update:modelValue', [...model.value, newOptionValue], isNew)
    }
  } else {
    emit('update:modelValue', newOptionValue, isNew)
  }
  selectRef.value.hidePopup()
}

// 处理 label 和 选中项 文本超长
const selectRef = ref(null)
const labelRef = ref(null)
const selectedLabelsRef = ref(null)
let tooltipInstance = null
function setTooltip() {
  const labelOverflow =
    labelRef.value?.scrollWidth > labelRef.value?.offsetWidth
  const selectedLabelsOverflow =
    selectedLabelsRef.value.scrollWidth > selectedLabelsRef.value.offsetWidth
  const parts = []
  if (labelOverflow) parts.push(props.label)
  if (selectedLabelsOverflow) parts.push(selectedLabels.value)
  const content = parts.join(':<br />')
  if (tooltipInstance) {
    if (!content) {
      destroyTooltip()
    } else {
      tooltipInstance.setContent(content)
    }
  } else {
    if (content)
      tooltipInstance = tippy(selectRef.value.$el, {
        placement: 'top',
        arrow: false,
        offset: [0, 4],
        content,
        allowHTML: true,
      })
  }
}
function destroyTooltip() {
  tooltipInstance && tooltipInstance.destroy()
  tooltipInstance = null
}
onMounted(() => {
  setTooltip()
})
onUpdated(() => {
  setTooltip()
})
onUnmounted(() => {
  destroyTooltip()
})
</script>
