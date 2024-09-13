<template>
  <Board type="pmc" :filters="filters" :table-columns="tableColumns" />
</template>

<script setup>
import Board from '../components/Board.vue'

import useData from './useData'

defineOptions({ name: 'PmcBoard' })

const { filters, tableColumns } = useData()
</script>
