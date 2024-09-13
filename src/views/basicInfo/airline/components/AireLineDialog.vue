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
      <div class="q-my-md">{{ t('common.baseInfo') }}</div>
      <q-form ref="baseInfoFormRef" class="" autocomplete="off">
        <div class="row q-gutter-lg">
          <div class="col">
            <q-input
              v-model="baseInfoForm.airline_name"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('common.airlineName')}`"
              :maxlength="50"
              :rules="[required]"
            />
          </div>
          <div class="col">
            <q-input
              v-model="baseInfoForm.awb_prefix"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('common.awbPrefix')}`"
              :maxlength="50"
              :rules="[required]"
            />
          </div>
          <div class="col">
            <q-input
              v-model="baseInfoForm.country"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.country')}`"
              :maxlength="50"
              :rules="[required]"
            />
          </div>
        </div>
        <div class="row q-gutter-lg">
          <div class="col">
            <q-input
              v-model="baseInfoForm.icao"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.icao')}`"
              :maxlength="50"
              :rules="[required]"
            />
          </div>
          <div class="col">
            <q-input
              v-model="baseInfoForm.iata"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.iata')}`"
              :maxlength="50"
              :rules="[required]"
            />
          </div>
          <div class="col">
            <q-input
              v-model="baseInfoForm.eu_customs_no"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.euCustomsNo')}`"
              :maxlength="50"
              :rules="[required]"
            />
          </div>
        </div>
        <div class="row q-gutter-lg">
          <div class="col">
            <MultipleSelect
              ref="multipleSelectRef"
              v-model="baseInfoForm.destination"
              :schema="destinationSchema"
              @update:model-value="handleUpdateMulSelectOps"
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
          <div class="col"></div>
        </div>
      </q-form>
      <div class="q-my-md">{{ t('baseInfo.contact') }}</div>
      <q-form ref="contactFormRef" autocomplete="off">
        <div class="row justify-center items-center q-py-sm">
          <div class="col-1 text-center">{{ t('common.No') }}</div>
          <div class="col text-center">{{ t('common.destination') }}</div>
          <div class="col-2 text-center">{{ t('baseInfo.name') }}</div>
          <div class="col-2 text-center">{{ t('baseInfo.phone') }}</div>
          <div class="col-3 text-center">{{ t('baseInfo.email') }}</div>
        </div>
        <template v-for="(contact, index) in contactForm" :key="index">
          <q-separator class="q-mb-sm" />
          <div class="row justify-center q-mt-md">
            <div class="col-1 q-pt-sm text-center">{{ index + 1 }}</div>
            <div class="col q-px-sm">
              <Select
                v-model="contact.destination"
                :rules="[required]"
                :label="`*${t('common.destination')}`"
                :options="contactDestinationOptions"
                :option-value="'code'"
                :option-label="'code'"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-input
                v-model="contact.name"
                outlined
                dense
                clearable
                reactive-rules
                bg-color="white"
                debounce="500"
                :label="`*${t('baseInfo.name')}`"
                :maxlength="50"
                :rules="[required]"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-input
                v-model="contact.phone"
                outlined
                dense
                clearable
                reactive-rules
                bg-color="white"
                debounce="500"
                :label="`*${t('baseInfo.phone')}`"
                :maxlength="50"
                :rules="[() => validPhoneAndEmail(contact)]"
              />
            </div>
            <div class="col-3 q-px-sm">
              <div class="row items-center">
                <q-input
                  v-model="contact.email"
                  outlined
                  dense
                  clearable
                  reactive-rules
                  bg-color="white"
                  debounce="500"
                  :label="`*${t('baseInfo.email')}`"
                  :maxlength="50"
                  :rules="[
                    () => validPhoneAndEmail(contact),
                    val => (val ? validEmail(val) : true),
                  ]"
                  class="col"
                />
                <q-btn
                  v-if="visibleDelBtn"
                  icon="delete"
                  class="q-mb-md q-ml-sm"
                  flat
                  round
                  color="red"
                  dense
                  @click="() => handleDelContact(index)"
                ></q-btn>
              </div>
            </div>
          </div>
        </template>
      </q-form>
      <q-separator class="q-mb-sm" />
      <div class="q-py-sm row justify-center">
        <q-btn
          color="primary"
          icon="add"
          size="small"
          @click="handleAddContact"
        />
      </div>
    </div>
  </DraggableDialog>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import DraggableDialog from '@/components/DraggableDialog.vue'
import { required, validEmail, isNotEmpty } from '@/utils/formValidRule'
import Select from '@/components/Select/index.vue'
import MultipleSelect from '@/components/Select/MultipleSelect.vue'
import { useBasicInfo } from '@/constants/basicInfo'
import { showWarning, showSuccess, showError } from '@/components'
import { addAirline, editAirline } from '@/api/basicInfo/airline'
import { hasDuplicates } from '@/utils/helper'
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

const emit = defineEmits(['closeAirlineDialog'])
const baseInfoFormRef = ref(null)
const contactFormRef = ref(null)
const multipleSelectRef = ref(null)

const baseInfoForm = ref({})
const contactForm = ref([])
const destinationSchema = ref({})
const contactDestinationOptions = ref([])

contactForm.value = [{}]

destinationSchema.value = {
  label: `*${t('common.destination')}`,
  field: 'destination',
  defaultValue: '',
  selectedOpsCanWrap: false, // 选中的option是否可以换行 非必填
  optionValue: 'code', // 指定value字段 默认value 非必填
  optionLabel: 'code', // 指定label字段 默认label 非必填
  apiURL: '/api/v1/destinations', // 请求数据源的url 非必填
  options: [],
  rules: [required],
}

baseInfoForm.value = { is_enable: '1' }

const visibleDelBtn = computed(() => {
  return contactForm.value.length > 1
})

function reset() {
  baseInfoForm.value = { is_enable: '1' }
  contactForm.value = [{}]
  contactDestinationOptions.value = []

  baseInfoFormRef.value.reset()
  contactFormRef.value.reset()
}

function closeDialog(status) {
  reset()

  emit('closeAirlineDialog', status)
}

function validPhoneAndEmail(row) {
  const valid = isNotEmpty(row.email) || isNotEmpty(row.phone)
  return valid || t('baseInfo.required')
}

function handleAddContact() {
  contactForm.value.push({})
}
function handleDelContact(index) {
  contactForm.value.splice(index, 1)
}
function handleUpdateMulSelectOps(val) {
  contactDestinationOptions.value = val.map(i => {
    return { code: i }
  })
}

async function confirmFn() {
  const baseInfoFormValidStatus = await baseInfoFormRef.value.validate()
  const contactFormValidStatus = await contactFormRef.value.validate()

  if (!baseInfoFormValidStatus || !contactFormValidStatus) {
    return false
  }

  // 每条联系人数据对应的目的地要有唯一性
  const destinationsArr = contactForm.value.map(contact => contact.destination)
  const isDestinationNotUnique = hasDuplicates(destinationsArr)
  if (isDestinationNotUnique) {
    showWarning(t('baseInfo.selectOnly1destination'))
    return false
  }
  // 只能选择基础信息中已选择的目的地 baseInfoForm.value.destination
  const validDesExist = destinationsArr.every(des =>
    baseInfoForm.value.destination.includes(des),
  )
  if (!validDesExist) {
    showWarning(t('baseInfo.selectDestinationInBaseInfo'))
    return false
  }

  if (baseInfoFormValidStatus && contactFormValidStatus) {
    let params = {
      ...baseInfoForm.value,
      contact_person: contactForm.value,
    }

    let res = null
    try {
      if (props.operateType === 'add') {
        res = await addAirline(params)
      } else {
        res = await editAirline(params, props.row.id)
      }
      if (res.code === 200) {
        showSuccess(t('sys.submitSuccess'))
        return true
      }
      return false
    } catch (err) {
      showError(err?.msg ?? err?.message ?? err)
      return false
    }
  }

  return baseInfoFormValidStatus && contactFormValidStatus
}
function cancelFn() {}

function handleEdit() {
  const {
    airline_name,
    awb_prefix,
    country,
    icao,
    iata,
    eu_customs_no,
    destination,
    is_enable,
    contact_person,
  } = props.row
  baseInfoForm.value = {
    airline_name,
    awb_prefix,
    country,
    icao,
    iata,
    eu_customs_no,
    destination,
    is_enable: is_enable.toString(),
  }
  contactForm.value = contact_person.map(contact => {
    const { destination, email, airline_id, id, name, phone } = contact
    return {
      destination,
      email,
      airline_id,
      id,
      name,
      phone,
    }
  })
  multipleSelectRef.value?.setSelectedOptionsAndLabels(destination ?? [])
  contactDestinationOptions.value = destination ?? []
}

watch(
  () => props.visible,
  val => {
    if (props.operateType === 'edit' && val) {
      handleEdit()
    }
  },
  { immediate: true },
)
</script>
<style scoped lang="scss">
.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
