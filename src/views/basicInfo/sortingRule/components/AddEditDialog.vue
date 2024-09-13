<template>
  <Dialog
    v-model="show"
    :title="title"
    :content-style="{
      minWidth: '90%',
      maxWidth: '98%',
    }"
    @cancel="onDialogCancel"
    @confirm="onDialogConfirm"
    @close-dialog="onDialogCancel"
  >
    <q-form ref="formRef" autocomplete="off" class="dialog-content q-px-md">
      <div class="column">
        <div class="title q-mb-md">{{ t('common.baseInfo') }}</div>
        <div class="row q-gutter-md">
          <SelectV2
            ref="ruleCodeSelectRef"
            v-model="formData.sorting_rule_code"
            :default-selected="sortingRuleDefaultSelected"
            bg-color="white"
            :label="t('common.sortingRuleCode')"
            width="200px"
            allow-new-option
            :remote-config="{
              url: '__poms/sorting_rule/code/list',
              method: 'post',
            }"
            :local-filter="true"
            :rules="[required]"
            :new-option-rules="[val => stringLengthRule(val, 6, 15)]"
            :tooltip="t('baseInfo.enterToAdd')"
            @update:model-value="handleSelect"
          />
          <SelectV2
            v-model="formData.is_enabled"
            :style="{ width: '200px' }"
            bg-color="white"
            :label="t('common.isEnabled')"
            :options="isEnableOptions"
            :searchable="false"
            :clearable="false"
            @update:model-value="handleDisable"
          />
          <SelectV2
            v-model="formData.apply_warehouses"
            bg-color="white"
            :label="t('baseInfo.applyRange')"
            width="200px"
            local-filter
            multiple
            :searchable="false"
            :stack-label="t('sys.all')"
            :options="warehouseList"
            option-value="apply_warehouse"
            option-label="short_name"
          />
        </div>
      </div>
      <div v-if="formData.sorting_rule_code && !isNewRule" class="column">
        <div class="title">{{ t('baseInfo.effectiveRule') }}</div>
        <Table
          ref="effectiveTableRef"
          :rows="effectiveRules"
          :columns="effectiveTableColumns"
          :loading="effectiveTableLoading"
          :table-style="{
            minHeight: '100px',
            maxHeight: '300px',
          }"
          style="width: 100%; margin-bottom: 15px"
          :download="false"
          :no-pagination="true"
        >
          <template #operation-column="{ row, index }">
            <q-btn
              flat
              dense
              no-wrap
              no-caps
              color="secondary"
              :label="t('common.edit')"
              @click="handelEditAction(row, index)"
            />
          </template>
        </Table>
      </div>
      <div class="column">
        <div class="title">
          {{ t('baseInfo.ruleSetting') }}
          <q-btn
            flat
            dense
            no-wrap
            no-caps
            color="secondary"
            :label="t('common.add')"
            @click="addRuleRow"
          />
        </div>
        <Table
          ref="settingTableRef"
          class="setting-table"
          :rows="settingRows"
          :columns="settingTableColumns"
          :table-style="{ height: '360px' }"
          style="width: 100%"
          :download="false"
          :no-pagination="true"
        >
          <template #operation-column="{ row, index }">
            <q-btn
              flat
              dense
              no-wrap
              no-caps
              color="negative"
              :label="t('sys.delete')"
              :disable="isDisabled"
              @click="handelDelete(row, index)"
            />
            <q-btn
              v-if="type === 'add'"
              flat
              dense
              no-wrap
              no-caps
              color="secondary"
              :label="t('sys.copyAndAdd')"
              @click="handelCopy(row)"
            />
          </template>
        </Table>
      </div>
    </q-form>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import { useAddDialogScheme } from './useData.js'

import { required, stringLengthRule } from '@/utils/formValidRule'
import { useUserStore } from '@/store/modules/user'
import SelectV2 from '@/components/SelectV2/index.vue'
import Table from '@/components/Table/index.vue'
import {
  getSortingRuleList,
  editSortingRule,
} from '@/api/basicInfo/sortingRule.js'
import Dialog from '@/components/Dialog/index.vue'
import { showError, showSuccess } from '@/components'

const emits = defineEmits(['success'])

const title = ref('')

const { t } = useI18n()
const {
  isEnableOptions,
  settingTableColumns,
  effectiveTableColumns,
  setEffectTableCol,
} = useAddDialogScheme()
const $q = useQuasar()

const type = ref('add')
const formData = ref({})
const emptyRow = {
  destination_id: '',
  delivery_code: '',
  destination_country: '',
  client_name: '',
  sender_name: '',
  extra_info: '',
  apply_warehouses: [],
}
const show = ref(false)
const sortingRuleDefaultSelected = ref([])
function open(data) {
  if (data.type === 'add') {
    title.value = t('common.add')
    type.value = 'add'
    formData.value = {
      sorting_rule_code: '',
      is_enabled: true,
      apply_warehouses: [],
    }
    setEffectTableCol('add')
    settingRows.value = [{ ...emptyRow }]
  } else {
    title.value = t('common.edit')
    type.value = 'edit'
    formData.value = {
      sorting_rule_code: data.data.sorting_rule_code,
      is_enabled: true,
      apply_warehouses: [],
    }
    sortingRuleDefaultSelected.value = [
      {
        label: data.data.sorting_rule_code,
        value: data.data.sorting_rule_code,
      },
    ]
    setEffectTableCol('edit')
    settingRows.value = []
  }
  originFormData.value = _.cloneDeep(formData.value)
  show.value = true
}
function onDialogCancel() {
  if (!_.isEqual(originFormData.value, formData.value)) {
    $q.dialog({
      title: t('sys.prompt'),
      message: t('sys.unsavedChanges'),
      cancel: true,
    }).onOk(() => {
      show.value = false
    })
  } else {
    show.value = false
  }
}
const userStore = useUserStore()
const warehouseList = userStore.getWahList.map(i => {
  i.apply_warehouse = i.code
  return i
})
const formRef = ref(null)
const effectiveTableRef = ref(null)
const settingTableRef = ref(null)
const ruleCodeSelectRef = ref(null)
const isNewRule = ref(false)
const settingRows = ref([])

function handleSelect(value, isNew) {
  isNewRule.value = !!isNew
  getEffectiveRules(value)
}
function handleDisable(value) {
  if (!value && type.value === 'edit') {
    $q.dialog({
      title: t('sys.prompt'),
      message: t('sortingRule.disablePrompt'),
      cancel: true,
      persistent: true,
      html: true,
    })
      .onOk(() => {})
      .onCancel(() => {
        formData.value.is_enabled = value ? false : true
      })
  }
}
const effectiveTableLoading = ref(false)
function getEffectiveRules(sortingRuleCode) {
  if (sortingRuleCode) {
    effectiveTableLoading.value = true
    getSortingRuleList({
      sorting_rule_codes: [sortingRuleCode],
      page_num: 1,
      page_size: 99999,
    })
      .then(res => {
        effectiveRules.value = res.data.list.map(i => {
          i.apply_warehouses = i.apply_warehouses.map(j => j.apply_warehouse)
          return i
        })
        nextTick(() => {
          effectiveTableRef.value?.refresh()
        })
      })
      .finally(() => {
        effectiveTableLoading.value = false
      })
  } else {
    effectiveRules.value = []
    nextTick(() => {
      effectiveTableRef.value?.refresh()
    })
  }
}
const effectiveRules = ref([])

const originFormData = ref({})
const isDisabled = computed(
  () => type.value === 'add' && settingRows.value.length <= 1,
)
watch(
  () => formData.value.apply_warehouses,
  newValue => {
    if (newValue) {
      settingRows.value.forEach(item => {
        item['apply_warehouses'] = newValue
      })
    }
  },
  { deep: true },
)

function addRuleRow() {
  settingRows.value.push({ ...emptyRow })
}

function handelEditAction(row, index) {
  effectiveRules.value.splice(index, 1)
  settingRows.value.unshift(row)
}

function handelDelete(row, index) {
  if (row.id) {
    // 表示是从生效规则中来的
    effectiveRules.value.push(row)
    effectiveTableRef.value?.refresh()
  }
  settingRows.value.splice(index, 1)
}
function handelCopy(row) {
  const data = { ...row }
  settingRows.value.push(data)
}
async function onDialogConfirm() {
  const addRows = settingRows.value.concat(effectiveRules.value)
  formRef.value.validate().then(isPass => {
    if (isPass) {
      const params = addRows.map(i => {
        const item = { ...i }
        item.id = i.id || undefined
        item.destination_id = i.destination_id || undefined
        item.delivery_code = i.delivery_code || ''
        item.destination_country = i.destination_country || undefined
        item.client_name = i.client_name || undefined
        item.sender_name = i.sender_name || undefined
        item.extra_info = i.extra_info || undefined
        item.apply_warehouses =
          i.apply_warehouses?.length > 0 ? i.apply_warehouses : undefined
        item.sorting_rule_code = formData.value.sorting_rule_code
        item.is_enabled = formData.value.is_enabled
        return item
      })
      // type为add或edit 都调修改接口
      editSortingRule(params)
        .then(() => {
          // 关闭弹窗，刷新分拣规则列表
          show.value = false
          showSuccess(t('sys.submitSuccess'))
          emits('success')
        })
        .catch(err => {
          switch (err.code) {
            case 400011:
              showError(
                t('sortingRule.duplicateFailed', {
                  line: err.data.line,
                  sorting_rule_code: err.data.sorting_rule_code,
                }),
              )
              break
            default:
              showError(err.message)
          }
        })
    }
  })
}
defineExpose({ open })
</script>

<style lang="scss" scoped>
.title {
  line-height: 30px;
  font-size: 20px;
  font-weight: 600;
}
.dialog-content {
  overflow-x: hidden;
  overflow-y: auto;
}
:deep(.setting-table .q-field__bottom) {
  padding: 2px 12px 0;
}
:deep(.setting-table .q-field--with-bottom) {
  padding: 0 0;
}
:deep(.setting-table .q-table tbody td) {
  overflow: visible;
}
</style>
