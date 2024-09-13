import { createPermissionGuard } from './permissionGuard.js'
import { createTabsGuard } from './tabsGuard.js'
/*
tip: 可以在此处引入更多 其他功能的路由守卫
比如: 表单未提交的提示，添加页面跳转时loading，校验前端版本...等等
再在 setupRouterGuard 中执行，但要注意顺序
import { createXxxGuard } from './xxxGuard'
*/

export function setupRouterGuard(router) {
  createPermissionGuard(router)
  createTabsGuard(router)
}
