<template>
  <q-splitter
    v-model="splitterModel"
    :limits="[0, 360]"
    unit="px"
    class="col"
    :disable="true"
    @update:model-value="handleExpand"
  >
    <template #before>
      <div class="full-height custom-overflow">
        <div class="q-pr-md full-height">
          <slot name="filter-bar" />
        </div>
      </div>
    </template>
    <template #after>
      <div class="fit column q-pl-md">
        <div class="row no-wrap items-center q-pb-sm">
          <q-btn
            flat
            dense
            round
            color="primary"
            icon="menu"
            class="q-mr-sm"
            @click="setFilterBarVisible"
          />
          <slot name="view-select" />
        </div>
        <slot name="table" />
      </div>
    </template>
  </q-splitter>
</template>

<script setup>
import { ref } from 'vue'

const filterBarWidth = 280
const splitterModel = ref(filterBarWidth)
const isExpand = ref(true)
function handleExpand(value) {
  isExpand.value = value > 50
}
function setFilterBarVisible() {
  if (splitterModel.value) {
    splitterModel.value = 0
  } else {
    splitterModel.value = filterBarWidth
  }
}
</script>

<style lang="scss" scoped>
:deep(.q-splitter__before) {
  transition: all 0.2s;
}
.custom-overflow {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
