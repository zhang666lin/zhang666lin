<template>
  <DraggableDialog
    :visible="visible"
    :title="title"
    :cancel-fn="cancelFn"
    :confirm-fn="confirmFn"
    :dialog-width="'80%'"
    @close-dialog="closeDialog"
  >
    <div class="dialog-content q-px-md">
      <q-form ref="baseInfoFormRef" class="" autocomplete="off">
        <div class="row q-gutter-lg">
          <div class="col">
            <q-input
              v-model="baseInfoForm.name"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.clientName')}`"
              :maxlength="50"
              :rules="[required]"
            />
          </div>
          <div class="col">
            <q-input
              v-model="baseInfoForm.abbreviation"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.abbreviation')}`"
              :maxlength="50"
              :rules="[required]"
            />
          </div>
          <div class="col">
            <Select
              v-model="baseInfoForm.is_enable"
              :rules="[required]"
              :label="`*${t('common.isEnabled')}`"
              :options="enableOptions"
            />
          </div>
        </div>
        <div class="row q-gutter-lg">
          <div class="col">
            <q-input
              v-model="baseInfoForm.contact_name"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.contact')}`"
              :maxlength="50"
              :rules="[required]"
            />
          </div>
          <div class="col">
            <q-input
              v-model="baseInfoForm.title"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.contactTitle')}`"
              :maxlength="50"
              :rules="[required]"
            />
          </div>
          <div class="col">
            <q-input
              v-model="baseInfoForm.phone"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.contactPhone')}`"
              :maxlength="50"
              :rules="[() => validPhoneAndEmail()]"
            />
          </div>
        </div>
        <div class="row q-gutter-lg">
          <div class="col">
            <q-input
              v-model="baseInfoForm.email"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.contactEmail')}`"
              :maxlength="50"
              :rules="[
                () => validPhoneAndEmail(),
                val => (val ? validEmail(val) : true),
              ]"
            />
          </div>
          <div class="col"></div>
          <div class="col"></div>
        </div>
      </q-form>
    </div>
  </DraggableDialog>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import DraggableDialog from '@/components/DraggableDialog.vue'
import { required, validEmail, isNotEmpty } from '@/utils/formValidRule'
import Select from '@/components/Select/index.vue'
import { useBasicInfo } from '@/constants/basicInfo'
import { addCustomer, editCustomer } from '@/api/basicInfo/customer'
import { showSuccess, showError } from '@/components'

const { t } = useI18n()
const { enableOptions } = useBasicInfo()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  operateType: {
    type: String,
    default: 'add',
  },
  row: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const emit = defineEmits(['closeCustomerDialog'])
const baseInfoFormRef = ref(null)

const baseInfoForm = ref({})
const destinationOptions = ref([])

destinationOptions.value = []

baseInfoForm.value = { is_enable: '1' }

function reset() {
  baseInfoForm.value = { is_enable: '1' }

  baseInfoFormRef.value.reset()
}

function closeDialog(status) {
  reset()

  emit('closeCustomerDialog', status)
}

async function confirmFn() {
  const baseInfoFormValidStatus = await baseInfoFormRef.value.validate()
  if (baseInfoFormValidStatus) {
    const { name, abbreviation, is_enable, contact_name, title, phone, email } =
      baseInfoForm.value
    let params = {
      name,
      abbreviation,
      is_enable,
      contact_person: [
        {
          name: contact_name,
          title,
          phone,
          email,
        },
      ],
    }

    let res = null
    try {
      if (props.operateType === 'add') {
        res = await addCustomer(params)
      } else {
        params.contact_person[0].id = props.row.contact_person[0].id
        res = await editCustomer(params, props.row.id)
      }
      if (res.code === 200) {
        showSuccess(res.msg)
        return true
      }
      return false
    } catch (err) {
      showError(err?.msg ?? err?.message ?? err)
      return false
    }
  }

  return baseInfoFormValidStatus
}
function cancelFn() {}

function handleEdit() {
  const { name, abbreviation, is_enable, contact_person } = props.row
  baseInfoForm.value = {
    name,
    abbreviation,
    is_enable: is_enable.toString(),
    contact_name: contact_person[0].name,
    title: contact_person[0].title,
    phone: contact_person[0].phone,
    email: contact_person[0].email,
  }
}

function validPhoneAndEmail() {
  const valid =
    isNotEmpty(baseInfoForm.value.email) || isNotEmpty(baseInfoForm.value.phone)
  return valid || t('baseInfo.required')
}

watch(
  () => props.operateType,
  newValue => {
    if (newValue === 'edit') {
      handleEdit()
    }
  },
)
</script>
<style scoped lang="scss">
.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
