import http from '@/utils/http'

export const getAirlineList = params => {
  return http.get(`/api/v1/airline`, params)
}

export const addAirline = params => {
  return http.post(`/api/v1/airline`, params)
}
export const editAirline = (params, id) => {
  return http.patch(`/api/v1/airline/${id}`, params)
}

export const getDestinationsList = params => {
  return http.get(`/api/v1/destinations`, params)
}
export const getAirlineContactList = params => {
  return http.get(`/api/v1/airline_contact`, params)
}
