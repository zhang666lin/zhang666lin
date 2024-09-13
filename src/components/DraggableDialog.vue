<template>
  <el-dialog
    v-model="visibleDialog"
    :title="title"
    :width="dialogWidth"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal="false"
    draggable
    :show-close="false"
  >
    <template #header>
      <div class="q-pa-none row justify-between items-center">
        <div class="title">{{ title }}</div>
        <q-btn
          icon="close"
          class="q-mr-md"
          size="small"
          flat
          @click="() => handleDialogStatus(false)"
        ></q-btn>
      </div>
    </template>
    <slot></slot>
    <template #footer>
      <span v-if="!hideFooter" class="dialog-footer">
        <q-btn
          no-caps
          class="q-mr-md"
          @click="() => handleDialogStatus(false)"
          >{{ cancelBtn }}</q-btn
        >
        <q-btn
          no-caps
          color="primary"
          :loading="loading"
          @click="() => handleDialogStatus(true)"
        >
          {{ confirmBtn }}
        </q-btn>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, watch } from 'vue'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  confirmBtn: {
    type: String,
    default: () => {
      const { t } = useI18n()
      return t('sys.submit')
    },
  },
  cancelBtn: {
    type: String,
    default: () => {
      const { t } = useI18n()
      return t('sys.cancel')
    },
  },
  dialogWidth: {
    type: String,
    default: '50%',
  },
  cancelFn: {
    type: Function,
    default: () => {
      return () => {}
    },
  },
  confirmFn: {
    type: Function,
    default: () => {
      return () => {}
    },
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
})

const visibleDialog = ref(false)
const loading = ref(false)
const emit = defineEmits(['closeDialog'])

async function handleDialogStatus(status) {
  if (status && _.isFunction(props.confirmFn)) {
    loading.value = true
    const res = await props.confirmFn()
    if (res) {
      visibleDialog.value = false
      emit('closeDialog', true)
    }
  }
  if (!status && _.isFunction(props.cancelFn)) {
    props.cancelFn()
    visibleDialog.value = false
    emit('closeDialog', false)
  }
  loading.value = false
}

watch(
  () => props.visible,
  newValue => {
    visibleDialog.value = newValue
  },
)
</script>
<style scoped lang="scss">
.title {
  font-size: 20px;
}
</style>
