<template>
  <div class="dialog-content q-px-md">
    <q-form ref="baseInfoFormRef" class="" autocomplete="off">
      <div
        v-for="(item, index) in formSchemas"
        :key="index"
        class="row q-gutter-lg item-row"
      >
        <div
          v-for="(schema, k) in item"
          :key="schema.label + k"
          class="col"
          :class="[
            schema.isEditing && title === t('common.edit')
              ? 'isFocus'
              : !schema.isEditing && title === t('common.edit')
                ? 'isBlur'
                : '',
          ]"
        >
          <q-input
            v-if="schema.type === 'input'"
            v-model="baseInfoForm[schema.field]"
            outlined
            dense
            clearable
            reactive-rules
            bg-color="white"
            debounce="500"
            :type="schema.subType"
            :label="schema.label"
            :rules="schema.rules"
            :maxlength="schema.maxlength"
            @focus="schema.isEditing = true"
            @blur="schema.isEditing = false"
            @update:model-value="value => handleInputLimit(value, schema)"
          />
          <SelectV2
            v-if="schema.type === 'select'"
            v-model="baseInfoForm[schema.field]"
            bg-color="white"
            clearable
            :label="schema.label"
            :multiple="schema.multiple"
            :remote-config="schema.remoteConfig"
            :local-filter="schema.localFilter"
            :options="schema.options"
            :rules="schema.rules"
            :option-label="schema.optionLabel"
            :option-value="schema.optionValue"
            @focus="schema.isEditing = true"
            @blur="schema.isEditing = false"
            @update:model-value="value => limitInputRule(value, schema)"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'

import { useBasicInfo } from '../useData'

import SelectV2 from '@/components/Select/index.vue'
import { getCountryList } from '@/api/basicInfo/destination.js'
import { isEmptyObject } from '@/utils/location.js'
import { required } from '@/utils/formValidRule'
import { showError } from '@/components'
const { t } = useI18n()
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  rowInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const { formSchemas } = useBasicInfo()
const baseInfoFormRef = ref(null)
const baseInfoForm = reactive({
  destination_name: '',
  destination_type: '',
  country_code: '',
  state: '',
  city: '',
  street: '',
  address: '',
  postal_code: '',
  is_enabled: true,
})
const defaultForm = ref({})
const countryCodeList = ref([])

queryCountryList()
async function queryCountryList() {
  try {
    const { data = [], code } = await getCountryList()
    if (code === 200) {
      formSchemas.value.map(schemaItem => {
        const schema = schemaItem.find(
          item => item.type === 'select' && item.field === 'country_code',
        )
        if (schema) {
          schema.options = data || []
        }
      })
      countryCodeList.value = data || []
    }
  } catch (err) {
    showError(err?.msg ?? err?.message ?? err)
  }
}
watch(
  () => props.rowInfo,
  newValue => {
    const cloneBaseInfoForm = () => {
      defaultForm.value = _.cloneDeep(baseInfoForm)
    }
    if (isEmptyObject(newValue)) {
      cloneBaseInfoForm()
      return
    }
    for (let key in baseInfoForm) {
      baseInfoForm[key] = newValue[key]
    }
    cloneBaseInfoForm()
    const schema = formSchemas.value
      .flatMap(item => item)
      .find(temp => temp.field === 'destination_type')
    if (schema) {
      limitInputRule(baseInfoForm['destination_type'], schema)
    }
  },
  {
    immediate: true,
  },
)

function limitInputRule(value, schema) {
  if (schema.field !== 'destination_type') return false
  const fieldsToCheck = ['country_code', 'city', 'street', 'postal_code']
  formSchemas.value.map(item => {
    item.map(temp => {
      if (fieldsToCheck.includes(temp.field)) {
        temp.rules =
          value === 'SELF_PICKUP' ? [{ required: false }] : [required]
      }
    })
  })
}
function validate() {
  return baseInfoFormRef.value.validate()
}
// 判断原对象和现在的对象是否相等
function isObjEqual() {
  return _.isEqual(defaultForm.value, baseInfoForm)
}
function handleInputLimit(value, schema) {
  if (value) {
    baseInfoForm[schema.field] = value.trim()
  }
}
defineExpose({
  baseInfoForm,
  validate,
  isObjEqual,
})
</script>

<style lang="scss" scoped>
.item-row {
  margin-top: -16px;
}
.isFocus :deep(.q-field--outlined .q-field__control:before) {
  background-color: #fff;
}
.isBlur :deep(.q-field--outlined .q-field__control:before) {
  background-color: #eee;
}
</style>
