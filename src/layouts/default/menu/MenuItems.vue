<template>
  <template v-for="item in currentLevelMenu" :key="item.path">
    <q-expansion-item
      v-if="item.children?.length > 0"
      :model-value="expansionItemIsMatched(item)"
      :header-class="getExpansionItemClass(item)"
    >
      <template #header>
        <q-item-section avatar>
          <Icon
            v-if="item?.meta?.icon"
            :icon="item?.meta?.icon"
            style="font-size: 1.7em"
          />
        </q-item-section>
        <q-item-section :class="{ 'q-pl-lg': !item?.meta?.icon }"
          >{{ t(item?.meta?.title) }}
        </q-item-section>
      </template>
      <MenuItems :routes="item.children" />
    </q-expansion-item>
    <q-item
      v-else
      clickable
      :to="{ name: item.name }"
      :class="getItemClass(item)"
    >
      <q-item-section avatar>
        <Icon
          v-if="item?.meta?.icon"
          :icon="item?.meta?.icon"
          style="font-size: 1.7em"
        />
      </q-item-section>
      <q-item-section :class="{ 'q-pl-lg': !item?.meta?.icon }"
        >{{ t(item?.meta?.title) }}
      </q-item-section>
    </q-item>
  </template>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  routes: {
    type: Array,
    default: () => [],
  },
})

const { t } = useI18n()

const currentLevelMenu = computed(() => {
  return props.routes.filter(i => {
    if (i.meta) return !i.meta.hideMenu
    return true
  })
})

const { currentRoute } = useRouter()
function expansionItemIsMatched(item) {
  return !!currentRoute.value.matched.find(i => i.name === item.name)
}
function getExpansionItemClass(item) {
  const isMatched = expansionItemIsMatched(item)
  return isMatched ? 'bg-blue-grey-1 text-primary text-bold' : 'text-grey-7'
}
function getItemClass(item) {
  const isMatched = currentRoute.value.name === item.name
  return isMatched ? 'bg-blue-grey-1 text-primary text-bold' : 'text-grey-7'
}
</script>

<style lang="scss" scoped>
:deep(.q-item__section--avatar) {
  min-width: 0;
}
:deep(.q-item__section) {
  text-wrap: nowrap;
}
</style>
