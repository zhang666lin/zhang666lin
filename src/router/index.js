import { createRouter, createWebHashHistory } from 'vue-router'

import { notFoundRoute } from './routes/basic'

/**
 * 获取权限前如果路由表为空
 * 无法匹配到任何路由 vue-router 会有警告
 * 因此用 notFoundRoute 兜底消除警告
 * 获取权限后会重新生成路由表
 */
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [notFoundRoute],
})

export function setupRouter(app) {
  app.use(router)
}
