import { defineStore } from 'pinia'

import { store } from '@/store'

export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    menuSetting: { mini: true },
    locale: 'en',
  }),
  getters: {
    getMenuSetting(state) {
      return state.menuSetting
    },
    getLocale(state) {
      return state.locale
    },
  },
  actions: {
    setMenuSetting(info) {
      this.menuSetting = { ...this.menuSetting, ...info }
    },
    setLocale(info) {
      this.locale = info
    },
  },
  persist: true,
})

/** setup 外部使用 */
export function useAppStoreWithOut() {
  return useAppStore(store)
}
