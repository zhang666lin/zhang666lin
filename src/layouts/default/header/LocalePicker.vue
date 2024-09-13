<template>
  <q-btn flat color="white" size="md" class="row items-center lang-btn">
    <q-icon name="language" size="sm" />
    <div class="row items-center justify-center text-weight-bold">
      {{ localeText }}
    </div>
    <q-menu
      fit
      :offset="[0, 14]"
      transition-show="jump-down"
      transition-hide="jump-up"
    >
      <q-list>
        <q-item
          v-for="i in localesList"
          :key="i.value"
          v-close-popup
          clickable
          :active="currentLocale === i.value"
          @click="toggleLocale(i.value)"
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
import { useQuasar } from 'quasar'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAppStore } from '@/store/modules/app'
const $q = useQuasar()
const appStore = useAppStore()
const { t } = useI18n()

const localesList = [
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Français', value: 'fr' },
]
const currentLocale = ref(appStore.getLocale)

const localeText = computed(() => {
  return localesList.find(i => i.value === currentLocale.value)?.label
})

function toggleLocale(val) {
  if (currentLocale.value === val) return
  $q.dialog({
    title: t('sys.prompt'),
    message: t('sys.changeLang'),
    cancel: true,
    persistent: false,
  }).onOk(() => {
    appStore.setLocale(val)
    location.reload()
  })
}
</script>

<style lang="scss" scoped>
.lang-btn {
  text-transform: none;
  padding: 4px 8px;
}
</style>
