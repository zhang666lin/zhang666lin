<template>
  <el-config-provider :z-index="3000" :locale="getElementLocale">
    <RouterView />
  </el-config-provider>
</template>

<script setup>
import { useLocale } from '@/hooks/useLocale'
import { useUpdate } from '@/hooks/useUpdate'
const { getElementLocale, setLocale } = useLocale()
const { addUpdateListener } = useUpdate()
setLocale()
addUpdateListener()
</script>
