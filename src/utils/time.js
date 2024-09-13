import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { useUserStoreWithOut } from '@/store/modules/user'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * 将时间转换为目标时区的时间
 * @param {String} val - 时间字符串
 * @param {String} tz - 目标时区，默认为当地时区
 * @param {Boolean} preffix - 是否需要时区前缀，默认为 false
 * @returns {String} - 转换后的时间
 */
export function convertTz(val, tz, preffix, format) {
  if (tz === null) {
    // tz 传 null 表示不转时区
    return dayjs(val).format(format ?? 'YYYY-MM-DD HH:mm:ss')
  }
  const targetTz = tz || dayjs.tz.guess()
  try {
    const time = dayjs(dayjs.utc(val))
      .tz(targetTz)
      .format(format ?? 'YYYY-MM-DD HH:mm:ss')
    return preffix ? `${targetTz} ${time}` : time
  } catch (error) {
    console.error(error)
    return preffix ? `${targetTz} ${val}` : val
  }
}

/**
 * 将时间转换为 UTC 时间
 * @param {String} val - 时间字符串
 * @param {String} tz - 目标时区，默认为当地时区
 * @returns {String} - 转换后的时间
 */
export function convertUtc(val, tz) {
  if (tz) {
    return dayjs.tz(val, tz).utc().format('YYYY-MM-DD HH:mm:ss')
  }
  const timeWithTz = dayjs(val).format()
  return dayjs.utc(timeWithTz).format('YYYY-MM-DD HH:mm:ss')
}

/** 获取最近三个月，包含首尾两日的全天时间 */
export const getLast3months = () => {
  return [
    dayjs().subtract(3, 'month').format('YYYY-MM-DD') + ' 00:00:00',
    dayjs().format('YYYY-MM-DD') + ' 23:59:59',
  ]
}

/** 获取最近一周(7天)，包含首尾两日的全天时间 */
export const getLastWeek = () => {
  return [
    dayjs().subtract(6, 'day').format('YYYY-MM-DD') + ' 00:00:00',
    dayjs().format('YYYY-MM-DD') + ' 23:59:59',
  ]
}
// 获取当前日期
export const getCurrentDate = (format = 'YYYYMMDD') => {
  return dayjs().format(format)
}

// 获取用户当前时区
export const getUserTimeZone = () => {
  return dayjs.tz.guess()
}

/** 根据口岸获取时区 */
export function getPortTz(port) {
  const userStore = useUserStoreWithOut()
  const userInfo = userStore.getUserInfo
  const portInfo = userInfo.port_list.find(i => i.code === port)
  return portInfo?.tz || ''
}
