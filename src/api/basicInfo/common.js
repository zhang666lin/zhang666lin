import http from '@/utils/http'

/** 获取客户下拉列表 */
export function getCustomerOptions(params) {
  return http.get(`/api/v1/base/info?params=customer`, params)
}
