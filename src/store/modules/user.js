import { defineStore } from 'pinia'

import { store } from '@/store'

const WINDOW_KEY = import.meta.env.VITE_APP_WINDOW_KEY
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: '',
    userInfo: null,
    port: null, // 当前登录的口岸
  }),
  getters: {
    getToken(state) {
      return state.token || ''
    },
    getUserInfo(state) {
      return state.userInfo
    },
    getPort(state) {
      return state.port || state.getPortList[0]
    },
    getPortList(state) {
      return (state.userInfo?.port_list ?? []).map(i => {
        return { label: i.code, value: i.code }
      })
    },
    getWahList(state) {
      return (
        state.userInfo.port_list.find(i => i.code === state.getPort.value)
          ?.wah_list || []
      )
    },
  },
  actions: {
    setToken(info) {
      this.token = info || ''
    },
    setUserInfo(info) {
      this.userInfo = info || null
    },
    setPort(info) {
      this.port = info || null
    },
    resetState() {
      this.token = ''
      this.userInfo = null
      this.port = null
    },
    /**
     * 登出逻辑：
     * 1. 清空 store 中的 token 和 userInfo
     * 2. 跳转到 authing 登出地址（该地址写在前端）
     * 3. 登出成功后，authing 会跳转回来（不会携带code）
     * 4. 此时没有 token 和 code，请求后端接口获取登录地址
     * 5. 跳转至登录地址(第4点,第5点 见 permissionGuard.js)
     */
    logout() {
      this.resetState()
      window.location.href =
        window.$shaoke[WINDOW_KEY].authing_url +
        `/login/profile/logout?redirect_uri=${window.location.href}`
    },
  },
  persist: true,
})

/* setup 外部使用 */
export function useUserStoreWithOut() {
  return useUserStore(store)
}
