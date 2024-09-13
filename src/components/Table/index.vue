<template>
  <div class="full-height relative-position col">
    <ColumnSetting
      v-if="setable && isHoverTh"
      class="absolute-top-right q-ma-sm q-mr-md"
      :columns="currentColumns"
      @close="isHoverTh = false"
      @update-columns="updateColumns"
    />
    <q-table
      ref="tableRef"
      v-model:selected="selected"
      v-model:pagination="pagination"
      flat
      class="sticky fit"
      :rows="innerData"
      :columns="displayableColumns"
      :loading="innerLoading"
      :row-key="rowKey"
      :selection="selection"
      :table-style="tableStyle"
      :rows-per-page-label="t('sys.paginationInfo', [pagination.rowsNumber])"
      :rows-per-page-options="[10, 15, 20, 30, 50, 100]"
      :hide-bottom="noPagination"
      @request="onRequest"
    >
      <template #loading>
        <q-inner-loading class="q-mt-xl z-top" showing color="grey" />
      </template>
      <template #header="scope">
        <q-tr :props="scope" @mouseover="mouseoverTh" @mouseout="mouseoutTh">
          <q-th
            v-if="selection !== 'none'"
            auto-width
            class="sticky-first-column"
          >
            <q-checkbox v-model="scope.selected" size="xs" />
          </q-th>
          <template v-for="(col, index) in scope.cols" :key="col.name">
            <q-th
              :props="scope"
              :class="{
                'sticky-first-column': col.type === 'index' && index === 0,
                'sticky-last-column': col.type === 'operation',
              }"
            >
              {{ col.label }}
            </q-th>
          </template>
        </q-tr>
      </template>
      <template #body="scope">
        <q-tr :props="scope">
          <q-td
            v-if="selection !== 'none'"
            auto-width
            class="sticky-first-column"
          >
            <q-checkbox v-model="scope.selected" size="xs" />
          </q-td>
          <template v-for="(col, index) in scope.cols" :key="col.name">
            <q-td
              v-overflow-tooltip="
                getComputedType(col, scope) !== 'component' && {
                  placement: col.tooltip ? 'bottom' : 'top',
                  offset: [0, -6],
                }
              "
              v-tooltip="
                col.tooltip && {
                  placement: 'top',
                  offset: [0, -6],
                  allowHTML: true,
                  content: getComputedTooltip(col, scope),
                }
              "
              :props="scope"
              :class="[
                {
                  'sticky-first-column':
                    getComputedType(col, scope) === 'index' && index === 0,
                  'sticky-last-column':
                    getComputedType(col, scope) === 'operation',
                },
                'ellipsis',
              ]"
              :style="{
                maxWidth: '200px',
                padding: getComputedType(col, scope) === 'time' && '0 16px',
              }"
            >
              <template v-if="getComputedType(col, scope) === 'index'">
                {{ scope.rowIndex + 1 }}
              </template>
              <template v-else-if="getComputedType(col, scope) === 'time'">
                <template v-if="col.value">
                  <template v-if="_.isFunction(col.tz)">
                    <template v-if="col.tz(scope.row)"
                      >{{ col.tz(scope.row) }} <br
                    /></template>
                    {{
                      convertTz(
                        col.value,
                        col.tz(scope.row),
                        false,
                        col.timeFormat,
                      )
                    }}
                  </template>
                  <template v-else>
                    <template v-if="col.tz">{{ col.tz }} <br /></template>
                    {{ convertTz(col.value, col.tz, false, col.timeFormat) }}
                  </template>
                </template>
                <template v-else>-</template>
              </template>
              <template v-else-if="getComputedType(col, scope) === 'copy'">
                <q-btn
                  v-if="col.value"
                  text-color="accent"
                  flat
                  dense
                  no-wrap
                  no-caps
                  @click="onClickCopyBtn(col.value)"
                >
                  <div
                    v-overflow-tooltip="{ offset: [0, 6] }"
                    style="max-width: 200px"
                    class="ellipsis"
                  >
                    {{ col.value }}
                  </div>
                </q-btn>
                <span v-else>-</span>
              </template>
              <template v-else-if="getComputedType(col, scope) === 'component'">
                <template v-if="col.component?.type === 'select'">
                  <SelectV2
                    v-model="scope.row[col.name]"
                    v-model:options="col.component.options"
                    bg-color="white"
                    :label="col.component.label"
                    :width="col.component.width || '180px'"
                    :multiple="col.component.multiple"
                    :default-selected="col.component.defaultSelected"
                    :remote-config="col.component.remoteConfig"
                    :real-time-options="col.component.realTimeOptions"
                    :local-filter="col.component.localFilter"
                    :options="col.component.options"
                    :option-value="col.component.optionValue"
                    :option-label="col.component.optionLabel"
                    :stack-label="col.component.stackLabel"
                    :loading="col.component.loading"
                    :disable="col.component.disable"
                    :rules="col.component.rules"
                    :tooltip="col.component.tooltip"
                    :searchable="col.component.searchable"
                  />
                </template>
                <template v-else-if="col.component?.type === 'input'">
                  <q-input
                    v-model="scope.row[col.name]"
                    :style="{ width: '180px' }"
                    outlined
                    dense
                    clearable
                    reactive-rules
                    bg-color="white"
                    :label="col.component.label"
                    :rules="col.component.rules"
                  />
                </template>
              </template>
              <template v-else-if="getComputedType(col, scope) === 'button'">
                <q-btn
                  v-if="col.value"
                  flat
                  dense
                  no-wrap
                  no-caps
                  color="secondary"
                  @click="emit('clickCellButton', scope.row, col)"
                >
                  <div
                    v-overflow-tooltip="{ offset: [0, 6] }"
                    style="max-width: 200px"
                    class="ellipsis"
                  >
                    {{ col.value }}
                  </div>
                </q-btn>
                <span v-else>-</span>
              </template>
              <template v-else-if="getComputedType(col, scope) === 'link'">
                <q-btn
                  v-if="col.value"
                  flat
                  dense
                  no-wrap
                  no-caps
                  color="secondary"
                  :href="scope.row[col.name]"
                  :download="col.value"
                >
                  <div
                    v-overflow-tooltip="{ offset: [0, 6] }"
                    style="max-width: 200px"
                    class="ellipsis"
                  >
                    {{ col.value }}
                  </div>
                </q-btn>
                <span v-else>-</span>
              </template>
              <template v-else-if="getComputedType(col, scope) === 'html'">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-if="col.value" v-html="col.value"></div>
                <span v-else>-</span>
              </template>
              <template v-else-if="getComputedType(col, scope) === 'operation'">
                <slot
                  name="operation-column"
                  :row="scope.row"
                  :index="scope.rowIndex"
                />
              </template>
              <template v-else>
                {{ col.value === 0 ? 0 : col.value || '-' }}
              </template>
            </q-td>
          </template>
        </q-tr>
        <slot name="expand" :scope="scope" :selection="selection" />
      </template>
      <template v-if="!noPagination" #pagination="scope">
        <div class="row justify-end items-center">
          <div class="row justify-end items-center">
            <q-btn
              icon="chevron_left"
              color="grey-8"
              round
              dense
              flat
              :disable="scope.isFirstPage"
              @click="scope.prevPage"
            />
            <q-pagination
              v-model="qPaginationValue"
              :max="scope.pagesNumber"
              :max-pages="6"
              :boundary-numbers="true"
              @update:model-value="jumpPage"
            />
            <q-btn
              icon="chevron_right"
              color="grey-8"
              round
              dense
              flat
              :disable="scope.isLastPage"
              @click="scope.nextPage"
            />
          </div>
          <div class="row justify-end items-center">
            <div class="page-jumper">
              {{ t('sys.toPagePrefix') }}
              <q-input
                v-model="pageInputValue"
                outlined
                dense
                input-class="page-input"
                class="q-ml-sm q-mr-sm"
                @update:model-value="handleInputLimit"
                @keydown.enter="jumpPage(pageInputValue)"
              />
              {{ t('sys.toPageSuffix') }}
            </div>
            <q-btn
              icon="arrow_forward"
              color="primary"
              round
              dense
              flat
              class="q-ml-sm"
              @click="jumpPage(pageInputValue)"
            />
            <template v-if="download">
              <q-separator vertical inset class="q-mx-md" />
              <q-btn
                round
                text-color="primary"
                icon="file_download"
                padding="6px"
                @click="handleDownload"
              >
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  :offset="[10, 10]"
                >
                  {{ t('sys.downloadList') }}
                </q-tooltip>
              </q-btn>
            </template>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { copyToClipboard } from 'quasar'
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

import ColumnSetting from './ColumnSetting.vue'

import SelectV2 from '@/components/SelectV2/index.vue'
import { onlyNumber } from '@/utils'
import { showError, showSuccess } from '@/components'
import { convertTz } from '@/utils/time.js'

const { t } = useI18n()
const isHoverTh = ref(false)
const currentColumns = ref([])
function updateColumns(columns) {
  currentColumns.value = columns.map((i, index) => {
    i.__sort = index
    return i
  })
}

function getColumns() {
  return currentColumns.value
}
function setColumns(columns) {
  currentColumns.value = convertColumns(
    columns.map((i, index) => {
      i.__sort = index
      return i
    }),
  )
}

const emit = defineEmits([
  'clickCellButton',
  'tableSelected',
  'changeToggle',
  'download',
])
const props = defineProps({
  /** 传了 api 则使用 api 获取数据 */
  api: {
    type: [Function, null],
    default: null,
  },
  /** 不传 api, 则使用 rows 作为数据源 */
  rows: {
    type: [Boolean, Array],
    default: false,
  },
  columns: {
    type: Array,
    required: true,
  },
  /** 指定 key 作为行的唯一标识，影响选择功能 */
  rowKey: {
    type: String,
    validator(value, props) {
      return props.selection !== 'none' ? !!value : true
    },
    default(rawProps) {
      if (rawProps.selection !== 'none') {
        return 'id'
      }
      return undefined
    },
  },
  /** 选择模式，可选 none, single, multiple */
  selection: {
    type: String,
    default: 'none',
  },
  /** 是否使用分页 */
  noPagination: {
    type: Boolean,
    default: false,
  },
  tableStyle: {
    type: Object,
    default: () => {
      return { height: 0 }
    },
  },
  /** 是否显示下载按钮，默认true */
  download: {
    type: Boolean,
    default: true,
  },
  /** 是否可设置列，默认false */
  setable: {
    type: Boolean,
    default: false,
  },
  /** 是否阻止分页 */
  preventPagination: {
    type: [Function, Boolean],
    default: false,
  },
  /** 是否显示loading, 使用 rows 作为数据源时生效 */
  loading: {
    type: Boolean,
    default: false,
  },
})

const tableRef = ref()
const innerData = ref([])
const innerLoading = ref(false)

if (!props.api) {
  watch(
    () => props.loading,
    value => {
      innerLoading.value = value
    },
    { immediate: true },
  )
  watch(
    props.rows,
    value => {
      innerData.value = value
    },
    { deep: true, immediate: true },
  )
}
const qPaginationValue = ref(1)
const pageInputValue = ref(1)
const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
})

function handleInputLimit(value) {
  if (value) {
    nextTick(() => {
      pageInputValue.value = onlyNumber(value)
    })
  }
}
const selected = ref([])

function mouseoverTh() {
  isHoverTh.value = true
}
function mouseoutTh(e) {
  if (e.toElement?.outerText === 'settings') return
  isHoverTh.value = false
}
function convertColumns(columns) {
  return columns.map(item => ({
    field: row => {
      return row[item.name]
    },
    align: 'center',
    show: true,
    ...item,
  }))
}
watch(props.columns, () => {
  currentColumns.value = convertColumns(props.columns)
})

onMounted(() => {
  currentColumns.value = convertColumns(props.columns)
})

const displayableColumns = computed(() => {
  const columns = _.sortBy(currentColumns.value, i => i.__sort)
  return columns.filter(col => col.show)
})
async function getPageData(page, rowsPerPage) {
  // 翻页清除勾选
  tableRef.value.clearSelection()
  if (props.api) {
    innerData.value = []
    innerLoading.value = true
    try {
      const { data, count } = await props.api({ page, rowsPerPage })
      pagination.value.rowsNumber = count
      innerData.value = data
      innerLoading.value = false
    } catch (error) {
      if (error.name === 'CanceledError') return
      console.error(error)
      if (!error.code) {
        showError('[Client] Error getting table data')
      } else {
        error.msg && showError(error.msg)
      }
      innerLoading.value = false
    }
  } else {
    innerData.value = props.rows || []
    // TODO 接收外部传入的数据，前端分页
  }
}

// 获取分页信息  可以在里面获取到 排序字段sortBy descending 等相关信息
function getPagination() {
  return pagination.value
}

// 刷新表格，跳转回第一页
function refresh() {
  pagination.value.page = 1
  pageInputValue.value = 1
  qPaginationValue.value = 1
  getPageData(pagination.value.page, pagination.value.rowsPerPage)
}

// 切换每页页数，点击上一页下一页按钮会触发 onRequest
function onRequest(val) {
  if (_.isFunction(props.preventPagination)) {
    if (props.preventPagination()) return
  } else if (props.preventPagination) {
    return
  }
  pagination.value = val.pagination
  qPaginationValue.value = pagination.value.page
  pageInputValue.value = pagination.value.page
  getPageData(pagination.value.page, pagination.value.rowsPerPage)
}
// 点击页码按钮，输入页码后回车或点击按钮会触发 jumpPage
function jumpPage(page) {
  if (_.isFunction(props.preventPagination)) {
    if (props.preventPagination()) {
      pageInputValue.value = pagination.value.page
      qPaginationValue.value = pagination.value.page
      return
    }
  } else if (props.preventPagination) {
    pageInputValue.value = pagination.value.page
    qPaginationValue.value = pagination.value.page
    return
  }
  page = Number(page) || 1
  if (
    page > Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
  ) {
    showError(t('sys.pageOutOfRange'))
  } else {
    pagination.value.page = page
    pageInputValue.value = page
    qPaginationValue.value = page
    getPageData(pagination.value.page, pagination.value.rowsPerPage)
  }
}
function onClickCopyBtn(content) {
  copyToClipboard(content)
    .then(() => {
      showSuccess(t('sys.copied'))
    })
    .catch(() => {
      showError(t('sys.copyFailed'))
    })
}
function setExpanded(val) {
  return tableRef.value.setExpanded(val)
}

function handleDownload() {
  emit(
    'download',
    currentColumns.value
      .filter(i => i.type !== 'index' && i.type !== 'operation')
      .map(i => {
        return { name: i.name, label: i.label, show: i.show }
      }),
  )
}

function setRowData(data) {
  // 仅支持设置了 rowKey 的表格
  const temp = innerData.value.find(
    item => item[props.rowKey] === data[props.rowKey],
  )
  temp && Object.assign(temp, data)
}

function getComputedType(col, scope) {
  if (_.isFunction(col.type)) {
    return col.type(scope.row)
  }
  return col.type
}
function getComputedTooltip(col, scope) {
  if (_.isFunction(col.tooltip)) {
    return col.tooltip(scope.row)
  }
  return col.tooltip
}

defineExpose({
  refresh,
  selected,
  setExpanded,
  getPagination,
  setRowData,
  getColumns,
  setColumns,
})
</script>

<style lang="scss" scoped>
.sticky {
  .q-table__top {
    padding: 0;
  }
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #fff;
  }
  thead tr th {
    position: sticky;
    z-index: 2;
  }
  thead tr:last-child th {
    top: 48px;
  }
  thead tr:first-child th {
    top: 0;
  }
  td:first-child,
  td:last-child {
    background-color: #fff;
    z-index: 1;
  }
  thead tr th:first-child {
    z-index: 3;
  }
  :deep(.q-table) {
    border-bottom: 1px solid $grey-4;
  }
}
.sticky-first-column {
  position: sticky;
  left: 0;
}
.sticky-last-column {
  position: sticky;
  right: 0;
}
.page-jumper {
  display: flex;
  align-items: center;
  line-height: 40px;
  & > label {
    display: inline-block;
    margin-left: 4px;
    margin-right: 4px;
  }
  :deep(.page-input) {
    width: 40px;
    text-align: center;
    line-height: 1.2em;
  }
  :deep(.q-field--dense) .q-field__control {
    height: 30px;
  }
}

.cell-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
:deep(.q-pagination__content) {
  button {
    min-width: 2em !important;
    padding: 2px 4px !important;
    margin: 0 2px !important;
  }
}
</style>
