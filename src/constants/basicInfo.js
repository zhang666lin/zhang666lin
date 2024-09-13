import { useI18n } from 'vue-i18n'

import { splitStringArray } from '@/utils/helper'

export const useBasicInfo = () => {
  const { t } = useI18n()

  const enableOptions = [
    {
      label: t('sys.yes'),
      value: '1',
    },
    {
      label: t('sys.no'),
      value: '0',
    },
  ]

  const enableOptionsContainAll = [
    {
      label: t('sys.all'),
      value: '',
    },
    ...enableOptions,
  ]

  const airlineSearchForm = [
    {
      type: 'input',
      label: t('common.airlineName'),
      field: 'airline_name',
    },
    {
      type: 'input',
      label: t('common.awbPrefix'),
      field: 'awb_prefix',
    },
    {
      type: 'multipleSelect',
      label: t('common.destination'),
      field: 'destination',
      selectedOpsCanWrap: false, // 选中的option是否可以换行 非必填
      optionValue: 'code', // 指定value字段 默认value 非必填
      optionLabel: 'code', // 指定label字段 默认label 非必填
      apiURL: '/api/v1/airline_destinations', // 请求数据源的url 非必填
    },
    {
      type: 'select',
      label: t('common.isEnabled'),
      field: 'is_enable',
      options: enableOptions,
    },
    {
      type: 'multipleSelect',
      label: t('sys.updater'),
      field: 'update_user',
      selectedOpsCanWrap: false, // 选中的option是否可以换行 非必填
      optionValue: 'updated_by', // 指定value字段 默认value 非必填
      optionLabel: 'updated_name', // 指定label字段 默认label 非必填
      apiURL: '/api/v1/airline/update_user', // 请求数据源的url 非必填
    },
    {
      type: 'dateRange',
      label: t('sys.updateTime'),
      field: 'update_time',
    },
  ]
  const groundSearchForm = [
    {
      type: 'input',
      label: t('common.gha'),
      field: 'name',
    },
    {
      type: 'multipleSelect',
      label: t('common.destination'),
      field: 'destination',
      selectedOpsCanWrap: false, // 选中的option是否可以换行 非必填
      optionValue: 'code', // 指定value字段 默认value 非必填
      optionLabel: 'code', // 指定label字段 默认label 非必填
      apiURL: '/api/v1/ground_destinations', // 请求数据源的url 非必填
    },
    {
      type: 'select',
      label: t('common.isEnabled'),
      field: 'is_enable',
      options: enableOptions,
    },
    {
      type: 'multipleSelect',
      label: t('sys.updater'),
      field: 'update_user',
      selectedOpsCanWrap: false, // 选中的option是否可以换行 非必填
      optionValue: 'updated_by', // 指定value字段 默认value 非必填
      optionLabel: 'updated_name', // 指定label字段 默认label 非必填
      apiURL: '/api/v1/ground/update_user', // 请求数据源的url 非必填
    },
    {
      type: 'dateRange',
      label: t('sys.updateTime'),
      field: 'update_time',
    },
  ]

  const getIsEnableContent = is_enable => {
    if (is_enable === '0') {
      return t('sys.no')
    }
    if (is_enable === '1') {
      return t('sys.yes')
    }
    return t('sys.no')
  }

  const airlineTableColumns = [
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'airline_name', label: t('common.airlineName') },
    {
      name: 'awb_prefix',
      label: t('common.awbPrefix'),
    },
    {
      name: 'country',
      label: t('baseInfo.country'),
    },
    { name: 'icao', label: t('baseInfo.icao') },
    { name: 'iata', label: t('baseInfo.iata') },
    {
      name: 'destination',
      label: t('common.destination'),
      field: row => {
        return splitStringArray(row.destination) ?? '-'
      },
    },
    { name: 'eu_customs_no', label: t('baseInfo.euCustomsNo') },
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
  const groundTableColumns = [
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'name', label: t('common.gha') },
    {
      name: 'destination',
      label: t('common.destination'),
      field: row => {
        return splitStringArray(row.destination) ?? '-'
      },
    },
    {
      name: 'is_enable',
      label: t('common.isEnabled'),
      field: row => {
        return getIsEnableContent(row.is_enable.toString()) ?? '-'
      },
    },
    { name: 'updated_by', label: t('sys.updater') },
    { name: 'updated_at', label: t('sys.updateTime'), type: 'time' },
    { name: 'operation', label: t('common.operation'), type: 'operation' },
  ]

  const tableTypeMap = {
    airline: t('menu.basicairline'),
    ground: t('menu.basicground'),
    airline_ground: t('menu.airlineGround'),
    customer: t('menu.customer'),
  }
  const destinationTypeOptions = [
    {
      label: '自提',
      value: 'SELF_PICKUP',
    },
    {
      label: '自送',
      value: 'SELF_DELIVERY',
    },
  ]
  const isEnableOptions = [
    {
      label: t('sys.yes'),
      value: true,
    },
    {
      label: t('sys.no'),
      value: false,
    },
  ]
  return {
    enableOptions,
    enableOptionsContainAll,
    airlineSearchForm,
    groundSearchForm,
    getIsEnableContent,
    airlineTableColumns,
    groundTableColumns,
    tableTypeMap,
    destinationTypeOptions,
    isEnableOptions,
  }
}
