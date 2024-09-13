import { useI18n } from 'vue-i18n'

import { useUserStoreWithOut } from '@/store/modules/user'

export const useDeliveryCodeInfo = () => {
  const { t } = useI18n()

  const enableOptions = [
    {
      label: t('sys.yes'),
      value: true,
    },
    {
      label: t('sys.no'),
      value: false,
    },
  ]

  const enableOptionsContainAll = [
    {
      label: t('sys.all'),
      value: '',
    },
    ...enableOptions,
  ]

  const deliveryCodeSearchForm = [
    {
      type: 'input',
      label: t('common.deliveryCode'),
      field: 'delivery_code',
    },
    {
      type: 'select',
      label: t('common.isEnabled'),
      field: 'is_enabled',
      options: enableOptions,
      noAllOption: true,
    },
    {
      type: 'input',
      label: t('sys.updater'),
      field: 'updated_by',
    },
    {
      type: 'dateRange',
      label: t('sys.updateTime'),
      field: 'update_time',
    },
  ]

  const getIsEnableContent = is_enable => {
    if (!is_enable) {
      return t('sys.no')
    }
    if (is_enable) {
      return t('sys.yes')
    }
    return t('sys.no')
  }

  const deliveryCodeTableColumns = [
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'delivery_code', label: t('common.deliveryCode'), type: 'button' },
    {
      name: 'relative_des_count',
      label: t('baseInfo.relatedDestination'),
      field: row => {
        return row?.destinations?.length
      },
    },
    {
      name: 'active_des',
      label: t('baseInfo.enabledDestination'),
      type: 'customTooltip',
      field: row => {
        const activeDes = row?.destinations?.filter(des => des.is_enabled)
        return activeDes?.map(des => des.destination_name ?? '-')?.join(',')
      },
      tooltip: row => {
        const activeDes = row?.destinations?.filter(des => des.is_enabled)
        const tooltip = activeDes?.map(
          des =>
            `${des.country_code ? des.country_code + ',' : ''}${des.state ? des.state + ',' : ''}${des.city ? des.city + ',' : ''}${des.street ? des.street + ',' : ''}${des.address ?? ''}` ??
            '-',
        )
        return tooltip
      },
    },
    {
      name: 'is_enabled',
      label: t('common.isEnabled'),
      field: row => {
        return getIsEnableContent(row.is_enabled)
      },
    },
    { name: 'updated_by', label: t('sys.updater') },
    { name: 'updated_at', label: t('sys.updateTime'), type: 'time' },
  ]

  const getCurrentPortWareHoseList = () => {
    const userStore = useUserStoreWithOut()
    const userInfo = userStore.getUserInfo
    const currentPort = userStore.getPort

    const currentPortInfo = userInfo.port_list.filter(
      port => port.code === currentPort.value,
    )
    const currentPortWarehouseList = currentPortInfo[0].wah_list
    return currentPortWarehouseList
  }

  const desinationTypeOptions = [
    {
      label: t('baseInfo.selfPickup'),
      value: 'SELF_PICKUP',
    },
    {
      label: t('baseInfo.selfDelivery'),
      value: 'SELF_DELIVERY',
    },
  ]

  return {
    desinationTypeOptions,
    enableOptions,
    enableOptionsContainAll,
    deliveryCodeSearchForm,
    getIsEnableContent,
    deliveryCodeTableColumns,
    getCurrentPortWareHoseList,
  }
}
