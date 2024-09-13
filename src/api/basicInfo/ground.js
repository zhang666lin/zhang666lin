import http from '@/utils/http'

export const getGroundList = params => {
  return http.get(`/api/v1/ground`, params)
}

export const addGround = params => {
  return http.post(`/api/v1/ground`, params)
}
export const editGround = (params, id) => {
  return http.patch(`/api/v1/ground/${id}`, params)
}
export const getGroundContactList = params => {
  return http.get(`/api/v1/ground_contact`, params)
}
