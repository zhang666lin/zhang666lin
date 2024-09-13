import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { getParamInSearch, deleteAllParamsInSearch } from '@/utils/location'
import {
  fetchAuthingLoginUrl,
  fetchTokenByCode,
  fetchUserInfo,
} from '@/api/system'

export function createPermissionGuard(router) {
  router.beforeEach(async to => {
    const userStore = useUserStoreWithOut()
    const token = userStore.getToken
    if (token) {
      // TODO: 异步获取用户信息和资源权限，可以优化为 Promise.all
      // 获取用户信息
      if (!userStore.getUserInfo) {
        const userInfo = await fetchUserInfo()
        userStore.setUserInfo(userInfo)
      }
      // 获取资源权限，动态添加路由
      const permissionStore = usePermissionStoreWithOut()
      if (!permissionStore.isAddedAsyncRoutes) {
        await permissionStore.buildRoutesButtonsAction()
        permissionStore.getPermissionRoutes.forEach(route => {
          router.addRoute(route)
        })
        permissionStore.setAddedAsyncRoutes(true)
        return { path: to.fullPath, replace: true } // 再次触发权限路由守卫
      }
      return true // 结束权限路由守卫校验
    }
    const code = getParamInSearch('code')
    if (!code) {
      // 没有 code ，需要跳转到登录页，登录成功后会带上 code 跳转回来
      const authingLoginUrl = await fetchAuthingLoginUrl(window.location.href)
      window.location.href = authingLoginUrl
      return false // 阻止路由跳转
    }
    // 有 code 说明是从登录页跳转回来的，用 code 换取 token
    deleteAllParamsInSearch()
    const id_token = await fetchTokenByCode(code, window.location.href)
    userStore.setToken(id_token)
    return { path: to.fullPath, replace: true } // 再次触发权限路由守卫
  })
}
