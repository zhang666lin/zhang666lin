import http from '@/utils/http'

// Delivery Code 查询
export const getDeliveryCodeList = params => {
  return http.post(`__poms/delivery_code/get`, params)
}
// Delivery Code 创建
export const addDeliveryCode = params => {
  return http.post(`__poms/delivery_code/upsert`, params)
}
// Delivery Code 修改
export const updateDeliveryCode = params => {
  return http.put(`__poms/delivery_code/upsert`, params)
}

// 查询目的地列表
export const getDestinationList = params => {
  return http.get(`__poms/destination/get/list`, params)
}

// 查询目的地
export const getDestinationById = params => {
  return http.post(`__poms/destination/get/id`, params)
}
