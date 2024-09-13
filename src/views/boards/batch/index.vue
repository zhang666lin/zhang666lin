<template>
  <Board type="batch" :filters="filters" :table-columns="tableColumns" />
</template>

<script setup>
import Board from '../components/Board.vue'

import useData from './useData'

defineOptions({ name: 'BatchBoard' })

const { filters, tableColumns } = useData()
</script>
