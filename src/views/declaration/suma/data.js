import { useI18n } from 'vue-i18n'

import { gramsToKilograms } from '@/utils'
import { getLast3months } from '@/utils/time'

export const useSuma = () => {
  const { t } = useI18n()

  const sumaFormSchemas = [
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
      apiURL: '/api/v1/base/info?params=customer&service_type=suma',
      multiple: false,
    },
    {
      type: 'multipleSelect',
      label: t('common.senderName'),
      field: 'sender_name',
      apiURL: '/api/v1/base/info?params=sender&service_type=suma',
    },
    {
      type: 'multipleSelect',
      label: t('common.warehouse'),
      field: 'warehouse',
      apiURL: '/api/v1/base/info?params=warehouse&service_type=suma',
    },
    {
      type: 'multipleSelect',
      label: t('common.customBroker'),
      field: 'custom_broker',
      apiURL: '/api/v1/base/info?params=custom_broker&service_type=suma',
    },
    {
      type: 'input',
      label: t('common.flightNumber'),
      field: 'flight_number',
    },
    {
      type: 'dateRange',
      label: t('common.createAt'),
      field: 'update_time',
      defaultValue: getLast3months,
    },
  ]

  const tableColumns = [
    // { name: 'client_ref', label: t('common.orderNo') },
    {
      name: 'carrier_ref',
      label: t('common.carrierRef'),
      type: 'button',
    },
    {
      name: 'flight_number',
      label: t('common.flightNumber'),
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
    {
      name: 'custom_broker',
      label: t('common.customBroker'),
    },
    {
      name: 'master_bill_amount',
      label: t('common.masterBillAmount'),
    },
    {
      name: 'sub_bill_amount',
      label: t('common.subBillAmount'),
    },
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
      type: 'time',
      name: 'created_at',
      label: t('common.createAt'),
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
  ]
  return {
    sumaFormSchemas,
    tableColumns,
  }
}
