<template>
  <DraggableDialog
    :visible="visible"
    :title="title"
    :cancel-fn="cancelFn"
    :confirm-fn="confirmFn"
    :hide-footer="true"
    :dialog-width="'30%'"
    @close-dialog="closeDialog"
  >
    <div class="dialog-content q-px-md">
      <div v-if="contactType === 'airline_name'" class="row q-mb-md">
        <span class="q-mr-lg col" style="text-align: right"
          >{{ t('common.airlineName') }}:</span
        >
        <span class="col">{{ contactInfo.airlineName ?? '-' }}</span>
      </div>
      <div v-if="contactType === 'gha'" class="row q-mb-md">
        <span class="q-mr-lg col" style="text-align: right"
          >{{ t('common.gha') }}:</span
        >
        <span class="col">{{ contactInfo.ghaName ?? '-' }}</span>
      </div>
      <div class="row q-mb-md">
        <span class="q-mr-lg col" style="text-align: right"
          >{{ t('baseInfo.contact') }}{{ t('baseInfo.name') }}:</span
        >
        <span class="col">{{ contactInfo.name ?? '-' }}</span>
      </div>
      <div class="row q-mb-md">
        <span class="q-mr-lg col" style="text-align: right"
          >{{ t('baseInfo.contact') }}{{ t('baseInfo.phone') }}:</span
        >
        <span class="col">{{ contactInfo.phone ?? '-' }}</span>
      </div>
      <div class="row q-mb-md">
        <span class="q-mr-lg col" style="text-align: right"
          >{{ t('baseInfo.contact') }}{{ t('baseInfo.email') }}:</span
        >
        <span class="col">{{ contactInfo.email ?? '-' }}</span>
      </div>
    </div>
  </DraggableDialog>
</template>
<script setup>
import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import DraggableDialog from '@/components/DraggableDialog.vue'
import { getAirlineGroundDetail } from '@/api/basicInfo/airlineGround'
import { showError } from '@/components'

const { t } = useI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  contactType: {
    type: String,
    default: '',
  },
  contactRow: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const emit = defineEmits(['closeContactDialog'])

const contactInfo = ref({})

function reset() {
  contactInfo.value = {}
}
function closeDialog(status) {
  reset()
  emit('closeContactDialog', status)
}

async function confirmFn() {}
function cancelFn() {}

async function handleGetContactInfo(type) {
  try {
    const res = await getAirlineGroundDetail({}, props.contactRow.id)
    if (res.code === 200) {
      const {
        airline_contact_name,
        airline_contact_phone,
        airline_contact_email,
        ground_contact_name,
        ground_contact_phone,
        ground_contact_email,
        airline_name,
        gha,
      } = res.data
      if (type === 'airline_name') {
        contactInfo.value = {
          airlineName: airline_name,
          name: airline_contact_name,
          phone: airline_contact_phone,
          email: airline_contact_email,
        }
      } else {
        contactInfo.value = {
          ghaName: gha,
          name: ground_contact_name,
          phone: ground_contact_phone,
          email: ground_contact_email,
        }
      }
    }
  } catch (err) {
    showError(err?.msg ?? err?.message ?? err)
  }
}

watch(
  () => props.contactType,
  newValue => {
    contactInfo.value = {}
    handleGetContactInfo(newValue)
  },
)
</script>
<style scoped lang="scss">
.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
