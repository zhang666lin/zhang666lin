import { usePermissionStore } from '@/store/modules/permission'

export function usePermission() {
  const permissionStore = usePermissionStore()
  function hasPermission(value) {
    // 暂时只判断按钮权限，后续可以扩展
    const codes = Object.keys(permissionStore.getPermissionButtons).map(
      key => permissionStore.getPermissionButtons[key],
    )
    if (codes.includes('*')) return true
    return permissionStore.getPermissionButtons.includes(value)
  }
  return { hasPermission }
}
