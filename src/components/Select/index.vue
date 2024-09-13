<template>
  <q-select
    ref="selectRef"
    v-model="model"
    v-bind="attrs"
    :options="innerOptions"
    dense
    map-options
    emit-value
    outlined
    use-input
    :option-label="optionLabel"
    :option-value="optionValue"
    input-debounce="0"
    :popup-content-style="{
      width: '200px',
      height: innerOptions && innerOptions.length > 10 ? `200px` : 'auto',
    }"
    @filter="filterFn"
  />
</template>

<script setup>
import { ref, useAttrs } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  optionsApi: {
    type: Function,
    default: null,
  },
  optionLabel: {
    type: String,
    default: 'label',
  },
  optionValue: {
    type: String,
    default: 'value',
  },
})
const emit = defineEmits(['update:modelValue'])

const model = useVModel(props, 'modelValue', emit)

const attrs = useAttrs()

const selectRef = ref(null)

const innerOptions = ref(props.options)
function filterFn(val, update) {
  if (val === '') {
    update(() => {
      innerOptions.value = props.options
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    innerOptions.value = props.options.filter(v => {
      return v[props.optionLabel].toLowerCase().indexOf(needle) > -1
    })
  })
}

defineExpose({
  innerOptions,
})
</script>
