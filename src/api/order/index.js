import http from '@/utils/http'

/** 订单导入接口 */
export const exportUpload = (data, params) => {
  return http.post(`/api/v1/import/waybill`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params,
  })
}

/** 获取订单管理列表 */
export const getOrderListApi = (params, { page, size, service_type }) => {
  return http.post(
    `/api/v1/orders?page=${page}&size=${size}${service_type ? '&service_type=' + service_type : ''}`,
    params,
  )
}

/** 获取订单详情 */
export const getOrderDetailApi = waybill_id => {
  return http.get(`/api/v1/waybill/${waybill_id}`)
}

/** 获取订单管理下拉数据 */
export const getOrderSelectDataApi = params => {
  return http.get(`/api/v1/base/info`, params)
}

/** 获取订单管理下拉数据 */
export const getOrderIdDatailApi = params => {
  return http.get(`/api/v1/orders/detail`, params)
}

export const manifestBatchDownloadURL = `/api/v1/waybill/downmainfest/many`

export const manifestSumaDownloadURL = `/api/v1/waybill/downmainfest/suma`
export const manifestSumaBatchDownloadURL = `/api/v1/waybill/downmainfest/suma/many`

export const manifestDownloadURL = `/api/v1/waybill/downmainfest`
// 批量提单文件下载
export const ladingBillfileURL = `/api/v1/carrier_ref/download`
// 订单列表下载
export const orderListfileURL = `/api/v1/order/download`

// 提单文件上传
export const uploadCarrierFile = params => {
  return http.post(`/api/v1/import/carrier_file`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 查询分批
export const getBatchInfoListApi = waybill_id => {
  return http.get(`api/v1/batch_info/${waybill_id}`)
}
/** 获取提单详情收件人列表 */
export const getRecipientList = ({ id, page, size }) => {
  return http.get(
    `/api/v1/waybill/${id}/recipients?current=${page}&size=${size}`,
  )
}
/** 创建分批 */
export const createBatchesApi = (waybill_id, batch_infos) => {
  return http.post(`/api/v1/batch_info/${waybill_id}`, { batch_infos })
}

/** 编辑分批 */
export const editBatchesApi = (waybill_id, batch_infos) => {
  return http.patch(`/api/v1/batch_info/${waybill_id}`, { batch_infos })
}
/** 更新NOA */
export const updateBatchesNoaApi = ({ waybill_id, noa }) => {
  return http.post(`/api/v1/waybill/noa/${waybill_id}`, { noa })
}

/** 分批绑定外箱 */
export const batchBindOpksApi = batch_id => {
  return http.post(`/api/v1/batch_info/binding/${batch_id}`)
}
