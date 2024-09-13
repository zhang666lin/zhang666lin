// notification.js

import { Notify } from 'quasar'

// 默认配置
const defaultOptions = {
  success: {
    color: 'positive',
    timeout: 2000, // 持续时间，单位：ms
    position: 'top',
  },
  error: {
    color: 'negative',
    timeout: 3000, // 持续时间，单位：ms
    position: 'top',
  },
  warning: {
    color: 'warning',
    timeout: 3000, // 持续时间，单位：ms
    position: 'top',
  },
}

// 全局配置
let globalOptions = {}

export function setGlobalOptions(options) {
  globalOptions = options
}

export function showSuccess(message, options = {}) {
  const mergedOptions = {
    ...defaultOptions.success,
    ...globalOptions.success,
    ...options,
  }
  Notify.create({
    message: message,
    ...mergedOptions,
  })
}

export function showError(message, options = {}) {
  const mergedOptions = {
    ...defaultOptions.error,
    ...globalOptions.error,
    ...options,
  }
  Notify.create({
    message: message,
    ...mergedOptions,
  })
}

export function showWarning(message, options = {}) {
  const mergedOptions = {
    ...defaultOptions.warning,
    ...globalOptions.warning,
    ...options,
  }
  Notify.create({
    message: message,
    ...mergedOptions,
  })
}
