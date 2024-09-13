<template>
  <q-btn dense round class="q-ma-xs">
    <q-avatar size="md"><img :src="userInfo.photo" /></q-avatar>
    <q-menu
      fit
      :offset="[10, 13]"
      transition-show="jump-down"
      transition-hide="jump-up"
    >
      <q-list>
        <q-item align="center">
          <q-item-section>{{ userInfo.username }}</q-item-section>
        </q-item>
        <q-item v-close-popup align="center" clickable @click="handleLogout">
          <q-item-section>{{ t('sys.logout') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import userIcon from '@/assets/images/user.svg'
import { useUserStore } from '@/store/modules/user'

const { t } = useI18n()
const userStore = useUserStore()
const userInfo = ref({
  username: userStore.getUserInfo?.username,
  photo: userStore.getUserInfo?.photo || userIcon,
})
function handleLogout() {
  userStore.logout()
}
</script>
