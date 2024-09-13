import { useI18n } from 'vue-i18n'

import { useBasicInfo } from '@/constants/basicInfo'

export const useCustomer = () => {
  const { t } = useI18n()
  const { getIsEnableContent } = useBasicInfo()
  const isEnableOptions = [
    { value: 1, label: t('sys.yes') },
    { value: 0, label: t('sys.no') },
  ]

  const customerFormSchemas = [
    {
      type: 'input',
      label: t('baseInfo.clientCode'),
      field: 'code',
    },
    {
      type: 'input',
      label: t('baseInfo.clientName'),
      field: 'name',
    },
    {
      type: 'input',
      label: t('baseInfo.abbreviation'),
      field: 'abbreviation',
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
      apiURL: '/api/v1/customer/update_user', // 请求数据源的url 非必填
    },
    {
      type: 'dateRange',
      label: t('sys.updateTime'),
      field: 'update_time',
    },
  ]

  const tableColumns = [
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'code', label: t('baseInfo.clientCode') },
    { name: 'name', label: t('baseInfo.clientName') },
    { name: 'abbreviation', label: t('baseInfo.abbreviation') },
    {
      name: 'contact_person_name',
      label: t('baseInfo.contact'),
      field: row => {
        return row.contact_person[0]?.name ?? '-'
      },
    },
    {
      name: 'contact_person_position',
      label: t('baseInfo.contactTitle'),
      field: row => {
        return row.contact_person[0]?.title ?? '-'
      },
    },
    {
      name: 'contact_person_phone',
      label: t('baseInfo.contactPhone'),
      field: row => {
        return row.contact_person[0]?.phone ?? '-'
      },
    },
    {
      name: 'contact_person_email',
      label: t('baseInfo.contactEmail'),
      field: row => {
        return row.contact_person[0]?.email ?? '-'
      },
    },
    {
      name: 'is_enable',
      label: t('common.isEnabled'),
      field: row => {
        return getIsEnableContent(row.is_enable.toString()) ?? '-'
      },
    },
    { name: 'updated_name', label: t('sys.updater') },
    {
      name: 'updated_at',
      label: t('sys.updateTime'),
      type: 'time',
    },
    { name: 'operation', label: t('common.operation'), type: 'operation' },
  ]
  return {
    customerFormSchemas,
    tableColumns,
  }
}
