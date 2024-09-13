<template>
  <q-drawer
    v-model="menuVisible"
    :elevated="isMini"
    :bordered="!isMini"
    show-if-above
    :width="width"
    :mini-width="56"
    :breakpoint="500"
    :mini="miniState"
    :mini-to-overlay="isMini"
    @mouseover="mouseover"
    @mouseout="mouseout"
  >
    <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
      <q-list ref="menuListRef">
        <MenuItems :routes="routes" />
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import _ from 'lodash'

import MenuItems from './MenuItems.vue'

import { useAppStore } from '@/store/modules/app'

const menuListRef = ref(null)
const { width } = useElementSize(menuListRef)
const menuVisible = ref(false)
const miniState = ref(true)
const appStore = useAppStore()
const isMini = computed(() => {
  return appStore.getMenuSetting.mini
})
function mouseover() {
  if (isMini.value) {
    miniState.value = false
  }
}
function mouseout() {
  if (isMini.value) {
    miniState.value = true
  }
}
watch(
  isMini,
  val => {
    miniState.value = val
  },
  { immediate: true },
)

const router = useRouter()
const routes = ref([])
watch(
  () => router,
  val => {
    routes.value = val.getRoutes().filter(r => {
      // 过滤掉二级路由
      return (r.path.match(/\//g) || []).length === 1
    })
    routes.value = _.sortBy(routes.value, ['meta.orderNo'])
  },
  { deep: true, immediate: true },
)
</script>
