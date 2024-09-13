export const rootRoute = {
  path: '/',
  name: 'Root',
  component: () => import('@/layouts/default/index.vue'),
  redirect: '/order',
  meta: {
    hideMenu: true,
  },
}

export const notFoundRoute = {
  path: '/:path(.*)*',
  name: 'NotFound', // 设置name值，任何页面刷新都将显示404界面
  component: () => import('@/views/notFound/index.vue'),
  meta: {
    hideTab: true,
    hideMenu: true,
  },
}
