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
            <MultipleSelect
              ref="multipleSelectRef"
              v-model="baseInfoForm.destination"
              :schema="destinationSchema"
              :multiple="false"
            />
          </div>
          <div class="col">
            <Select
              ref="airlineNameRef"
              v-model="baseInfoForm.airline_name"
              clearable
              :rules="[required]"
              :label="`*${t('common.airlineName')}`"
              :options="airlineNameOptions"
              :option-value="'id'"
              :option-label="'airline_name'"
              :loading="isAirlineSelectLoading"
            />
          </div>
          <div class="col">
            <Select
              ref="ghaRef"
              v-model="baseInfoForm.gha"
              clearable
              :rules="[required]"
              :label="`*${t('common.gha')}`"
              :options="ghaOptions"
              :option-value="'id'"
              :option-label="'name'"
              :loading="isGhaSelectLoading"
            />
          </div>
        </div>
        <div class="row q-gutter-lg">
          <div class="col">
            <q-input
              v-model="baseInfoForm.shed_code"
              outlined
              dense
              clearable
              reactive-rules
              bg-color="white"
              debounce="500"
              :label="`*${t('baseInfo.shedCode')}`"
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
          <div class="col"></div>
        </div>
      </q-form>
    </div>
  </DraggableDialog>
</template>
<script setup>
import { ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

import DraggableDialog from '@/components/DraggableDialog.vue'
import { required } from '@/utils/formValidRule'
import Select from '@/components/Select/index.vue'
import { useBasicInfo } from '@/constants/basicInfo'
import {
  addAirlineGround,
  editAirlineGround,
} from '@/api/basicInfo/airlineGround'
import { getAirlineContactList } from '@/api/basicInfo/airline'
import { getGroundContactList } from '@/api/basicInfo/ground'
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

const emit = defineEmits(['closeAirlineGroundDialog'])
const baseInfoFormRef = ref(null)
const airlineNameRef = ref(null)
const ghaRef = ref(null)
const multipleSelectRef = ref(null)

const baseInfoForm = ref({})
const airlineNameOptions = ref([])
const ghaOptions = ref([])
const initDestination = ref('')
const destinationSchema = ref({})
const isAirlineSelectLoading = ref(false)
const isGhaSelectLoading = ref(false)

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

function reset() {
  baseInfoForm.value = { is_enable: '1' }

  baseInfoFormRef.value.reset()

  initDestination.value = ''

  airlineNameOptions.value = []
  ghaOptions.value = []

  isAirlineSelectLoading.value = false
  isGhaSelectLoading.value = false
}

function closeDialog(status) {
  reset()

  emit('closeAirlineGroundDialog', status)
}

async function confirmFn() {
  // todo 保存数据时 1、表单校验false 则直接返回false;  2、表单校验true  则调保存接口  接口调用ok 则返回true 否则返回false
  const baseInfoFormValidStatus = await baseInfoFormRef.value.validate()

  if (baseInfoFormValidStatus) {
    const { airline_name, gha, destination, is_enable, shed_code } =
      baseInfoForm.value

    const targetAirlineOption = airlineNameOptions.value.find(op => {
      return op.id === airline_name
    })
    const targetGhaOption = ghaOptions.value.find(op => {
      return op.id === gha
    })

    let params = {
      destination,
      is_enable,
      shed_code,
      airline_id: targetAirlineOption.id,
      ground_id: targetGhaOption.id,
      // airline_contact_id: targetAirlineOption.airline_contact_id,
      // ground_contact_id: targetGhaOption.ground_contact_id,
    }
    let res = null
    try {
      if (props.operateType === 'add') {
        res = await addAirlineGround(params)
      } else {
        res = await editAirlineGround(params, props.row.id)
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

async function handleEdit() {
  const { destination, shed_code, is_enable } = props.row

  initDestination.value = destination

  baseInfoForm.value = {
    destination,
    shed_code,
    is_enable: is_enable.toString(),
  }

  multipleSelectRef.value?.setSelectedOptionsAndLabels(destination ?? [])
}

// 编辑时 aireline_name gha 数据回显
function handleAirlineAndGha() {
  const {
    // airline_contact_id,
    // ground_contact_id,
    destination,
    airline_id,
    ground_id,
  } = props.row
  if (initDestination.value === destination) {
    const targetAirlineOption = airlineNameOptions.value.find(op => {
      // return op.airline_contact_id === airline_contact_id
      return op.id === airline_id
    })
    baseInfoForm.value.airline_name = targetAirlineOption?.id ?? ''

    const targetGhaOption = ghaOptions.value.find(op => {
      // return op.ground_contact_id === ground_contact_id
      return op.id === ground_id
    })
    baseInfoForm.value.gha = targetGhaOption?.id ?? ''

    initDestination.value = ''
    return
  }
}

async function handleGetAirlineNameList() {
  if (!baseInfoForm.value.destination) return
  isAirlineSelectLoading.value = true
  const params = { destination: baseInfoForm.value.destination, is_enable: '1' }
  try {
    const res = await getAirlineContactList(params)
    isAirlineSelectLoading.value = false
    if (res.code === 200) {
      airlineNameOptions.value = res.data ?? []
      airlineNameRef.value.innerOptions = airlineNameOptions.value
      return true
    }
    return false
  } catch (err) {
    showError(err?.msg ?? err?.message ?? err)
    return false
  }
}
async function handleGetGhaNameList() {
  if (!baseInfoForm.value.destination) return
  isGhaSelectLoading.value = true
  const params = { destination: baseInfoForm.value.destination, is_enable: '1' }
  try {
    const res = await getGroundContactList(params)
    isGhaSelectLoading.value = false
    if (res.code === 200) {
      ghaOptions.value = res.data ?? []
      ghaRef.value.innerOptions = ghaOptions.value
      return true
    }
    return false
  } catch (err) {
    showError(err?.msg ?? err?.message ?? err)
    return false
  }
}

handleGetAirlineNameList()
handleGetGhaNameList()

watchEffect(() => {
  if (props.operateType === 'edit' && props.visible) {
    handleEdit()
  }
})
watch(
  () => baseInfoForm.value.destination,
  async newVal => {
    if (!newVal) return

    isAirlineSelectLoading.value = false
    isGhaSelectLoading.value = false

    baseInfoForm.value.airline_name = null
    baseInfoForm.value.gha = null

    airlineNameOptions.value = []
    ghaOptions.value = []

    Promise.all([handleGetAirlineNameList(), handleGetGhaNameList()]).then(
      async res => {
        const isALLRequestDone = res.every(result => result)
        if (isALLRequestDone) {
          if (initDestination.value === newVal) {
            handleAirlineAndGha()
          }
        }
      },
    )
  },
)
</script>
<style scoped lang="scss">
.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
