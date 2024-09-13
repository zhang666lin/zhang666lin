<template>
  <q-page-container style="height: 100vh">
    <div class="q-pa-md fit column no-wrap">
      <Tabs />
      <RouterView v-slot="{ Component, route }">
        <KeepAlive :max="keepAliveMax" :include="cacheTabList">
          <component :is="Component" v-if="refreshFlag" :key="route.fullPath" />
        </KeepAlive>
      </RouterView>
    </div>
  </q-page-container>
</template>
<script setup>
import { computed } from 'vue'

import Tabs from '../tabs/index.vue'

import { useTabsStore } from '@/store/modules/tabs.js'

const tabsStore = useTabsStore()
const keepAliveMax = tabsStore.tabsMax
const cacheTabList = computed(() => tabsStore.getCacheTabList)
const refreshFlag = computed(() => tabsStore.refreshFlag)
</script>
