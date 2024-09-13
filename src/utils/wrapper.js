import { convertUtc, getPortTz } from '@/utils/time'
import { strSplit2Array } from '@/utils/helper'
import { useUserStoreWithOut } from '@/store/modules/user'

export function timeRangeWrapper(obj, field) {
  if (obj[field]) {
    obj[field + '_start'] = convertUtc(obj[field][0])
    obj[field + '_end'] = convertUtc(obj[field][1])
  }
  delete obj[field]
}

export function timeRangeFromWrapper(obj, field) {
  if (obj[field]) {
    obj['from_' + field] = convertUtc(obj[field][0])
    obj['to_' + field] = convertUtc(obj[field][1])
  }
  delete obj[field]
}

export function timeRangeArrayWrapper(obj, field) {
  if (obj[field]) {
    obj[field][0] = convertUtc(obj[field][0])
    obj[field][1] = convertUtc(obj[field][1])
  } else {
    delete obj[field]
  }
}

export function shanghaiTzWrapper(obj, field) {
  if (obj[field]) {
    obj[field + '_start'] = convertUtc(obj[field][0], 'Asia/Shanghai')
    obj[field + '_end'] = convertUtc(obj[field][1], 'Asia/Shanghai')
  }
  delete obj[field]
}

export function portTzWrapper(obj, field) {
  const userStore = useUserStoreWithOut()
  const currentPort = userStore.getPort

  const portTz = getPortTz(currentPort.value)
  if (obj[field]) {
    obj[field + '_start'] = convertUtc(obj[field][0], portTz)
    obj[field + '_end'] = convertUtc(obj[field][1], portTz)
  }
  delete obj[field]
}

export function multipleInputWrapper(obj, field) {
  if (obj[field]) {
    obj[field] = strSplit2Array(obj[field])
  } else {
    delete obj[field]
  }
}

export function inputWrapper(obj, field) {
  if (obj[field]) {
    obj[field] = obj[field].trim()
  } else {
    delete obj[field]
  }
}

export function selectWrapper(obj, field) {
  if (obj[field] !== 0 && obj[field] !== false && !obj[field]) {
    delete obj[field]
  }
}

export function multipleSelectWrapper(obj, field) {
  if (!obj[field] || obj[field].length === 0) {
    delete obj[field]
  }
}
