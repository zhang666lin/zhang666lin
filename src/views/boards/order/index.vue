<template>
  <Board type="order" :filters="filters" :table-columns="tableColumns" />
</template>

<script setup>
import Board from '../components/Board.vue'

import useData from './useData'

defineOptions({ name: 'OrderBoard' })

const { filters, tableColumns } = useData()
</script>
