<template>
  <div>
    <q-btn
      color="white"
      text-color="primary"
      icon="settings"
      padding="xs"
      class="btn-border"
      style="z-index: 4"
      @click="showPanel"
    />
    <q-dialog
      v-model="panelVisible"
      square
      position="right"
      content-class="setting-dialog"
    >
      <q-card style="min-width: 300px" class="column full-height">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ t('sys.tableHeaderSetting') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="panelVisible = false" />
        </q-card-section>
        <q-card-section class="col q-pt-none q-px-lg">
          <Draggable
            v-model="draggableArr"
            group="columns"
            v-bind="dragOptions"
            item-key="name"
            class="full-height scroll"
            @start="onDragStart"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <div
                class="column-item row justify-between items-center q-px-sm hover-bg"
              >
                <q-icon
                  name="drag_indicator"
                  size="xs"
                  color="grey-7"
                  class="q-ma-xs"
                />
                <span class="column-label">{{ element.label }}</span>
                <q-toggle
                  v-model="element.show"
                  size="sm"
                  :disable="isOnlyOneColumn && element.show"
                  @update:model-value="updateColumns"
                >
                  <template v-if="isOnlyOneColumn && element.show">
                    <q-tooltip
                      anchor="center left"
                      self="center right"
                      :offset="[10, 10]"
                    >
                      {{ t('boards.oneColumnAtLeast') }}
                    </q-tooltip>
                  </template>
                </q-toggle>
              </div>
            </template>
          </Draggable>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import _ from 'lodash'
import Draggable from 'vuedraggable'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'ColumnSetting' })

const { t } = useI18n()
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
})

const panelVisible = ref(false)
const draggableArr = ref([])
const isDragging = ref(false)
const dragOptions = {
  animation: 200,
  group: 'columns',
  disabled: false,
  ghostClass: 'ghost',
  scrollSensitivity: 200,
  forceFallback: true,
}
const isOnlyOneColumn = computed(() => {
  return draggableArr.value.filter(item => item.show).length === 1
})
const emit = defineEmits(['close', 'updateColumns'])
watch(panelVisible, val => {
  if (!val) {
    emit('close')
  }
})

function showPanel() {
  draggableArr.value = _.cloneDeep(props.columns)
  panelVisible.value = true
}
function updateColumns() {
  emit('updateColumns', draggableArr.value)
}
function onDragStart() {
  isDragging.value = true
}
function onDragEnd() {
  isDragging.value = false
  updateColumns()
}
</script>

<style lang="scss" scoped>
.btn-border {
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}
.column-item {
  background-color: $grey-2;
  border: 1px solid $grey-4;
  &:hover {
    cursor: move;
  }
  .column-label {
    user-select: none;
    flex: 1;
  }
}
.ghost {
  opacity: 0.5;
  background: $blue-2;
  border: 2px dashed $primary;
}
.setting-dialog {
  :global(.q-dialog__inner--minimized) {
    padding: 0;
  }
  :global(.q-dialog__inner--minimized > div) {
    max-height: 100%;
  }
}
</style>
