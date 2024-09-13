import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { shanghaiTzWrapper, portTzWrapper } from '@/utils/wrapper'
import { getLast3months } from '@/utils/time'
import { gramsToKilograms, onlyNumber } from '@/utils'

export default function useData() {
  const { t } = useI18n()

  const filters = ref([
    {
      type: 'multipleInput',
      label: t('common.carrierRef'),
      field: 'carrier_ref',
      show: true,
    },
    {
      type: 'dateRange',
      label: t('common.createAt'),
      field: 'created_at',
      defaultValue: getLast3months,
      show: true,
    },
    {
      type: 'multipleSelect',
      label: t('common.customer'),
      field: 'customer_ids',
      optionValue: 'id',
      optionLabel: 'name',
      apiURL: `/api/v1/report_view/waybill/customer/dropdown`,
      relatedItems: ['created_at'],
    },
    {
      type: 'multipleInput',
      label: t('common.flightNumber'),
      field: 'flight_number',
    },
    {
      type: 'multipleSelect',
      label: t('common.airlineName'),
      field: 'airline_ids',
      optionValue: 'id',
      optionLabel: 'airline_name',
      apiURL: `/api/v1/report_view/waybill/airline/dropdown`,
      relatedItems: ['created_at'],
    },
    {
      type: 'multipleSelect',
      label: t('common.gha'),
      field: 'ground_ids',
      optionValue: 'id',
      optionLabel: 'name',
      apiURL: `/api/v1/report_view/waybill/ground/dropdown`,
      relatedItems: ['created_at'],
    },
    {
      type: 'multipleInput',
      label: t('boards.pmcNo'),
      field: 'pmc_no',
    },
    {
      type: 'multipleSelect',
      label: t('common.consignFrom'),
      field: 'flight_departure_airport',
      optionValue: 'flight_departure_airport',
      optionLabel: 'flight_departure_airport',
      apiURL: `/api/v1/report_view/waybill/flight_departure_airport/dropdown`,
      relatedItems: ['created_at'],
    },
    {
      type: 'multipleSelect',
      label: t('common.destination'),
      field: 'port_of_arrival',
      optionValue: 'port_of_arrival',
      optionLabel: 'port_of_arrival',
      apiURL: `/api/v1/report_view/waybill/port_of_arrival/dropdown`,
      relatedItems: ['created_at'],
    },
    {
      type: 'multipleSelect',
      label: t('common.warehouse'),
      field: 'warehouse',
      optionValue: 'warehouse',
      optionLabel: 'short_name',
      apiURL: `/api/v1/report_view/waybill/warehouse/dropdown`,
      relatedItems: ['created_at'],
    },
    {
      type: 'multipleSelect',
      label: t('common.customBroker'),
      field: 'custom_broker',
      optionValue: 'custom_broker',
      optionLabel: 'custom_broker',
      apiURL: `/api/v1/report_view/waybill/custom_broker/dropdown`,
      relatedItems: ['created_at'],
    },
    {
      type: 'input',
      label: t('common.masterBillAmount'),
      field: 'master_bill_amount',
      limit: onlyNumber,
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
      wrapper: shanghaiTzWrapper,
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
      type: 'dateRange',
      label: t('common.customTime'),
      field: 'custom_time',
      wrapper: portTzWrapper,
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
    { name: 'carrier_ref', label: t('common.carrierRef') },
    { name: 'sender_name', label: t('common.senderName') },
    { name: 'customer', label: t('common.customer') },
    { name: 'flight_number', label: t('common.flightNumber') },
    { name: 'airline_name', label: t('common.airlineName') },
    { name: 'ground_name', label: t('common.gha') },
    { name: 'pmc_no', label: t('boards.pmcNo') },
    { name: 'flight_departure_airport', label: t('common.consignFrom') },
    { name: 'port_of_arrival', label: t('common.destination') },
    { name: 'warehouse', label: t('common.warehouse') },
    { name: 'custom_broker', label: t('common.customBroker') },
    { name: 'master_bill_amount', label: t('common.masterBillAmount') },
    {
      name: 'master_bill_weight',
      label: t('common.masterBillWeight'),
      field: ({ master_bill_weight }) => {
        return master_bill_weight && gramsToKilograms(master_bill_weight)
      },
    },
    {
      type: 'time',
      name: 'etd',
      label: t('common.etd'),
      tz: row => row.etd_tz,
    },
    {
      type: 'time',
      name: 'eta',
      label: t('common.eta'),
      tz: row => row.eta_tz,
    },
    {
      type: 'time',
      name: 'atd',
      label: t('common.atd'),
      tz: row => row.atd_tz,
    },
    {
      type: 'time',
      name: 'ata',
      label: t('common.ata'),
      tz: row => row.ata_tz,
    },
    {
      type: 'time',
      name: 'noa',
      label: t('common.noa'),
      tz: row => row.noa_tz,
    },
    {
      type: 'time',
      name: 'pickup_time',
      label: t('common.pickupTime'),
      tz: row => row.pickup_time_tz,
    },
    {
      type: 'time',
      name: 'arrival_time',
      label: t('common.arrivalTime'),
      tz: row => row.arrival_time_tz,
    },
    {
      name: 'parcel_inbound_quantity',
      label: t('common.parcelInboundQuantity'),
    },
    {
      name: 'motherbox_inbound_quantity',
      label: t('common.motherboxInboundQuantity'),
    },
    {
      type: 'time',
      name: 'inbound_time',
      label: t('common.inboundTime'),
      tz: row => row.inbound_time_tz,
    },
    {
      name: 'parcel_outbound_quantity',
      label: t('common.parcelOutboundQuantity'),
    },
    {
      name: 'motherbox_outbound_quantity',
      label: t('common.motherboxOutboundQuantity'),
    },
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
      type: 'time',
      name: 'ready_for_handover_time',
      label: t('common.readyForHandover'),
      tz: row => row.ready_for_handover_time_tz,
    },
    {
      type: 'time',
      name: 'outbound_time',
      label: t('common.outboundTime'),
      tz: row => row.outbound_time_tz,
    },
    {
      type: 'time',
      name: 'custom_time',
      label: t('common.customTime'),
      tz: row => row.custom_time_tz,
    },
    {
      name: 'customs_clearance_quantity/sub_bill_amount',
      label: t('boards.customsClearProcess'),
      field: row => {
        return `${row.customs_clearance_quantity ?? '-'}/${row.sub_bill_amount ?? '-'}`
      },
    },
    {
      name: 'inspected_progress',
      label: t('boards.parcelsCheckedCount'),
    },
    {
      name: 'inspection_left_pcl_count',
      label: t('boards.parcelsInspectCount'),
    },
    { name: 'car_no', label: t('common.carNo') },
    { type: 'time', name: 'created_at', label: t('common.createAt') },
  ])

  return { filters, tableColumns }
}
