import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { shanghaiTzWrapper, portTzWrapper } from '@/utils/wrapper'
import { getLastWeek } from '@/utils/time'
import { gramsToKilograms } from '@/utils'
import { useOption } from '@/hooks/useOption'

export default function useData() {
  const { t } = useI18n()
  const { whetherOptions, getOptionLabel } = useOption()

  const filters = ref([
    {
      type: 'multipleInput',
      label: t('boards.portPclNo'),
      field: 'sk_no',
      show: true,
    },
    {
      type: 'dateRange',
      label: t('common.createAt'),
      field: 'created_at',
      defaultValue: getLastWeek,
      show: true,
    },
    {
      type: 'multipleInput',
      label: t('boards.clientPclNo'),
      field: 'client_ref',
    },
    {
      type: 'multipleInput',
      label: t('boards.logisticsNo'),
      field: 'barcode',
    },
    {
      type: 'multipleInput',
      label: t('common.carrierRef'),
      field: 'carrier_ref',
    },
    {
      type: 'multipleInput',
      label: t('common.batchNo'),
      field: 'batch_no',
    },
    {
      type: 'multipleSelect',
      label: t('common.customer'),
      field: 'customer_id',
      apiURL: '/api/v1/report_view/flat/dropdown?field=customer',
      relatedItems: ['created_at'],
      optionLabel: 'abbreviation',
      optionValue: 'customer_id',
    },
    {
      type: 'input',
      label: t('common.senderName'),
      field: 'waybill_sender_name',
    },
    {
      type: 'multipleInput',
      label: t('boards.bulkNo'),
      field: 'packaging_sk_no',
    },
    {
      type: 'dateRange',
      label: t('common.etd'),
      field: 'etd',
      wrapper: shanghaiTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('common.eta'),
      field: 'eta',
      wrapper: portTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('common.atd'),
      field: 'atd',
      wrapper: shanghaiTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('common.ata'),
      field: 'ata',
      wrapper: portTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('common.noa'),
      field: 'noa',
      wrapper: portTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('common.pickupTime'),
      field: 'pickup_time',
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
      label: t('common.inboundTime'),
      field: 'inbound_time',
      wrapper: portTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('common.readyForHandover'),
      field: 'ready_for_handover_time',
      wrapper: portTzWrapper,
    },
    {
      type: 'dateRange',
      label: t('common.outboundTime'),
      field: 'outbound_time',
      wrapper: portTzWrapper,
    },
    {
      type: 'multipleSelect',
      label: t('boards.sortingCode'),
      field: 'sorting_id',
      apiURL: '/api/v1/report_view/flat/dropdown?field=sorting_code',
      relatedItems: ['created_at'],
      optionLabel: 'sorting_code',
      optionValue: 'sorting_id',
    },
    {
      type: 'multipleSelect',
      label: t('boards.nextDestination'),
      field: 'destination_code',
      apiURL: '/api/v1/report_view/flat/dropdown?field=destination',
      relatedItems: ['created_at'],
      optionLabel: 'destination',
      optionValue: 'destination_code',
    },
    {
      type: 'dateRange',
      label: t('common.customTime'),
      field: 'custom_time',
      wrapper: portTzWrapper,
    },
    {
      type: 'select',
      label: t('boards.isInspection'),
      field: 'inspection_status',
      options: whetherOptions.value,
    },
    {
      type: 'multipleInput',
      label: t('common.carNo'),
      field: 'car_no',
    },
  ])
  const tableColumns = ref([
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'consigned_to_ehub', label: t('common.port') },
    { name: 'sk_no', label: t('boards.portPclNo') },
    { name: 'client_ref', label: t('boards.clientPclNo') },
    { name: 'barcode', label: t('boards.logisticsNo') },
    { name: 'carrier_ref', label: t('common.carrierRef') },
    { name: 'batch_no', label: t('common.batchNo') },
    { name: 'customer', label: t('common.customer') },
    { name: 'waybill_sender_name', label: t('common.senderName') },
    { name: 'packaging_sk_no', label: t('boards.bulkNo') },
    {
      name: 'weight',
      label: t('boards.weight'),
      field: ({ weight }) => {
        return weight && gramsToKilograms(weight)
      },
    },
    {
      name: 'billing_weight',
      label: t('boards.billWeight'),
      field: ({ billing_weight }) => {
        return billing_weight && gramsToKilograms(billing_weight)
      },
    },
    {
      name: 'etd',
      label: t('common.etd'),
      type: 'time',
      tz: row => row.etd_tz,
    },
    {
      name: 'eta',
      label: t('common.eta'),
      type: 'time',
      tz: row => row.eta_tz,
    },
    {
      name: 'atd',
      label: t('common.atd'),
      type: 'time',
      tz: row => row.atd_tz,
    },
    {
      name: 'ata',
      label: t('common.ata'),
      type: 'time',
      tz: row => row.ata_tz,
    },
    {
      name: 'noa',
      label: t('common.noa'),
      type: 'time',
      tz: row => row.noa_tz,
    },
    {
      name: 'pickup_time',
      label: t('common.pickupTime'),
      type: 'time',
      tz: row => row.pickup_time_tz,
    },
    {
      name: 'arrival_time',
      label: t('common.arrivalTime'),
      type: 'time',
      tz: row => row.arrival_time_tz,
    },
    {
      name: 'inbound_time',
      label: t('common.inboundTime'),
      type: 'time',
      tz: row => row.inbound_time_tz,
    },
    {
      type: 'time',
      name: 'ready_for_handover_time',
      label: t('common.readyForHandover'),
      tz: row => row.ready_for_handover_time_tz,
    },
    {
      name: 'outbound_time',
      label: t('common.outboundTime'),
      type: 'time',
      tz: row => row.outbound_time_tz,
    },
    { name: 'sorting_code', label: t('boards.sortingCode') },
    { name: 'destination', label: t('boards.nextDestination') },
    {
      name: 'custom_time',
      label: t('common.customTime'),
      type: 'time',
      tz: row => row.custom_time_tz,
    },
    {
      name: 'inspection_status',
      label: t('boards.isInspection'),
      field: row => {
        return getOptionLabel(whetherOptions.value, row.inspection_status)
      },
    },
    { name: 'car_no', label: t('common.carNo') },
    { type: 'time', name: 'created_at', label: t('common.createAt') },
  ])

  return { filters, tableColumns }
}
