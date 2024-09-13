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

  function getFilenameByLink(link) {
    return link ? link.split('/').pop() : ''
  }

  const filters = ref([
    {
      type: 'multipleInput',
      label: t('common.pmcNo'),
      field: 'pmc_no',
      rules: [limit100Rule],
      show: true,
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
      type: 'multipleInput',
      label: t('common.flightNumber'),
      field: 'flight_number',
      rules: [limit100Rule],
    },
    {
      type: 'multipleSelect',
      label: t('common.customer'),
      field: 'customer_id',
      optionValue: 'customer_id',
      optionLabel: 'customer',
      apiURL: `/api/v1/report_view/pmc/dropdown?field=customer`,
    },
    {
      type: 'multipleSelect',
      label: t('common.airlineName'),
      field: 'airline_id',
      optionValue: 'airline_id',
      optionLabel: 'airline_name',
      apiURL: `/api/v1/report_view/pmc/dropdown?field=airline`,
    },
    {
      type: 'multipleSelect',
      label: t('common.gha'),
      field: 'ground_handler_id',
      optionValue: 'ground_handler_id',
      optionLabel: 'ground_name',
      apiURL: `/api/v1/report_view/pmc/dropdown?field=ground`,
    },
    {
      type: 'dateRange',
      label: t('common.ata'),
      field: 'ata',
      wrapper: portTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('common.arrivalTime'),
      field: 'arrival_time',
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
  ])
  const tableColumns = ref([
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'consigned_to_ehub', label: t('common.port') },
    { name: 'pmc_no', label: t('common.pmcNo') },
    { name: 'carrier_ref', label: t('common.carrierRef') },
    { name: 'batch_no', label: t('common.batchNo') },
    { name: 'flight_number', label: t('common.flightNumber') },
    { name: 'customer', label: t('common.customer') },
    { name: 'airline_name', label: t('common.airlineName') },
    { name: 'ground_name', label: t('common.gha') },
    {
      type: 'time',
      name: 'ata',
      label: t('common.ata'),
      tz: row => row.ata_tz,
    },
    {
      type: 'time',
      name: 'arrival_time',
      label: t('common.arrivalTime'),
      tz: row => row.arrival_time_tz,
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
    {
      name: 'cmr_link',
      label: t('common.cmr'),
      type: 'link',
      field: row => getFilenameByLink(row.cmr_link),
    },
    {
      name: 'pod_link',
      label: t('common.pod'),
      type: 'link',
      field: row => getFilenameByLink(row.pod_link),
    },
  ])

  return { filters, tableColumns }
}
