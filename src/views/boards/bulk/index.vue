<template>
  <Board type="bulk" :filters="filters" :table-columns="tableColumns" />
</template>

<script setup>
import Board from '../components/Board.vue'

import useData from './useData'

defineOptions({ name: 'BulkBoard' })

const { filters, tableColumns } = useData()
</script>
