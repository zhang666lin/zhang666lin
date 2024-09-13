<template>
  <div class="dialog-content q-px-md">
    <div>
      <q-btn
        icon="add"
        class="q-my-md"
        size="small"
        text-color="teal-10"
        @click="() => handleAddDestinationInfo()"
        >{{ t('baseInfo.addDestination') }}</q-btn
      >
    </div>
    <q-form ref="destinationFormRef" class="full-weight" autocomplete="off">
      <div
        v-for="(form, index) in destinationInfoForm"
        :key="generateUniqueId(index)"
        class="items-start q-gutter-sm"
      >
        <q-card
          bordered
          :class="['q-px-md q-pb-md q-mb-lg', !visibleDelIcon ? 'q-pt-md' : '']"
        >
          <div class="row justify-end">
            <q-btn
              v-if="visibleDelIcon"
              icon="delete"
              class=""
              size="small"
              flat
              text-color="red"
              @click="() => handleDeleteDestination(index)"
            ></q-btn>
          </div>
          <div class="row q-gutter-sm">
            <div class="col">
              <SelectV2
                v-model="form.destination_id"
                bg-color="white"
                :label="`*${t('common.destination')}`"
                :local-filter="true"
                :options="destinationOptions"
                :option-value="'id'"
                :option-label="'destination_name'"
                :rules="[required]"
                :class="'full-width'"
                @update:model-value="
                  value => handleChangeDestination(value, index)
                "
              />
            </div>

            <div class="col">
              <Select
                v-model="form.is_enabled"
                :rules="[required]"
                :label="`*${t('common.isEnabled')}`"
                :options="enableOptions"
              />
            </div>
            <div class="col">
              <SelectV2
                v-model="form.apply_warehouses"
                bg-color="white"
                :label="`*${t('baseInfo.applyRange')}`"
                :local-filter="true"
                :options="applyOptions"
                :option-value="'code'"
                :option-label="'short_name'"
                :class="'full-width'"
                multiple
                :rules="[required]"
              />
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col">
              <Select
                v-model="form.destination_type"
                :rules="[required]"
                :label="`*${t('baseInfo.destinationType')}`"
                disable
                :options="desinationTypeOptions"
              />
            </div>
            <div class="col">
              <q-input
                v-model="form.postal_code"
                outlined
                disable
                dense
                clearable
                reactive-rules
                bg-color="white"
                debounce="500"
                :label="`*${t('common.postalCode')}`"
                :maxlength="200"
              />
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col">
              <q-input
                v-model="form.country_code"
                outlined
                disable
                dense
                clearable
                reactive-rules
                bg-color="white"
                debounce="500"
                :label="`*${t('baseInfo.country')}`"
                :maxlength="200"
              />
            </div>
            <div class="col">
              <q-input
                v-model="form.state"
                outlined
                disable
                dense
                clearable
                reactive-rules
                bg-color="white"
                debounce="500"
                :label="`*${t('baseInfo.state')}`"
                :maxlength="200"
              />
            </div>
            <div class="col">
              <q-input
                v-model="form.city"
                outlined
                disable
                dense
                clearable
                reactive-rules
                bg-color="white"
                debounce="500"
                :label="`*${t('baseInfo.city')}`"
                :maxlength="200"
              />
            </div>
          </div>
          <div class="row q-py-sm">
            <div class="col">
              <q-input
                v-model="form.street"
                outlined
                disable
                dense
                clearable
                reactive-rules
                bg-color="white"
                debounce="500"
                :label="`*${t('baseInfo.street')}`"
                :maxlength="200"
              />
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col">
              <q-input
                v-model="form.address"
                outlined
                disable
                dense
                clearable
                reactive-rules
                bg-color="white"
                debounce="500"
                :label="`*${t('baseInfo.address')}`"
                :maxlength="200"
              />
            </div></div
        ></q-card>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import _ from 'lodash'

// import MultipleSelect from '@/components/Select/MultipleSelect.vue'
import { useDeliveryCodeInfo } from '../deliveryCodeInfo'

import {
  getDestinationList,
  getDestinationById,
} from '@/api/basicInfo/deliveryCode'
import { required } from '@/utils/formValidRule'
import Select from '@/components/Select/index.vue'
import { generateUniqueId } from '@/utils/helper'
import SelectV2 from '@/components/SelectV2/index.vue'
import { showError } from '@/components'

const { t } = useI18n()
const { enableOptions, getCurrentPortWareHoseList, desinationTypeOptions } =
  useDeliveryCodeInfo()

const destinationInfoForm = ref([])
const destinationFormRef = ref(null)
const applyOptions = ref([])
const destinationOptions = ref([])

applyOptions.value = getCurrentPortWareHoseList()

const visibleDelIcon = computed(() => {
  return destinationInfoForm.value.length > 1
})

const initDesFormInfo = {}
destinationInfoForm.value = [_.cloneDeep(initDesFormInfo)]

function handleAddDestinationInfo() {
  destinationInfoForm.value.push(_.cloneDeep(initDesFormInfo))
}

function handleDeleteDestination(index) {
  destinationInfoForm.value.splice(index, 1)
}

function handleRestore(row) {
  destinationInfoForm.value = _.cloneDeep(row.destinations ?? [])
}

async function handleGetDestinationList() {
  try {
    const res = await getDestinationList()
    if (res.code === 200) {
      destinationOptions.value = res.data
    }
  } catch (err) {
    showError(err?.msg ?? err?.message ?? err)
  }
}

handleGetDestinationList()

async function handleChangeDestination(id, index) {
  try {
    const res = await getDestinationById({ id })
    if (res.code === 200) {
      const {
        destination_type,
        state,
        street,
        country_code,
        postal_code,
        city,
        address,
      } = res.data
      const params = {
        destination_type,
        state,
        street,
        country_code,
        postal_code,
        city,
        address,
      }

      destinationInfoForm.value[index] = {
        ...destinationInfoForm.value[index],
        ...params,
      }
    }
  } catch (err) {
    showError(err?.msg ?? err?.message ?? err)
  }
}

defineExpose({ handleRestore, destinationFormRef, destinationInfoForm })
</script>
<style scoped lang="scss">
.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
