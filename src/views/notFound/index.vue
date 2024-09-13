<template>
  <div
    class="column justify-center items-center"
    style="height: 100vh !important"
  >
    <img :src="noDataImg" />
    <div class="text-h6 text-grey-7">{{ t('sys.pageNotFound') }}</div>
    <q-btn
      to="/"
      color="primary"
      :label="t('sys.backToHome')"
      class="q-mt-md"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import noDataImg from '@/assets/images/no-data.svg'
defineOptions({ name: 'NotFound' })

const { t } = useI18n()
</script>
