import { defineStore } from 'pinia'

import { store } from '@/store'
import asyncRoutes from '@/router/routes/async'
import { rootRoute, notFoundRoute } from '@/router/routes/basic'
import { fetchPermissionResource } from '@/api/system'

export const usePermissionStore = defineStore({
  id: 'permission',
  state: () => ({
    isAddedAsyncRoutes: false,
    permissionButtons: [],
    permissionRoutes: [],
  }),
  getters: {
    getPermissionButtons(state) {
      return state.permissionButtons
    },
    getPermissionRoutes(state) {
      return state.permissionRoutes
    },
    getIsAddedAsyncRoutes(state) {
      return state.isAddedAsyncRoutes
    },
  },
  actions: {
    setAddedAsyncRoutes(info) {
      this.isAddedAsyncRoutes = info
    },
    async buildRoutesButtonsAction() {
      const isDev = import.meta.env.DEV
      if (isDev) {
        this.permissionRoutes = combineRoutes(
          rootRoute,
          asyncRoutes,
          notFoundRoute,
        )
        this.permissionButtons = ['*']
        return
      }
      const resource = await fetchPermissionResource()
      const isSystemAdmin = resource.some(item => item.code === '*')
      if (isSystemAdmin) {
        this.permissionRoutes = combineRoutes(
          rootRoute,
          asyncRoutes,
          notFoundRoute,
        )
        this.permissionButtons = ['*']
      } else {
        const menusResource = resource
          .filter(item => item.type === 'MENU')
          .map(item => item.code)
        const permissionRoutes = buildAsyncRoutes(asyncRoutes, menusResource)
        this.permissionRoutes = combineRoutes(
          rootRoute,
          permissionRoutes,
          notFoundRoute,
        )
        this.permissionButtons = resource
          .filter(item => item.type === 'BUTTON')
          .map(item => item.code)
      }
    },
  },
})

function buildAsyncRoutes(routes, resource) {
  return routes.filter(route => {
    if (resource.includes(route.name)) {
      if (route.children) {
        route.children = buildAsyncRoutes(route.children, resource)
        // 根据实际权限情况，重定向到第一个子路由
        if (route.children.length > 0) {
          route.redirect = route.path + '/' + route.children[0].path
        }
      }
      return resource.includes(route.name)
    }
    return false
  })
}

/** 组合成最终的路由表 */
function combineRoutes(rootRoute, asyncRoutes, notFoundRoute) {
  asyncRoutes.map((i, index) => {
    i.meta.orderNo = index
  })
  const withoutChildAsyncRoutes = asyncRoutes.filter(i => {
    return !i?.children
  })
  const withChildAsyncRoutes = asyncRoutes.filter(i => {
    return i?.children?.length
  })
  rootRoute.children = withoutChildAsyncRoutes
  // 改写根路由重定向地址：有权限路由中的第一个路由地址
  rootRoute.redirect = [
    ...withoutChildAsyncRoutes,
    ...withChildAsyncRoutes,
  ][0]?.path
  return [rootRoute, ...withChildAsyncRoutes, notFoundRoute]
}

/** setup 外部使用 */
export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
