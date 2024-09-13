import axios from 'axios'
import { Dialog } from 'quasar'
import _ from 'lodash'

import { useUserStoreWithOut, useUserStore } from '@/store/modules/user'
import { showError } from '@/components'
import { t } from '@/locales'

const WINDOW_KEY = import.meta.env.VITE_APP_WINDOW_KEY
const axiosInstance = axios.create({
  timeout: 5 * 60000,
  withCredentials: true,
  crossDomain: true,
})

// 获取 config.json 中的环境变量，可以在配置中心修改
function getEnvConfig() {
  return new Promise((resolve, reject) => {
    fetch('/config.json')
      .then(res => {
        res
          .json()
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 请求队列
const requestQueue = new Map()
function genRequestKey(config) {
  return config.method + '&' + config.url
}
function addRequestToQueue(config) {
  const requestKey = genRequestKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      if (!requestQueue.has(requestKey)) {
        requestQueue.set(requestKey, cancel)
      }
    })
}
function removeRequestInQueue(config) {
  const requestKey = genRequestKey(config)
  if (requestQueue.has(requestKey)) {
    const cancelToken = requestQueue.get(requestKey)
    cancelToken(requestKey)
    requestQueue.delete(requestKey)
  }
}

// 请求拦截
axiosInstance.interceptors.request.use(
  async config => {
    removeRequestInQueue(config)
    const ignoreCancelToken = config?.ignoreCancelToken ?? false
    !ignoreCancelToken && addRequestToQueue(config)
    const userStore = useUserStore()
    if (!config.baseURL) {
      if (!window.$shaoke) window.$shaoke = {}
      if (!window.$shaoke[WINDOW_KEY]) {
        if (import.meta.env.DEV) {
          window.$shaoke[WINDOW_KEY] = {
            ...window.$shaoke[WINDOW_KEY],
            base_url: import.meta.env.VITE_APP_API_URL,
            base_url2: import.meta.env.VITE_APP_API_URL2,
            authing_url: import.meta.env.VITE_APP_AUTHING_URL,
          }
        } else {
          const envConfig = await getEnvConfig()
          window.$shaoke[WINDOW_KEY] = {
            ...window.$shaoke[WINDOW_KEY],
            ...envConfig,
          }
        }
      }
      if (config.url.startsWith('__poms')) {
        // url 以 __poms 开头，则使用 base_url2 (后端 java 新服务)
        config.url = config.url.replace('__poms', '')
        config.baseURL = window.$shaoke[WINDOW_KEY].base_url2
      } else {
        config.baseURL = window.$shaoke[WINDOW_KEY].base_url
      }
    }
    const token = useUserStoreWithOut().getToken
    const currentPort = userStore.getPort
    // 支持自定义headers
    config.headers = {
      ...config.headers,
      'Content-Type':
        config.headers['Content-Type'] || 'application/json;charset=utf-8;',
      Accept: '*/*',
      Authorization:
        config.headers.Authorization || (token && `Bearer ${token}`),
      'x-port-code': currentPort?.value,
    }
    config.headers['x-api-key'] = token
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 相应拦截
axiosInstance.interceptors.response.use(
  response => {
    removeRequestInQueue(response.config)
    if (!response.config?.isBlobRequest && response.data.code !== 200) {
      return Promise.reject(response.data)
    }
    if (response.data.code !== 200 && response.config.responseType === 'blob') {
      if (
        response.data.size === 0 ||
        response.headers['content-type'].includes('json')
      ) {
        return Promise.reject(response)
      }
    }
    return response.data
  },
  async error => {
    removeRequestInQueue(error.config || {})
    const statusCode = error.response ? error.response.status : error.code
    // 处理二进制流错误消息
    if (error.response && error.response.config?.responseType === 'blob') {
      try {
        const blob = error.response.data
        const text = await blob.text()
        const errorData = JSON.parse(text)
        return Promise.reject(errorData)
      } catch (parseError) {
        showError('[Clienr] Failed to parse error messages')
        return Promise.reject(
          new Error('[Clienr] Failed to parse error messages'),
        )
      }
    }
    if (statusCode === 400) {
      return Promise.reject(error.response.data)
    }
    // 401: token过期，重新登录
    if (statusCode === 401) {
      Dialog.create({
        title: t('sys.prompt'),
        message: t('sys.loginExpired'),
        ok: t('sys.confirm'),
        persistent: true,
      }).onOk(() => {
        const { logout } = useUserStoreWithOut()
        logout()
      })
    } else if (statusCode === 403) {
      Dialog.create({
        title: t('sys.prompt'),
        message: t('sys.accountNoPerm'),
        ok: t('sys.confirm'),
        persistent: true,
      }).onOk(() => {
        const { logout } = useUserStoreWithOut()
        logout()
      })
    } else if (statusCode === 422) {
      // 找不到下载文件
      console.log(error?.response)
      return Promise.reject(error?.response)
    } else if (axios.isCancel(error)) {
      // 取消请求报错 error.name 为 CanceledError
      return Promise.reject(error)
    } else {
      showError(
        error?.response?.data.msg ||
          error.response.data.message ||
          error?.message,
      )
    }
    return Promise.reject(error)
  },
)

function getAction(url, params = {}, config = {}) {
  return axiosInstance({ url, method: 'get', params, ...config })
}

function postAction(url, data = {}, config = {}) {
  return axiosInstance({ url, method: 'post', data, ...config })
}

function putAction(url, data = {}, config = {}) {
  return axiosInstance({ url, method: 'put', data, ...config })
}

function deleteAction(url, data = {}, config = {}) {
  return axiosInstance({ url, method: 'delete', data, ...config })
}

function patchAction(url, data = {}, config = {}) {
  return axiosInstance({ url, method: 'patch', data, ...config })
}

/**
 * 封装下载 Excel等 文件的通用方法
 * 默认 get 请求
 * post 请求时 otherConfig 里面 {  method: 'post' }
 * post 方式需要配置params入参时 {  method: 'post', params: {...someParams } }
 * */
export const downloadFile = async (
  url,
  params = {},
  filename = '',
  successDownloadCallback = () => {},
  errorDownloadCallback = () => {},
  otherConfig = { method: 'get' }, // isBlobRequest 标识是否是返回二进制流的响应
) => {
  try {
    let _params = {
      url,
      responseType: 'blob', // 必须设置为 'blob' 以正确处理二进制文件
      isBlobRequest: true,
      timeout: 15 * 60000,
      ...otherConfig,
    }
    if (otherConfig.method === 'get') {
      _params.params = params
    }
    if (otherConfig.method === 'post') {
      _params.data = params
    }
    const response = await axiosInstance(_params)
    const blob = new Blob([response])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename

    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)

    if (_.isFunction(successDownloadCallback)) {
      successDownloadCallback()
    }
  } catch (error) {
    if (_.isFunction(errorDownloadCallback)) {
      errorDownloadCallback(error)
    }
    console.error('下载文件失败:', error)
  }
}
export default {
  get: getAction,
  post: postAction,
  put: putAction,
  delete: deleteAction,
  patch: patchAction,
}
