import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUserStore } from '@/store/modules/user'
import { timeRangeFromWrapper } from '@/utils/wrapper'
export const useBasicInfo = () => {
  const { t } = useI18n()
  const sortingTypeOptions = ref([
    {
      label: t('baseInfo.selfPickup'),
      value: 'SELF_PICKUP',
    },
    {
      label: t('baseInfo.selfDelivery'),
      value: 'SELF_DELIVERY',
    },
  ])
  const isEnableOptions = ref([
    {
      label: t('sys.yes'),
      value: true,
    },
    {
      label: t('sys.no'),
      value: false,
    },
  ])
  const userStore = useUserStore()
  const warehouseList = userStore.getWahList

  const filters = ref([
    {
      type: 'multipleSelectV2',
      label: t('common.sortingRuleCode'),
      field: 'sorting_rule_codes',
      remoteConfig: {
        url: '__poms/sorting_rule/code/list',
        method: 'post',
      },
      localFilter: true,
    },
    {
      type: 'multipleSelectV2',
      label: t('common.destination'),
      field: 'destination_ids',
      remoteConfig: {
        url: '__poms/destination/get/list',
        method: 'get',
      },
      optionLabel: 'destination_name',
      optionValue: 'id',
      localFilter: true,
    },
    {
      type: 'multipleSelectV2',
      label: 'delivery_code',
      field: 'delivery_codes',
      remoteConfig: {
        url: '__poms/delivery_code/get/list',
        method: 'post',
      },
      optionLabel: 'delivery_code',
      optionValue: 'delivery_code',
    },
    {
      type: 'multipleSelectV2',
      label: t('common.destinationCountry'),
      field: 'country_codes',
      remoteConfig: {
        url: '__poms/country/get',
        method: 'get',
      },
      optionLabel: 'code',
      optionValue: 'code',
    },
    {
      type: 'multipleSelectV2',
      label: t('common.customer'),
      field: 'client_names',
      remoteConfig: {
        url: '/api/v1/base/info?params=customer',
        method: 'get',
      },
      optionLabel: 'label',
      optionValue: 'label',
    },
    {
      type: 'input',
      label: t('common.senderName'),
      field: 'sender_name',
    },
    {
      type: 'input',
      label: t('baseInfo.extraInfo'),
      field: 'extra_info',
    },
    {
      type: 'multipleSelectV2',
      label: t('baseInfo.applyRange'),
      field: 'warehouse_codes',
      options: warehouseList,
      optionLabel: 'short_name',
      optionValue: 'code',
      searchable: false,
    },
    {
      type: 'selectV2',
      label: t('common.isEnabled'),
      field: 'is_enabled',
      searchable: false,
      options: isEnableOptions.value,
    },
    {
      type: 'input',
      label: t('sys.updater'),
      field: 'update_name',
    },
    {
      type: 'dateRange',
      label: t('sys.updateTime'),
      field: 'updated_at',
      wrapper: timeRangeFromWrapper,
    },
  ])
  const showLabel = (opts, value) => {
    const option = opts.find(item => item.value === value)
    return option ? option.label : '-'
  }
  const tableColumns = ref([
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'sorting_rule_code', label: t('common.sortingRuleCode') },
    { name: 'destination_name', label: t('common.destination') },
    { name: 'delivery_code', label: t('common.deliveryCode') },
    { name: 'destination_country', label: t('common.destinationCountry') },
    { name: 'client_name', label: t('common.customer') },
    { name: 'sender_name', label: t('common.senderName') },
    { name: 'extra_info', label: t('baseInfo.extraInfo') },
    {
      name: 'is_enabled',
      label: t('common.isEnabled'),
      field: ({ is_enabled }) => {
        return showLabel(isEnableOptions.value, is_enabled) ?? '-'
      },
    },
    {
      name: 'apply_warehouses',
      label: t('baseInfo.applyRange'),
      field: ({ apply_warehouses }) => {
        if (apply_warehouses) {
          const shortNames = apply_warehouses.map(i => {
            return warehouseList.find(j => j.code === i)?.short_name
          })
          return shortNames.join(',') || t('sys.all')
        }
        return t('sys.all')
      },
    },
    { name: 'updated_by', label: t('sys.updater') },
    { name: 'updated_at', label: t('sys.updateTime'), type: 'time' },
    { name: 'operation', label: t('common.operation'), type: 'operation' },
  ])
  return {
    sortingTypeOptions,
    isEnableOptions,
    filters,
    tableColumns,
  }
}
