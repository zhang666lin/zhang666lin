<template>
  <q-btn flat round dense icon="menu" class="q-mr-sm" @click="setMenuMini" />
</template>

<script setup>
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
function setMenuMini() {
  const mini = !appStore.getMenuSetting.mini
  appStore.setMenuSetting({ mini })
}
</script>
