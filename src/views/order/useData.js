import { ref } from 'vue'

import { gramsToKilograms } from '@/utils'
import { getLast3months, convertTz } from '@/utils/time'
import { t } from '@/locales'

export default function useData() {
  const serviceCodeList = ref([
    { label: '001', value: '001' },
    { label: '002', value: '002' },
    { label: '003', value: '003' },
    { label: '004', value: '004' },
  ])
  const isBatchedList = ref([
    { label: t('sys.yes'), value: 1 },
    { label: t('sys.no'), value: 0 },
  ])
  const batchedTypeList = ref([
    { label: t('common.splitShipmentManual'), value: 1 },
    { label: t('common.splitShipmentFlight'), value: 2 },
  ])
  const formSchemas = ref([
    {
      type: 'input',
      label: t('common.carrierRef'),
      field: 'carrier_ref',
      rules: [
        value => {
          if (!value) return true
          if (value.split(' ').filter(i => i).length > 100) {
            return t('sys.max', [100])
          }
          return true
        },
      ],
    },
    {
      type: 'multipleSelect',
      label: t('common.customer'),
      field: 'customer_id',
      apiURL: '/api/v1/base/info?params=customer',
      multiple: false,
    },
    {
      type: 'multipleSelect',
      label: t('common.senderName'),
      field: 'sender_name',
      apiURL: '/api/v1/base/info?params=sender',
    },
    {
      type: 'multipleSelect',
      label: t('common.warehouse'),
      field: 'warehouse',
      apiURL: '/api/v1/base/info?params=warehouse',
    },
    {
      type: 'multipleSelect',
      label: t('common.customBroker'),
      field: 'custom_broker',
      apiURL: '/api/v1/base/info?params=custom_broker',
    },
    {
      type: 'select',
      label: t('common.isBatch'),
      field: 'is_batch',
      options: isBatchedList,
    },
    {
      type: 'input',
      label: t('common.flightNumber'),
      field: 'flight_number',
    },
    {
      type: 'dateRange',
      label: t('common.createAt'),
      field: 'created_time_range',
      defaultValue: getLast3months,
    },
    {
      type: 'select',
      label: t('common.serviceCode'),
      field: 'service_code',
      options: serviceCodeList,
    },
  ])
  const tableColumns = ref([
    {
      name: 'carrier_ref',
      label: t('common.carrierRef'),
      type: 'button',
    },
    {
      name: 'sk_no',
      label: t('common.skNo'),
    },
    {
      name: 'is_batch',
      label: t('common.isBatch'),
      field: row => {
        const option = isBatchedList.value.find(item => {
          return item.value === row.is_batch
        })
        return option?.label
      },
    },
    {
      name: 'batch_amount',
      label: t('common.batchAmount'),
      type: 'button',
      field: row => {
        // 如果等于1，意味着这条数据是后台自动生成的
        return row.batch_amount === 1 ? 0 : row.batch_amount
      },
    },
    {
      name: 'flight_number',
      label: t('common.flightNumber'),
    },
    {
      name: 'service_code',
      label: t('common.serviceCode'),
      field: row => {
        const option = serviceCodeList.value.find(item => {
          return item.value === row.service_code
        })
        return option?.label
      },
    },
    { name: 'customer', label: t('common.customer') },
    {
      name: 'sender',
      label: t('common.senderName'),
      field: row => {
        return row.sender?.name ?? '-'
      },
    },
    {
      name: 'flight_departure_airport',
      label: t('common.consignFrom'),
    },
    { name: 'port_of_arrival', label: t('common.protOfArrival') },
    { name: 'warehouse', label: t('common.warehouse') },
    { name: 'custom_broker', label: t('common.customBroker') },
    {
      name: 'master_bill_amount',
      label: t('common.masterBillAmount'),
    },
    { name: 'sub_bill_amount', label: t('common.subBillAmount') },
    {
      name: 'master_bill_weight',
      label: t('common.masterBillWeight'),
      field: ({ master_bill_weight }) => {
        return master_bill_weight && gramsToKilograms(master_bill_weight)
      },
    },
    { name: 'master_bill_recipient', label: t('common.masterBillRecipient') },
    {
      name: 'master_bill_phone',
      label: t('common.masterBillPhone'),
      field: row => {
        return `${row.master_bill_phone ?? '-'}/${row.master_bill_email ?? '-'}`
      },
    },
    {
      name: 'created_at',
      label: t('common.createAt'),
      field: row => {
        return convertTz(row.created_at)
      },
    },
    {
      name: 'etd',
      label: t('common.etd'),
      type: 'time',
      tz: row => row.etd_tz || null,
    },
    {
      name: 'atd',
      label: t('common.atd'),
      type: 'time',
      tz: row => row.atd_tz || null,
    },
    {
      name: 'eta',
      label: t('common.eta'),
      type: 'time',
      tz: row => row.eta_tz || null,
    },
    {
      name: 'ata',
      label: t('common.ata'),
      type: 'time',
      tz: row => row.ata_tz || null,
    },
    {
      name: 'noa',
      label: t('common.noa'),
      type: 'time',
      tz: row => row.noa_tz || null,
    },
    {
      name: 'pickup_time',
      label: t('common.pickupTime'),
      type: 'time',
      tz: row => row.pickup_time_tz || null,
    },
    {
      name: 'arrival_time',
      label: t('common.arrivalTime'),
      type: 'time',
      tz: row => row.arrival_time_tz || null,
    },
    {
      name: 'ready_for_handover_time',
      label: t('common.readyForHandover'),
      type: 'time',
      tz: row => row.ready_for_handover_time_tz || null,
    },
    {
      type: 'html',
      name: 'customs_clearance_quantity',
      label: t('common.customsClearanceQuantity'),
      field: row => {
        return `<span class="text-secondary">${row.customs_clearance_quantity}</span>/${row.sub_bill_amount}`
      },
    },
    {
      type: 'html',
      name: 'instock_quantity',
      label: t('order.inboundProgress'),
      field: row => {
        return `<span class="text-secondary">${row.instock_quantity}</span>/${row.sub_bill_amount}`
      },
    },
    {
      type: 'html',
      name: 'outstock_quantity',
      label: t('order.outboundProgress'),
      field: row => {
        return `<span class="text-secondary">${row.outstock_quantity}</span>/${row.sub_bill_amount}`
      },
    },
  ])

  function addHandleColumn() {
    if (
      tableColumns.value[tableColumns.value.length - 1].name !== 'operation'
    ) {
      tableColumns.value.push({
        name: 'operation',
        label: t('common.operation'),
        type: 'operation',
      })
    }
  }
  function removeHandleColumn() {
    if (
      tableColumns.value[tableColumns.value.length - 1].name === 'operation'
    ) {
      tableColumns.value.pop()
    }
  }

  const detailColumns = ref([
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'carrier_ref', label: t('common.carrierRef') },
    {
      name: 'barcode',
      label: t('common.barcode'),
      field: 'barcode',
    },
    {
      name: 'recipient_name',
      label: t('common.recipientName'),
      field: 'recipient_name',
    },
    {
      name: 'recipient_country',
      label: t('common.recipientCountry'),
      field: 'recipient_country',
    },
    {
      name: 'recipient_post_code',
      label: t('common.recipientPostCode'),
      field: 'recipient_post_code',
    },
    {
      name: 'sender_name',
      label: t('common.senderName'),
      field: 'sender_name',
    },
    {
      name: 'sender_country',
      label: t('common.senderCountry'),
      field: 'sender_country',
    },
    {
      name: 'custom_time',
      label: t('common.customTime'),
      type: 'time',
      tz: row => row.custom_time_tz,
    },
    {
      name: 'inbound_time',
      label: t('common.inboundTime'),
      type: 'time',
      tz: row => row.inbound_time_tz,
    },
    {
      name: 'outbound_time',
      label: t('common.outboundTime'),
      type: 'time',
      tz: row => row.outbound_time_tz,
    },
    {
      name: 'car_no',
      label: t('common.carNo'),
      field: 'car_no',
    },
  ])
  const orderTemplateDownloadURL = {
    cn: 'https://gateway-eu-aws.shaoke.com/sit-eu-erp/api/v1/aws_s3_down/?file_name=导入订单-中文模板.xlsx',
    en: 'https://gateway-eu-aws.shaoke.com/sit-eu-erp/api/v1/aws_s3_down/?file_name=create_waybill-en.xlsx',
    fr: 'https://gateway-eu-aws.shaoke.com/sit-eu-erp/api/v1/aws_s3_down/?file_name=create_waybill-fr.xlsx',
    de: 'https://gateway-eu-aws.shaoke.com/sit-eu-erp/api/v1/aws_s3_down/?file_name=create_waybill-de.xlsx',
  }
  return {
    formSchemas,
    tableColumns,
    removeHandleColumn,
    addHandleColumn,
    detailColumns,
    batchedTypeList,
    isBatchedList,
    orderTemplateDownloadURL,
  }
}
