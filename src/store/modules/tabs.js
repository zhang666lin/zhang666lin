import { defineStore } from 'pinia'
import { nextTick } from 'vue'

import { store } from '@/store'

export const useTabsStore = defineStore({
  id: 'tabs',
  state: () => ({
    cacheTabList: [],
    tabList: [],
    tabsMax: 10,
    refreshFlag: true,
  }),
  getters: {
    getCacheTabList(state) {
      return state.cacheTabList
    },
    getTabList(state) {
      return state.tabList
    },
    getRefreshFlag(state) {
      return state.refreshFlag
    },
  },
  actions: {
    addTab(name) {
      if (!this.tabList.includes(name)) {
        this.tabList.push(name)
      }
      if (this.tabList.length > this.tabsMax) {
        this.tabList.shift()
      }
      this.updateCacheTab()
    },
    closeTab(name, router) {
      const activeName = router.currentRoute.value.name
      if (activeName === name) {
        const length = this.tabList.length // 不会小于2
        const index = this.tabList.findIndex(i => i === name)
        if (index + 1 < length) {
          this.goToPage(this.tabList[index + 1], router)
        } else {
          this.goToPage(this.tabList[length - 2], router)
        }
      }
      this.tabList = this.tabList.filter(i => i !== name)
      this.updateCacheTab()
    },
    closeOthers(name, router) {
      this.tabList = [name]
      this.goToPage(name, router)
      this.updateCacheTab()
    },
    goToPage(name, router) {
      router.push({ name })
    },
    refreshPage(name) {
      this.refreshFlag = false
      this.cacheTabList = this.cacheTabList.filter(i => i !== name)
      nextTick(() => {
        this.refreshFlag = true
        this.updateCacheTab()
      })
    },
    updateCacheTab() {
      this.cacheTabList = [...this.tabList]
    },
  },
})

/** setup 外部使用 */
export function useTabsStoreWithOut() {
  return useTabsStore(store)
}
