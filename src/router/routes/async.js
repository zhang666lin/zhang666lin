const Layout = () => import('@/layouts/default/index.vue')

const orderRoute = {
  path: '/order',
  name: 'Order',
  component: () => import('@/views/order/index.vue'),
  meta: {
    title: 'menu.order',
    icon: 'mdi:list-box-outline',
  },
}

const basicInfoRoute = {
  path: '/basic-info',
  name: 'BasicInfo',
  component: Layout,
  redirect: '/basic-info/airline',
  meta: {
    title: 'common.baseInfo',
    icon: 'material-symbols:feed-outline',
  },
  children: [
    {
      path: 'airline',
      name: 'Airline',
      component: () => import('@/views/basicInfo/airline/index.vue'),
      meta: {
        title: 'menu.basicairline',
      },
    },
    {
      path: 'ground',
      name: 'Ground',
      component: () => import('@/views/basicInfo/ground/index.vue'),
      meta: {
        title: 'menu.basicground',
      },
    },
    {
      path: 'airline-ground',
      name: 'AirlineGround',
      component: () => import('@/views/basicInfo/airlineGround/index.vue'),
      meta: {
        title: 'menu.airlineGround',
      },
    },
    {
      path: 'customer',
      name: 'Customer',
      component: () => import('@/views/basicInfo/customer/index.vue'),
      meta: {
        title: 'menu.customer',
      },
    },
    {
      path: 'delivery-code-info',
      name: 'DeliveryCodeInfo',
      component: () => import('@/views/basicInfo/deliveryCodeInfo/index.vue'),
      meta: {
        title: 'menu.deliveryCodeInfo',
      },
    },
    {
      path: 'destination',
      name: 'Destination',
      component: () => import('@/views/basicInfo/destination/index.vue'),
      meta: {
        title: 'menu.destination',
      },
    },
    {
      path: 'sorting-rule',
      name: 'SortingRule',
      component: () => import('@/views/basicInfo/sortingRule/index.vue'),
      meta: {
        title: 'menu.sortingRule',
      },
    },
  ],
}

const declarationRoute = {
  path: '/declaration',
  name: 'Declaration',
  component: Layout,
  redirect: '/declaration/ics2',
  meta: {
    title: 'menu.declaration',
    icon: 'material-symbols:publish-rounded',
  },
  children: [
    {
      path: 'ics2',
      name: 'Ics2',
      component: () => import('@/views/declaration/ics2/index.vue'),
      meta: {
        title: 'menu.ics2',
      },
    },
    {
      path: 'suma',
      name: 'Suma',
      component: () => import('@/views/declaration/suma/index.vue'),
      meta: {
        title: 'menu.suma',
      },
    },
  ],
}

const timeManageRoute = {
  path: '/time-manage',
  name: 'TimeManage',
  component: () => import('@/views/timeManage/index.vue'),
  meta: {
    title: 'menu.timeManage',
    icon: 'mdi:clock-time-four-outline',
  },
}

const boardsRoute = {
  path: '/boards',
  name: 'Boards',
  component: Layout,
  redirect: '/boards/order',
  meta: {
    title: 'menu.boards',
    icon: 'mdi:view-dashboard-outline',
  },
  children: [
    {
      path: 'order',
      name: 'OrderBoard',
      component: () => import('@/views/boards/order/index.vue'),
      meta: {
        title: 'menu.orderBoard',
      },
    },
    {
      path: 'batch',
      name: 'BatchBoard',
      component: () => import('@/views/boards/batch/index.vue'),
      meta: {
        title: 'menu.batchBoard',
      },
    },
    {
      path: 'bulk',
      name: 'BulkBoard',
      component: () => import('@/views/boards/bulk/index.vue'),
      meta: {
        title: 'menu.bulkBoard',
      },
    },
    {
      path: 'flat',
      name: 'FlatBoard',
      component: () => import('@/views/boards/flat/index.vue'),
      meta: {
        title: 'menu.flatBoard',
      },
    },
    {
      path: 'main-line',
      name: 'MainLineBoard',
      component: () => import('@/views/boards/mainLine/index.vue'),
      meta: {
        title: 'menu.mainLineBoard',
      },
    },
    {
      path: 'pmc',
      name: 'PmcBoard',
      component: () => import('@/views/boards/pmc/index.vue'),
      meta: {
        title: 'menu.pmcBoard',
      },
    },
  ],
}

const pmcRoute = {
  path: '/pmc',
  name: 'Pmc',
  component: () => import('@/views/pmc/index.vue'),
  meta: {
    title: 'menu.pmc',
    icon: 'material-symbols:stacks-outline-rounded',
  },
}

// const playgroundRoute = {
//   path: '/playground',
//   name: 'Playground',
//   component: () => import('@/views/playground/index.vue'),
//   meta: {
//     title: 'playground',
//   },
// }

export default [
  boardsRoute,
  orderRoute,
  basicInfoRoute,
  declarationRoute,
  timeManageRoute,
  pmcRoute,
  // playgroundRoute,
]
