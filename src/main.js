import 'quasar/src/css/index.sass'

import { createApp } from 'vue'

import App from './App.vue'

import { registerGlobComp } from '@/components'
import { registerI18n } from '@/locales'
import { router, setupRouter } from '@/router'
import { setupRouterGuard } from '@/router/guard'
import { setupStore } from '@/store'
import { setupGlobDirectives } from '@/directives'

import '@/styles/index.scss'

function bootstrap() {
  const app = createApp(App)

  // 配置 store
  setupStore(app)

  // 注册全局组件(quasar提供的ui组件 & 自定义组件)
  registerGlobComp(app)

  // 集成i18n
  registerI18n(app)

  // 配置路由器
  setupRouter(app)

  // 注册全局指令
  setupGlobDirectives(app)

  // 配置路由守卫
  setupRouterGuard(router)

  app.mount('#app')
}

bootstrap()
