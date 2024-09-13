import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { portTzWrapper } from '@/utils/wrapper'

export default function useData() {
  const { t } = useI18n()

  function limit100Rule(value) {
    if (!value) return true
    if (value.split(' ').filter(i => i).length > 100) {
      return t('sys.max', [100])
    }
    return true
  }
  const filters = ref([
    {
      type: 'multipleInput',
      label: t('common.pmcNo'),
      field: 'pmc_no',
      rules: [limit100Rule],
    },
    {
      type: 'multipleInput',
      label: t('common.carrierRef'),
      field: 'carrier_ref',
      rules: [limit100Rule],
    },
    {
      type: 'multipleInput',
      label: t('common.batchNo'),
      field: 'batch_no',
      rules: [limit100Rule],
    },
    {
      type: 'multipleSelect',
      label: t('common.airlineName'),
      field: 'airline_id',
      apiURL: '/api/v1/uld/inbound/dropdown?field=airline',
      optionValue: 'airline_id',
      optionLabel: 'airline_name',
    },
    {
      type: 'multipleSelect',
      label: t('common.gha'),
      field: 'ground_handler_id',
      apiURL: '/api/v1/uld/inbound/dropdown?field=ground',
      optionValue: 'ground_handler_id',
      optionLabel: 'ground_name',
    },
    {
      type: 'multipleSelect',
      label: t('sys.updater'),
      field: 'updated_by',
      apiURL: '/api/v1/uld/inbound/dropdown?field=updated_name',
      optionValue: 'updated_by',
      optionLabel: 'updated_name',
    },
    {
      type: 'dateRange',
      label: t('common.ata'),
      field: 'ata',
      wrapper: portTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('common.deadlineTime'),
      field: 'deadline',
      wrapper: portTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('common.actualReturnTime'),
      field: 'actual_return_time',
      wrapper: portTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('sys.updateTime'),
      field: 'updated_at',
    },
  ])
  const tableColumns = ref([
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'pmc_no', label: t('common.pmcNo') },
    { name: 'carrier_ref', label: t('common.carrierRef') },
    { name: 'batch_no', label: t('common.batchNo') },
    { name: 'airline_name', label: t('common.airlineName') },
    { name: 'ground_name', label: t('common.gha') },
    {
      name: 'ata',
      label: t('common.ata'),
      type: 'time',
      tz: row => row.ata_tz || null,
    },
    {
      name: 'deadline',
      label: t('common.deadlineTime'),
      type: 'time',
      timeFormat: 'YYYY-MM-DD',
      tz: row => row.deadline_tz || null,
    },
    {
      name: 'actual_return_time',
      label: t('common.actualReturnTime'),
      type: 'time',
      timeFormat: 'YYYY-MM-DD',
      tz: row => row.actual_return_time_tz || null,
    },
    { name: 'remark', label: t('common.remark') },
    { name: 'updated_name', label: t('sys.updater') },
    { name: 'updated_at', label: t('sys.updateTime'), type: 'time' },
    { name: 'operation', label: t('common.operation'), type: 'operation' },
  ])
  return { filters, tableColumns }
}
