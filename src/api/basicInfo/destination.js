import http from '@/utils/http'

/** 查询目的地列表 */
export function getDestinationList(params) {
  return http.post(`__poms/destination/get`, params)
}

/** 导出目的地列表 */
export function exportDestinationList(params) {
  return http.post(`__poms/destination/export`, params)
}

/** 新增目的地 */
export function addDestination(params) {
  return http.post(`__poms/destination/upsert`, params)
}

/** 修改目的地 */
export function editDestination(params) {
  return http.put(`__poms/destination/upsert`, params)
}

/** 删除目的地 */
export function deleteDestination(params) {
  return http.post(`__poms/destination/delete`, params)
}
/** 删除目的地 */
export function queryDestinationDetail(params) {
  return http.post(`__poms/destination/get/id`, params)
}
/** 国家列表 */
export function getCountryList(params) {
  return http.get(`__poms/country/get`, params)
}
