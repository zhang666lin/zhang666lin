import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default function useData() {
  const { t } = useI18n()
  function limit100Rule(value) {
    if (!value) return true
    if (value.split(' ').filter(i => i).length > 100) {
      return t('sys.max', [100])
    }
    return true
  }
  const timeTypeOptions = [
    { label: t('common.flight'), value: 1 },
    { label: t('common.customTime'), value: 2 },
    { label: t('common.warehouse'), value: 3 },
  ]
  const timeNameOptions = [
    { label: t('common.atd'), value: 1 },
    { label: t('common.ata'), value: 2 },
    { label: t('common.customTime'), value: 3 },
    { label: t('common.pickupTime'), value: 4 },
    { label: t('common.arrivalTime'), value: 5 },
    { label: t('common.inboundTime'), value: 6 },
    { label: t('common.readyForHandover'), value: 7 },
    { label: t('common.outboundTime'), value: 8 },
  ]
  const dataTypeOptions = [
    { label: t('common.bulk'), value: 1 },
    { label: t('common.carrierRef'), value: 2 },
    { label: t('common.flat'), value: 4 },
  ]
  const remarkOptions = [
    { label: t('timeManage.updateInspection'), value: 1 },
    { label: t('timeManage.noUpdateInspection'), value: 0 },
  ]
  const filters = ref([
    {
      type: 'multipleSelectV2',
      label: t('common.timeType'),
      field: 'time_type',
      noAllOption: true,
      searchable: false,
      options: timeTypeOptions,
    },
    {
      type: 'multipleSelectV2',
      label: t('common.timeName'),
      field: 'time_name',
      noAllOption: true,
      searchable: false,
      options: timeNameOptions,
    },
    {
      type: 'multipleSelectV2',
      label: t('common.dataType'),
      field: 'data_type',
      noAllOption: true,
      searchable: false,
      options: dataTypeOptions,
    },
    {
      type: 'multipleInput',
      label: t('common.dataNo'),
      field: 'sk_no',
      rules: [limit100Rule],
    },
    {
      type: 'multipleSelectV2',
      label: t('common.operator'),
      field: 'user_id',
      noAllOption: true,
      remoteConfig: {
        method: 'get',
        url: '/api/v1/time/input/logs/dropdown',
        params: { field: 'user' },
      },
      localFilter: true,
      optionLabel: 'user_name',
      optionValue: 'user_id',
    },
    {
      type: 'dateRange',
      label: t('common.operatedTime'),
      field: 'created_at',
    },
  ])
  const tableColumns = ref([
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'flow_no', label: t('common.updateNo') },
    {
      name: 'time_type',
      label: t('common.timeType'),
      field: ({ time_type }) => {
        return timeTypeOptions.find(i => i.value === time_type)?.label
      },
    },
    {
      name: 'time_name',
      label: t('common.timeName'),
      field: ({ time_name }) => {
        return timeNameOptions.find(i => i.value === time_name)?.label
      },
    },
    {
      name: 'data_type',
      label: t('common.dataType'),
      field: ({ data_type }) => {
        const options = dataTypeOptions.concat({
          label: t('common.carrierRef'),
          value: 3,
        })
        return options.find(i => i.value === data_type)?.label
      },
    },
    { name: 'sk_no', label: t('common.dataNo') },
    {
      name: 'input_time',
      label: t('common.inputTime'),
      type: 'time',
      tz: row => row.input_time_tz,
    },
    { name: 'user_name', label: t('common.operator') },
    { name: 'created_at', label: t('common.operatedTime'), type: 'time' },
    {
      name: 'update_customs_parcel',
      label: t('common.remark'),
      field: ({ update_customs_parcel }) => {
        return remarkOptions.find(i => i.value === update_customs_parcel)?.label
      },
    },
  ])
  return {
    filters,
    tableColumns,
    timeTypeOptions,
    timeNameOptions,
    dataTypeOptions,
    remarkOptions,
  }
}
