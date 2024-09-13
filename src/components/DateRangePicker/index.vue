<template>
  <el-date-picker
    v-model="model"
    class="custom-date-picker"
    type="daterange"
    range-separator="~"
    :start-placeholder="placeholder"
    :end-placeholder="placeholder"
    size="large"
    value-format="YYYY-MM-DD HH:mm:ss"
    :prefix-icon="customPrefix"
    :clear-icon="customClear"
    :default-time="[
      new Date(2000, 1, 1, 0, 0, 0),
      new Date(2000, 2, 1, 23, 59, 59),
    ]"
    style="width: 220px"
    @focus="isFocus = true"
    @blur="isFocus = false"
    @visible-change="
      val => {
        if (!val) isFocus = false
      }
    "
  />
</template>

<script setup>
import { ref, shallowRef, h } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null,
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:modelValue'])
const model = useVModel(props, 'modelValue', emits)
const isFocus = ref(false)
const customPrefix = shallowRef({
  render() {
    return h('div', {
      style: {
        position: 'absolute',
        fontSize: '14px',
        top: '0.85em',
        whiteSpace: 'nowrap',
        transform: 'translate(38%, -50%) scale(0.75)',
        fontStyle: 'normal',
        color: isFocus.value ? '#272D4B' : '#606266',
      },
      innerHTML: props.label,
    })
  },
})

const customClear = shallowRef({
  render() {
    return h('div', {
      class: 'q-icon notranslate material-icons q-field__focusable-action',
      style: {
        fontSize: '24px',
        marginLeft: '2px',
        opacity: model.value ? 1 : 0,
        visibility: model.value ? 'visible' : 'hidden',
      },
      innerHTML: 'cancel',
    })
  },
})
</script>

<style lang="scss" scoped>
.custom-date-picker {
  :global(.el-date-editor) {
    padding: 0 12px !important;
  }
  :global(.el-range-editor:hover) {
    box-shadow: 0 0 0 1px black inset !important;
  }
  :global(.el-range-editor.is-active),
  :global(.el-range-editor.is-active:hover),
  :global(.el-range-editor.is-active:active) {
    box-shadow: 0 0 0 2px var(--el-input-focus-border-color) inset !important;
  }
  :global(.el-date-editor.el-input__wrapper) {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.24) inset;
  }
  :global(.el-range-editor--large .el-range-input),
  :global(.el-range-editor--large .el-range-separator) {
    padding: 12px 0 0;
    color: rgba(0, 0, 0, 0.87);
  }
  :global(.el-date-editor .el-range__close-icon--hidden) {
    opacity: 1;
    visibility: visible;
  }
  :global(.el-date-editor .el-range__icon) {
    font-size: 0;
  }
}
</style>
