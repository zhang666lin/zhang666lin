import { useTabsStoreWithOut } from '@/store/modules/tabs'

export function createTabsGuard(router) {
  router.beforeEach(async to => {
    const tabsStore = useTabsStoreWithOut()
    if (to.meta && !to.meta.hideTab) {
      tabsStore.addTab(to.name)
    }
    return true
  })
}
