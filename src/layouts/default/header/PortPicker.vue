<template>
  <q-btn
    flat
    color="white"
    class="row items-center port-btn"
    icon-right="arrow_drop_down"
  >
    <div class="text-weight-bold port-text">
      {{ portText }}
    </div>
    <q-menu
      fit
      :offset="[0, 14]"
      transition-show="jump-down"
      transition-hide="jump-up"
    >
      <q-list>
        <q-item
          v-for="i in portList"
          :key="i.value"
          v-close-popup
          clickable
          :active="currentPort === i.value"
          @click="togglePort(i.value)"
        >
          <q-item-section class="text-center">
            {{ i.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { Dialog } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const portList = userStore.getPortList
const currentPort = userStore.getPort
const { t } = useI18n()

const portText = computed(() => {
  return portList.find(i => i.value === currentPort.value)?.label
})

function togglePort(val) {
  if (currentPort.value === val) return
  Dialog.create({
    title: t('sys.prompt'),
    message: t('sys.changePort'),
    cancel: true,
    persistent: false,
  }).onOk(() => {
    userStore.setPort(portList.find(i => i.value === val))
    location.reload()
  })
}
</script>

<style lang="scss" scoped>
.port-btn {
  text-transform: none;
  padding: 4px 8px;
  margin: 0 10px;
}
.port-text {
  font-size: 32px;
}
</style>
