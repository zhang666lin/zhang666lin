import { useI18n } from 'vue-i18n'

import { useBasicInfo } from '@/constants/basicInfo'

export const useAirlineGround = () => {
  const { t } = useI18n()
  const { getIsEnableContent } = useBasicInfo()
  const isEnableOptions = [
    { value: 1, label: t('sys.yes') },
    { value: 0, label: t('sys.no') },
  ]

  const airlineGroundFormSchemas = [
    {
      type: 'input',
      label: t('common.airlineName'),
      field: 'airline_name',
    },
    {
      type: 'input',
      label: t('common.gha'),
      field: 'gha',
    },
    {
      type: 'input',
      label: t('baseInfo.shedCode'),
      field: 'shed_code',
    },
    {
      type: 'select',
      label: t('common.isEnabled'),
      field: 'is_enable',
      options: isEnableOptions,
    },
    {
      type: 'multipleSelect',
      label: t('sys.updater'),
      field: 'update_user',
      selectedOpsCanWrap: false, // 选中的option是否可以换行 非必填
      optionValue: 'updated_by', // 指定value字段 默认value 非必填
      optionLabel: 'updated_name', // 指定label字段 默认label 非必填
      apiURL: '/api/v1/airline_ground/update_user', // 请求数据源的url 非必填
    },
    {
      type: 'dateRange',
      label: t('sys.updateTime'),
      field: 'update_time',
    },
  ]

  const tableColumns = [
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'destination', label: t('common.destination') },
    { name: 'airline_name', label: t('common.airlineName'), type: 'button' },
    { name: 'gha', label: t('common.gha'), type: 'button' },
    { name: 'shed_code', label: t('baseInfo.shedCode') },
    {
      name: 'is_enable',
      label: t('common.isEnabled'),
      field: row => {
        return getIsEnableContent(row.is_enable.toString()) ?? '-'
      },
    },
    { name: 'updated_name', label: t('sys.updater') },
    { name: 'updated_at', label: t('sys.updateTime'), type: 'time' },
    { name: 'operation', label: t('common.operation'), type: 'operation' },
  ]
  return {
    isEnableOptions,
    airlineGroundFormSchemas,
    tableColumns,
  }
}
