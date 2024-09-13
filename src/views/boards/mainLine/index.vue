<template>
  <Board type="main_line" :filters="filters" :table-columns="tableColumns" />
</template>

<script setup>
import Board from '../components/Board.vue'

import useData from './useData'

defineOptions({ name: 'MainLineBoard' })

const { filters, tableColumns } = useData()
</script>
