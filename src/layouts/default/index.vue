<template>
  <q-layout view="hHh lpR fFf">
    <Header />
    <Menu />
    <Content />
  </q-layout>
</template>

<script setup>
import Content from './content/index.vue'
import Header from './header/index.vue'
import Menu from './menu/index.vue'
</script>
