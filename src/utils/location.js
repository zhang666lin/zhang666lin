export function getParamInSearch(keyName) {
  const currentUrl = window.location.href
  const url = new URL(currentUrl)
  const params = new URLSearchParams(url.search)
  return params.get(keyName)
}

export function deleteAllParamsInSearch() {
  const currentUrl = window.location.href
  const url = new URL(currentUrl)
  url.search = ''
  // 更新浏览器的URL而不重新加载页面
  window.history.replaceState({}, '', url.toString())
}
// 判断一个对象是否为空对象
export function isEmptyObject(obj) {
  return Reflect.ownKeys(obj).length === 0
}
