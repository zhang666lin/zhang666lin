import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { required } from '@/utils/formValidRule'
import { timeRangeFromWrapper } from '@/utils/wrapper'
export const useBasicInfo = () => {
  const { t } = useI18n()
  const destinationTypeOptions = ref([
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
  const showLabel = (opts, value) => {
    const option = opts.find(item => item.value === value)
    return option ? option.label : '-'
  }
  const filters = ref([
    {
      type: 'input',
      label: t('common.destinationCode'),
      field: 'destination_code',
    },
    {
      type: 'input',
      label: t('common.destination'),
      field: 'destination_name',
    },
    {
      type: 'selectV2',
      label: t('baseInfo.destinationType'),
      field: 'destination_type',
      options: destinationTypeOptions.value,
      searchable: false,
    },
    {
      type: 'multipleSelectV2',
      label: t('baseInfo.country'),
      field: 'country_code',
      remoteConfig: {
        url: '__poms/country/get',
        method: 'get',
      },
      localFilter: true,
      optionValue: 'code',
      optionLabel: 'code',
    },
    {
      type: 'input',
      label: t('baseInfo.state'),
      field: 'state',
    },
    {
      type: 'input',
      label: t('baseInfo.city'),
      field: 'city',
    },
    {
      type: 'input',
      label: t('common.postalCode'),
      field: 'postal_code',
    },
    {
      type: 'selectV2',
      label: t('common.isEnabled'),
      field: 'is_enabled',
      options: isEnableOptions.value,
      searchable: false,
    },
    {
      type: 'input',
      label: t('sys.updater'),
      field: 'updated_by',
    },
    {
      type: 'dateRange',
      label: t('sys.updateTime'),
      wrapper: timeRangeFromWrapper,
      field: 'updated_at',
    },
  ])
  const tableColumns = ref([
    { name: 'index', type: 'index', label: t('common.No') },
    {
      name: 'destination_code',
      label: t('common.destinationCode'),
      type: 'button',
    },
    {
      name: 'destination_name',
      label: t('common.destination'),
    },
    {
      name: 'destination_type',
      label: t('baseInfo.destinationType'),
      field: ({ destination_type }) => {
        return showLabel(destinationTypeOptions.value, destination_type)
      },
    },
    {
      name: 'country_code',
      label: t('baseInfo.country'),
    },
    {
      name: 'state',
      label: t('baseInfo.state'),
    },
    {
      name: 'city',
      label: t('baseInfo.city'),
    },
    {
      name: 'postal_code',
      label: t('common.postalCode'),
    },
    {
      name: 'is_enabled',
      label: t('common.isEnabled'),
      field: ({ is_enabled }) => {
        return showLabel(isEnableOptions.value, is_enabled)
      },
    },
    { name: 'updated_by', label: t('sys.updater') },
    { name: 'updated_at', label: t('sys.updateTime'), type: 'time' },
    { name: 'operation', label: t('common.operation'), type: 'operation' },
  ])
  const formSchemas = ref([
    [
      {
        type: 'input',
        label: t('common.destination'),
        field: 'destination_name',
        maxlength: 15,
        rules: [required],
        isEditing: false,
      },
      {
        type: 'select',
        label: t('baseInfo.destinationType'),
        field: 'destination_type',
        rules: [required],
        options: destinationTypeOptions.value,
        isEditing: false,
      },
      {
        type: 'select',
        label: t('baseInfo.country'),
        field: 'country_code',
        options: [],
        localFilter: true,
        isEditing: false,
        multiple: false,
        optionValue: 'code',
        optionLabel: 'code',
      },
    ],
    [
      {
        type: 'input',
        label: t('baseInfo.state'),
        field: 'state',
        maxlength: 50,
        rules: [{ required: false }],
        isEditing: false,
      },
      {
        type: 'input',
        label: t('baseInfo.city'),
        field: 'city',
        maxlength: 50,
        rules: [],
        isEditing: false,
      },
    ],
    [
      {
        type: 'input',
        subType: 'textarea',
        label: t('baseInfo.street'),
        field: 'street',
        maxlength: 50,
        rules: [],
        isEditing: false,
      },
    ],
    [
      {
        type: 'input',
        subType: 'textarea',
        label: t('baseInfo.address'),
        field: 'address',
        maxlength: 50,
        rules: [{ required: false }],
        isEditing: false,
      },
    ],
    [
      {
        type: 'input',
        label: t('common.postalCode'),
        field: 'postal_code',
        maxlength: 15,
        rules: [],
        isEditing: false,
      },
      {
        type: 'select',
        label: t('common.isEnabled'),
        field: 'is_enabled',
        rules: [required],
        isEditing: false,
        options: isEnableOptions.value,
      },
    ],
  ])
  return {
    filters,
    tableColumns,
    formSchemas,
  }
}
