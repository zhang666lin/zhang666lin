import http from '@/utils/http'

/** 时间管理列表页 */
export function getTimeManageListApi(params, { page, size }) {
  return http.post(`/api/v1/time/input/logs?page=${page}&size=${size}`, params)
}

/** 根据提单号获取对应分批及外件数量 */
export function getPartsOfWblApi(params) {
  return http.get(`/api/v1/time/wbl/batch/list`, params)
}

// 时间管理页面 数据提交
export const timeManageSumbitApi = params => {
  return http.post(`/api/v1/time/input`, params)
}
