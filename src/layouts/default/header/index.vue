<template>
  <q-header elevated>
    <q-toolbar>
      <MenuTrigger />
      <PortPicker />
      <q-space />
      <LocalePicker />
      <Avatar />
    </q-toolbar>
  </q-header>
</template>

<script setup>
import Avatar from './Avatar.vue'
import LocalePicker from './LocalePicker.vue'
import PortPicker from './PortPicker.vue'
import MenuTrigger from './MenuTrigger.vue'
</script>
