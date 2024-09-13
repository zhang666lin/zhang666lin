<template>
  <q-dialog
    ref="dialogRef"
    v-model="model"
    persistent
    transition-show="scale"
    transition-hide="scale"
    style="z-index: 3000"
    allow-focus-outside
    @hide="onDialogHide"
  >
    <q-card ref="dialogContentRef" :style="dialogStyle">
      <q-card-section
        v-touch-pan.mouse="onPan"
        class="row items-center"
        style="cursor: move"
      >
        <div class="text-h6">
          <template v-if="$slots.title"><slot name="title" /></template>
          <template v-else> {{ title }} </template>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onCancelClick" />
      </q-card-section>

      <q-card-section class="scroll">
        <template v-if="$slots.default"><slot /></template>
        <template v-else> {{ message }} </template>
      </q-card-section>
      <q-card-actions v-if="!hideFooterBtns" align="right">
        <q-btn
          color="primary"
          flat
          no-caps
          :label="cancelBtnTxt"
          @click="onCancelClick"
        />
        <q-btn color="primary" no-caps :label="okBtnTxt" @click="onOKClick" />
        <q-btn
          v-if="showExtraBtn"
          color="primary"
          no-caps
          :label="extraBtnTxt"
          @click="onExtraBtnClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { ref, computed, watch } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  contentStyle: {
    type: Object,
    default: () => {},
  },
  cancelBtnTxt: {
    type: String,
    default: 'Cancel',
  },
  okBtnTxt: {
    type: String,
    default: 'Ok',
  },
  extraBtnTxt: {
    type: String,
    default: 'Submit & Apply',
  },
  showExtraBtn: {
    type: Boolean,
    default: false,
  },
  hideFooterBtns: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits([
  ...useDialogPluginComponent.emits,
  'update:modelValue',
  'extraBtnClick',
  'confirm',
  'cancel',
])
const model = useVModel(props, 'modelValue', emits)
const { dialogRef, onDialogHide } = useDialogPluginComponent()

function onExtraBtnClick() {
  // onDialogCancel()
  emits('extraBtnClick')
}
function onOKClick() {
  // onDialogOK()
  emits('confirm')
}

function onCancelClick() {
  // onDialogCancel()
  emits('cancel')
}

function open(value) {
  model.value = value
}
watch(model, val => {
  if (val) {
    dialogPosition.value = { x: 0, y: 0 }
  }
})
const dialogPosition = ref({ x: 0, y: 0 })
const dialogStyle = computed(() => ({
  transform: `translate(${dialogPosition.value.x}px, ${dialogPosition.value.y}px)`,
  ...props.contentStyle,
}))
const dialogContentRef = ref(null)
function onPan(evt) {
  const dialogRect = dialogContentRef.value.$el.getBoundingClientRect()
  const dialogLeft = dialogRect.left
  const dialogRight = window.innerWidth - dialogRect.left - dialogRect.width
  const dialogTop = dialogRect.top
  const dialogBottom = window.innerHeight - dialogRect.top - dialogRect.height
  let moveX, moveY
  if (evt.delta.x < 0) {
    moveX = -evt.delta.x > dialogLeft ? -dialogLeft : evt.delta.x
  } else {
    moveX = evt.delta.x > dialogRight ? dialogRight : evt.delta.x
  }
  if (evt.delta.y < 0) {
    moveY = -evt.delta.y > dialogTop ? -dialogTop : evt.delta.y
  } else {
    moveY = evt.delta.y > dialogBottom ? dialogBottom : evt.delta.y
  }
  dialogPosition.value.x = dialogPosition.value.x + moveX
  dialogPosition.value.y = dialogPosition.value.y + moveY
}
defineExpose({ open })
</script>
