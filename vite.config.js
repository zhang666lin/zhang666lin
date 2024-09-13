import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { defineConfig, loadEnv } from 'vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import { webUpdateNotice } from '@plugin-web-update-notification/vite'

function generateEnvJsonPlugin() {
  let outDir, content
  return {
    name: 'generateFile',
    apply: 'build',
    configResolved(resolvedConfig) {
      outDir = resolvedConfig.build.outDir
      const env = loadEnv(resolvedConfig.mode, process.cwd())
      content = JSON.stringify(
        {
          base_url: env.VITE_APP_API_URL,
          base_url2: env.VITE_APP_API_URL2,
          authing_url: env.VITE_APP_AUTHING_URL,
        },
        null,
        2,
      ).replace(/\n/g, '\n')
    },
    closeBundle() {
      // 在生成完 dist 且已经写入磁盘后执行
      const filepath = path.resolve(outDir, 'config.json')
      fs.writeFileSync(filepath, content)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: { exclude: ['node_modules/.vite', 'node_modules/.cache'] },
  server: {
    cors: true,
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
      sassVariables: 'src/styles/quasar-variables.scss',
    }),
    generateEnvJsonPlugin(),
    // element-plus 自动按需导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
    }),
    webUpdateNotice({
      checkInterval: 30 * 60 * 1000,
      checkOnLoadFileError: true,
      hiddenDefaultNotification: true,
    }),
    // put it the last one
    visualizer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "/src/styles/element-var.scss" as *;`,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash'],
          antv: ['@antv/g6'],
          quasar: ['quasar'],
          'element-plus': ['element-plus'],
        },
      },
    },
  },
})
