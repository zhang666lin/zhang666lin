import http from '@/utils/http'

export const getCustomerList = params => {
  return http.get(`/api/v1/customer`, params)
}

export const addCustomer = params => {
  return http.post(`/api/v1/customer`, params)
}
export const editCustomer = (params, id) => {
  return http.patch(`/api/v1/customer/${id}`, params)
}
