import http from '@/utils/http'

/** 获取视图列表 */
export const getViewsApi = boardType => {
  return http.get(`/api/v1/report_view?report_id=${boardType}`)
}

/** 创建视图 */
export const createViewApi = params => {
  return http.post('/api/v1/report_view', params)
}

/** 看板列表 */
export const getBoardsListApi = (type, params, { page, size }) => {
  return http.post(
    `/api/v1/report_view/${type}?page=${page}&size=${size}`,
    params,
  )
}
