<template>
  <div class="row no-wrap items-center">
    <q-select
      ref="selectRef"
      v-model="model"
      style="min-width: 220px"
      outlined
      dense
      clearable
      :label="t('boards.view')"
      :options="options"
      :placeholder="t('boards.selectViewPls')"
      class="fit q-mr-sm"
      :loading="loading"
      @update:model-value="selectView"
    >
    </q-select>
    <q-btn color="primary" icon="add" class="q-px-sm" @click="addView" />
  </div>
  <DraggableDialog
    :visible="visible"
    :title="title"
    :cancel-btn="t('sys.cancel')"
    :confirm-btn="t('sys.submit')"
    :cancel-fn="closeDialog"
    :confirm-fn="confirmFn"
    :dialog-width="'30%'"
    append-to-body
    @close-dialog="closeDialog"
  >
    <div class="q-px-md">
      <q-input
        v-model="viewName"
        class="q-mb-sm"
        outlined
        style="max-width: 400px; height: 40px"
        dense
        clearable
        reactive-rules
        :placeholder="t('sys.fieldNotEmpty')"
        :label="t('boards.viewName')"
      />
    </div>
  </DraggableDialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { getViewsApi } from '@/api/boards'
import DraggableDialog from '@/components/DraggableDialog.vue'

const emits = defineEmits(['select', 'createView'])
const props = defineProps({
  type: {
    type: String,
    default: '',
  },
})
const { t } = useI18n()
const model = ref('')
// 视图弹窗
const visible = ref(false)
const title = ref(t('boards.addView'))
const viewName = ref('')
const options = ref([])
function addView() {
  visible.value = true
}
function selectView(view) {
  emits('select', view?.view_content)
}
function closeDialog() {
  visible.value = false
  viewName.value = ''
}
function confirmFn() {
  emits('createView', viewName.value)
  closeDialog()
}

const loading = ref(false)

function getViewList(viewName) {
  loading.value = true
  getViewsApi(props.type)
    .then(res => {
      options.value = res.data.map(item => ({
        label: item.view_name,
        value: item.view_id,
        view_content: item.view_content,
      }))
      const temp = options.value.find(i => i.label === viewName)
      if (viewName && temp) {
        setValue(temp)
      } else {
        setValue(options.value[0])
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function setValue(val) {
  model.value = val
  selectView(model.value)
}

onMounted(() => {
  getViewList()
})

defineExpose({ getViewList, setValue })
</script>
