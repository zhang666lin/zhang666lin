import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { getLast3months } from '@/utils/time'
import { gramsToKilograms, onlyNumber } from '@/utils'

export default function useData() {
  const { t } = useI18n()

  const filters = ref([
    {
      type: 'multipleInput',
      label: t('common.carNo'),
      field: 'car_no',
      show: true,
    },
    {
      type: 'dateRange',
      label: t('sys.updateTime'),
      field: 'car_no_create',
      defaultValue: getLast3months,
      show: true,
    },
    {
      type: 'input',
      label: t('common.carrierRef'),
      field: 'carrier_ref',
    },
    {
      type: 'input',
      label: t('common.batchNo'),
      field: 'batch_no',
    },
    {
      type: 'input',
      label: t('boards.outboundBatchNo'),
      field: 'batch_sk_no',
    },
    {
      type: 'input',
      label: t('boards.sortingCode'),
      field: 'sorting_code',
    },
    {
      type: 'input',
      label: t('boards.nextDestination'),
      field: 'destination',
    },

    {
      type: 'input',
      label: t('boards.pltCount'),
      field: 'plt_count',
      limit: onlyNumber,
    },
    {
      type: 'input',
      label: t('boards.opkCount'),
      field: 'opk_count',
      limit: onlyNumber,
    },
    {
      type: 'input',
      label: t('boards.flatCount'),
      field: 'pcl_count',
      limit: onlyNumber,
    },
  ])
  const tableColumns = ref([
    { name: 'index', type: 'index', label: t('common.No') },
    { name: 'consigned_to_ehub', label: t('common.port') },
    {
      name: 'car_no',
      label: t('common.carNo'),
    },
    {
      name: 'carrier_ref',
      label: t('common.carrierRef'),
    },
    { name: 'batch_no', label: t('common.batchNo') },
    { name: 'batch_sk_no', label: t('boards.outboundBatchNo') },

    { name: 'plt_count', label: t('boards.pltCount') },
    {
      name: 'opk_count',
      label: t('boards.opkCount'),
    },
    { name: 'pcl_count', label: t('boards.flatCount') },
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
    { name: 'sorting_code', label: t('boards.sortingCode') },
    { name: 'destination', label: t('boards.nextDestination') },
    { type: 'time', name: 'car_no_create_at', label: t('common.createAt') },
  ])

  return { filters, tableColumns }
}
