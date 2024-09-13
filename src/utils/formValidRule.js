import _ from 'lodash'

import { t } from '@/locales'

export const isNotEmpty = value => {
  if (_.isString(value)) {
    return value.trim() !== ''
  }
  if (_.isArray(value)) {
    return value.length > 0
  }
  if (_.isNumber(value)) {
    return value !== 0
  }
  return value !== undefined && value !== null
}

export const required = value => {
  return isNotEmpty(value) || t('sys.fieldNotEmpty')
}

export const validEmail = email => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email) || t('sys.errorEmail')
}
// 校验只能输入数字、字母、符号
export function validNo(value, num = 100, required = true) {
  const regEx = /^[a-zA-Z0-9\s~`!@#$%^&*()-__+={}[\]|;:'",.<>/?!]+$/
  if (value && value.length > 0) {
    if (regEx && !regEx.test(value)) {
      return t('sys.onlyNumLetterSymbol')
    }
    if (value.length > num) return t('sys.atMostLetterNum', [num])
    return true
  }
  if (required) return t('sys.fieldNotEmpty')
  return true
}
// 校验数字类
export function validNumData(value, num = 100, required = true) {
  if (_.isNumber(value)) value = value.toString()
  const regEx = new RegExp(/^[0-9]+$/)
  if (value && value.length > 0) {
    if (regEx && !regEx.test(value)) {
      return t('sys.onlyWholeNum')
    }
    if (value.length > num) return t('sys.atMostLetterNum', [num])
    return true
  }
  if (required) return t('sys.fieldNotEmpty')
  return true
}

/** 校验重量字符串，小于1000000 最多3位小数 */
export function validWeight(value, required) {
  if (!value && value !== 0 && required) {
    return t('sys.fieldNotEmpty')
  }
  const regEx = /^\d+(\.\d{1,3})?$/
  if (!regEx.test(value)) {
    return t('sys.decimalNum')
  }
  if (value > 1000000) {
    return t('sys.maxNum', [1000000])
  }
  return true
}

export function stringLengthRule(value, min, max) {
  if (value.length < min) {
    return '最少输入' + min + '个字符'
  }
  if (value.length > max) {
    return '最多输入' + max + '个字符'
  }
  return true
}
