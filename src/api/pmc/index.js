import http from '@/utils/http'

/** 获取PMC管理列表 */
export const getPmcListApi = (params, { page, size }) => {
  return http.post(`/api/v1/uld/inbound/list?page=${page}&size=${size}`, params)
}

/** 新增pmc */
export const addPmcApi = params => {
  return http.post('/api/v1/uld/inbound', params)
}

/** 编辑pmc */
export const editPmcApi = (id, params) => {
  return http.patch(`/api/v1/uld/inbound/${id}`, params)
}

/** 获取提单相关信息（对应的地勤，航司，分批） */
export const getCarriefRefRelatedInfoApi = carrier_ref => {
  return http.get(`/api/v1/uld/inbound/choice?carrier_ref=${carrier_ref}`)
}

/** pmc/pod 上传接口 */
export const uploadFileApi = file => {
  const formData = new FormData()
  formData.append('file', file)
  return http.post('/api/v1/uld/inbound/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
