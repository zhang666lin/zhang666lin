<template>
  <Board type="flat" :filters="filters" :table-columns="tableColumns" />
</template>

<script setup>
import Board from '../components/Board.vue'

import useData from './useData'

defineOptions({ name: 'FlatBoard' })

const { filters, tableColumns } = useData()
</script>
