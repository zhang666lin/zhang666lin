import http from '@/utils/http'

export const getAirlineGroundList = params => {
  return http.get(`/api/v1/airline_ground`, params)
}

export const addAirlineGround = params => {
  return http.post(`/api/v1/airline_ground`, params)
}
export const editAirlineGround = (params, id) => {
  return http.patch(`/api/v1/airline_ground/${id}`, params)
}
export const getAirlineGroundDetail = (params, id) => {
  return http.get(`/api/v1/airline_ground/${id}`, params)
}
