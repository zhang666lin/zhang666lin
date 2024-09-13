import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { required } from '@/utils/formValidRule'
import { useUserStore } from '@/store/modules/user'

export const useAddDialogScheme = () => {
  const { t } = useI18n()
  const userStore = useUserStore()
  const warehouseList = userStore.getWahList
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

  const effectiveTableColumns = ref([
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'sorting_rule_code', label: t('common.sortingRuleCode') },
    { name: 'destination_name', label: t('common.destination') },
    { name: 'delivery_code', label: t('common.deliveryCode') },
    { name: 'destination_country', label: t('common.destinationCountry') },
    { name: 'client_name', label: t('common.customer') },
    { name: 'sender_name', label: t('common.senderName') },
    { name: 'extra_info', label: t('baseInfo.extraInfo') },
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
  ])

  function setEffectTableCol(type) {
    if (type === 'edit') {
      // 增加操作列
      const operationColumn = {
        name: 'operation',
        label: t('common.operation'),
        type: 'operation',
      }
      if (!effectiveTableColumns.value.some(col => col.name === 'operation')) {
        effectiveTableColumns.value.push(operationColumn)
      }
    } else {
      // 删除操作列
      const operationColumnIndex = effectiveTableColumns.value.findIndex(
        column => column.name === 'operation',
      )
      if (operationColumnIndex !== -1) {
        effectiveTableColumns.value.splice(operationColumnIndex, 1)
      }
    }
  }

  const settingTableColumns = ref([
    {
      name: 'index',
      type: 'index',
      label: t('common.No'),
    },
    {
      name: 'destination_id',
      label: t('common.destination'),
      type: 'component',
      component: {
        type: 'select',
        remoteConfig: {
          url: '__poms/destination/get/list',
          method: 'get',
          responseWrapper: res => {
            return res.data.map(item => ({
              label:
                (item.destination_type === 'SELF_PICKUP'
                  ? t('baseInfo.selfPickup')
                  : t('baseInfo.selfDelivery')) +
                '-' +
                item.destination_name,
              value: item.id,
            }))
          },
        },
        localFilter: true,
        stackLabel: '-',
        rules: [required],
      },
    },
    {
      name: 'delivery_code',
      label: 'Delivery_code',
      type: 'component',
      component: {
        type: 'select',
        remoteConfig: {
          url: '__poms/delivery_code/get/list',
          method: 'post',
        },
        localFilter: true,
        optionLabel: 'delivery_code',
        optionValue: 'delivery_code',
        stackLabel: '-',
      },
    },
    {
      name: 'destination_country',
      label: t('common.destinationCountry'),
      type: 'component',
      component: {
        type: 'select',
        remoteConfig: {
          url: '__poms/country/get',
          method: 'get',
        },
        optionLabel: 'code',
        optionValue: 'code',
        stackLabel: '-',
      },
    },
    {
      name: 'client_name',
      label: t('common.customer'),
      type: 'component',
      component: {
        type: 'select',
        remoteConfig: {
          url: '/api/v1/base/info?params=customer',
          method: 'get',
        },
        optionLabel: 'label',
        optionValue: 'label',
        stackLabel: '-',
      },
    },
    {
      name: 'sender_name',
      label: t('common.senderName'),
      type: 'component',
      component: {
        type: 'input',
      },
    },
    {
      name: 'extra_info',
      label: t('baseInfo.extraInfo'),
      type: 'component',
      component: {
        type: 'input',
      },
    },
    {
      name: 'apply_warehouses',
      label: t('baseInfo.applyRange'),
      type: 'component',
      component: {
        type: 'select',
        multiple: true,
        options: warehouseList,
        optionLabel: 'short_name',
        optionValue: 'code',
        searchable: false,
        stackLabel: t('sys.all'),
      },
    },
    { name: 'operation', label: t('common.operation'), type: 'operation' },
  ])

  return {
    sortingTypeOptions,
    isEnableOptions,
    settingTableColumns,
    effectiveTableColumns,
    setEffectTableCol,
  }
}
