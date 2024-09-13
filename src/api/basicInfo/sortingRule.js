import http from '@/utils/http'

/** 查询分拣规则列表 */
export function getSortingRuleList(params) {
  return http.post(`__poms/sorting_rule/get`, params)
}

/** 获取分拣规则下载链接 */
export function getSortingRulesDownloadUrl(params) {
  return http.post(`__poms/sorting_rule/export`, params)
}

/** 新增分拣规则 */
export function addSortingRule(params) {
  return http.post(`__poms/sorting_rule/upsert`, params)
}

/** 批量修改分拣规则 */
export function editSortingRule(params) {
  return http.post(`__poms/sorting_rule/batch/upsert`, params)
}

/** 删除分拣规则 */
export function deleteSortingRule(params) {
  return http.post(`__poms/sorting_rule/delete`, params)
}

/** 验证已有分拣规则与新分拣规则是否能完全匹配 */
export function checkSortingRule(params) {
  return http.post(`__poms/internal/sorting_rule/check`, params)
}

/** 获取规则编码下拉列表 */
export function getSortingRuleCodeList(params) {
  return http.post(`__poms/sorting_rule/code/list`, params)
}

/** 获取目的地下拉列表 */
export function getDestinationOptions(params) {
  return http.get(`__poms/destination/get/list`, params)
}

/** 获取delivery_code下拉列表 */
export function getDeliveryCodeOptions(params) {
  return http.post(`__poms/delivery_code/get/list`, params)
}

/** 获取目的国下拉列表 */
export function getDestinationCountryOptions(params) {
  return http.get(`__poms/country/get`, params)
}
