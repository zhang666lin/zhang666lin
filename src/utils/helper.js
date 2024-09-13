import _ from 'lodash'

import { t } from '@/locales'
import { downloadFile } from '@/utils/http'
import { useAppStoreWithOut } from '@/store/modules/app'
import { getCurrentDate, getUserTimeZone } from '@/utils/time'
import { showError } from '@/components'
import {
  manifestBatchDownloadURL,
  manifestDownloadURL,
  manifestSumaDownloadURL,
  manifestSumaBatchDownloadURL,
} from '@/api/order'

// 判断数组是否有重复元素
export const hasDuplicates = array => {
  return new Set(array).size !== array.length
}

export const splitStringArray = (array, separator = ',') => {
  if (Array.isArray(array)) {
    return array.join(separator)
  }
  return undefined
}

// 下载表格列表xlsx文件
export const handleDownloadTableList = async (
  tableType,
  successDownloadCallback,
  searchParams = {},
  tableTypeMap,
) => {
  try {
    const useAppStore = useAppStoreWithOut()
    const language = useAppStore.getLocale
    const filename = `${tableTypeMap[tableType]}${getCurrentDate()}.xlsx`
    let params = {
      filename,
      language,
      timezone: getUserTimeZone(),
      ...searchParams,
    }
    const url = `/api/v1/${tableType}/down_excel`

    await downloadFile(url, params, filename, successDownloadCallback)
  } catch (err) {
    showError(t('sys.downloadFailed'))
  }
}

// 下载Manifest 批量及单个
export const handleDownloadManifest = async (
  params,
  type,
  successDownloadCallback,
  errorDownloadCallback,
) => {
  try {
    let url
    let _params = {}
    let filename = ''

    if (['order-many', 'ics2-many'].includes(type)) {
      url = manifestBatchDownloadURL
      filename = `Manifest${getCurrentDate()}.zip`
      const { ids } = params
      _params = { ids, filename, from_type: type.split('-')[0] }
    } else if (type === 'suma-many') {
      url = manifestSumaBatchDownloadURL
      filename = `SUMA${getCurrentDate()}.zip`
      const { ids } = params
      _params = { ids, filename }
    } else if (['order', 'ics2'].includes(type)) {
      url = manifestDownloadURL
      const { id, carrier_ref } = params
      filename = `${carrier_ref}Manifest.xlsx`
      _params = { id, from_type: type }
    } else if (type === 'suma') {
      url = manifestSumaDownloadURL
      const { id, consigned_to_ehub, carrier_ref } = params
      filename = `SumA-SK-${consigned_to_ehub}-${carrier_ref}.xlsx`
      _params = { id, filename }
    }
    downloadFile(
      url,
      _params,
      filename,
      successDownloadCallback,
      errorDownloadCallback,
    )
  } catch (err) {
    showError(t('sys.downloadFailed'))
  }
}

// 定义一个函数，过滤掉对象中值为 ''、null 或 undefined 空数组 的键值对
export const removeEmptyValues = obj => {
  return _.omitBy(
    obj,
    value =>
      value === '' ||
      _.isNil(value) ||
      (Array.isArray(value) && value.length === 0),
  )
}

export const strSplit2Array = (str, delimiter = ' ') => {
  if (!str) return []
  // 使用正则表达式进行分割，指定分隔符并忽略大小写
  return str
    .split(new RegExp(delimiter, 'i'))
    .map(item => item.trim())
    .filter(item => item !== '')
}

// 下载申报表格列表xlsx文件
export const handleDownloadDeclareTableList = async (
  tableType,
  successDownloadCallback,
  postParams = {},
) => {
  try {
    const useAppStore = useAppStoreWithOut()
    const language = useAppStore.getLocale
    const filename = `${tableType.toUpperCase()}${getCurrentDate()}.xlsx`
    let data = {
      ...postParams,
    }
    let params = {
      service_type: tableType,
      name: filename,
      headers_type: language,
      current_tz: getUserTimeZone(),
    }
    const url = `/api/v1/order/declaration/download`

    await downloadFile(url, data, filename, successDownloadCallback, () => {}, {
      isBlobRequest: true,
      method: 'post',
      params,
    })
  } catch (err) {
    showError(t('sys.downloadFailed'))
  }
}

/**
 * 对象数组按指定字段排序
 * @param {Array} arr - 需要排序的对象数组
 * @param {String} key - 对象中需要排序的字段
 * @param {Boolean} [isAscending=false] - 是否按升序排序，默认为 false (降序)
 * @return {Array} - 排序后的数组
 */
export const sortArrayByField = (arr, key, isAscending = false) => {
  return arr.sort((a, b) => {
    if (a[key] < b[key]) {
      return isAscending ? -1 : 1
    }
    if (a[key] > b[key]) {
      return isAscending ? 1 : -1
    }
    return 0
  })
}

// 生成唯一 ID 的方法
export const generateUniqueId = index => {
  return `item-${index}-${Symbol().toString()}`
}
