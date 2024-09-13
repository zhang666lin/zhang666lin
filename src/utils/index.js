import { t } from '@/locales'

/** 以空格，换行符，全角逗号，半角逗号为分割，将字符串转换成数组 */
export function splitByMulti(value) {
  // 将空格，换行符，全角逗号都替换成半角逗号
  if (!value) return []
  let result = value.trim()
  result = result.replace(/，/gi, ',')
  result = result.replace(/\s{1,}/gi, ',')
  return result.split(',')
}

/** 判断数组中是否有重复元素 */
export function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length
}

/** 克转千克，保留三位小数 */
export function gramsToKilograms(grams) {
  if (typeof grams !== 'number' || grams < 0) {
    throw new Error(t('sys.noNegativeNum'))
  }
  const kilograms = grams / 1000
  return kilograms.toFixed(3)
}

/** 过滤字符串中非数字字符，且不允许首位为0 */
export function onlyNumber(value) {
  if (value.indexOf('0') === 0) value = value.substr(1)
  value = value.replace(/[^0-9]/g, '')
  return value
}
