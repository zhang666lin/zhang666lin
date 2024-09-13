<template>
  <q-tabs
    :model-value="activeTab"
    inline-label
    outside-arrows
    mobile-arrows
    align="left"
    dense
    active-class="text-primary"
    content-class="text-grey-7 text-no-wrap"
    @update:model-value="goToPage($event, router)"
  >
    <template v-for="i in tabList" :key="i.name">
      <q-tab
        :name="i.name"
        no-caps
        class="q-px-none"
        :ripple="false"
        content-class="row items-center no-wrap border-radius-4 q-py-none full-height"
        @contextmenu.prevent="openMenu(i.name)"
      >
        <template v-if="tabList.length > 1">
          <div
            v-overflow-tooltip="{ placement: 'bottom', offset: [14, 4] }"
            class="q-pa-sm ellipsis text-left full-height"
            style="width: 146px"
          >
            {{ i.title && t(i.title) }}
          </div>
          <q-btn
            icon="close"
            size="xs"
            style="margin-top: 2px"
            class="q-mr-sm"
            flat
            dense
            @click.stop="closeTab(i.name, router)"
          />
        </template>
        <div
          v-else
          v-overflow-tooltip="{ placement: 'bottom', offset: [2, 4] }"
          class="q-pa-sm ellipsis text-left full-height"
          style="width: 146px"
        >
          {{ i.title && t(i.title) }}
        </div>
        <q-menu
          v-if="showMeneTab === i.name"
          v-model="menuVisible"
          :offset="[0, 4]"
          @hide="showMeneTab = ''"
        >
          <q-list style="min-width: 158px">
            <q-item
              v-close-popup
              :disable="tabList.length <= 1"
              clickable
              @click="closeOthers(i.name, router)"
            >
              <q-item-section>{{ t('sys.closeOtherTab') }}</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              :disable="activeTab !== i.name"
              clickable
              @click="refreshPage(i.name, router)"
            >
              <q-item-section>{{ t('sys.refreshCurrentPage') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-tab>
    </template>
  </q-tabs>
  <q-separator class="q-mb-md" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useTabsStore } from '@/store/modules/tabs'
const router = useRouter()
const { t } = useI18n()

const tabsStore = useTabsStore()
const { closeTab, closeOthers, goToPage, refreshPage } = tabsStore

const tabList = computed(() => {
  const routes = router.getRoutes()
  return tabsStore.getTabList.map(i => {
    const route = routes.find(r => r.name === i)
    return {
      name: i,
      title: route?.meta?.title,
    }
  })
})
const activeTab = computed(() => router.currentRoute.value.name)

const menuVisible = ref(false)
const showMeneTab = ref('')
function openMenu(name) {
  menuVisible.value = true
  showMeneTab.value = name
}
</script>
