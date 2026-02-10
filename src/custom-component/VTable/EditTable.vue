<template>
  <div class="edit-table">
    <table @dblclick="onDblclick">
      <tbody>
        <tr v-for="(item, row) in tableData" :key="row">
          <td v-for="(e, col) in item" :key="col" :class="{ selected: curTd === row + ',' + col }" @click="onClick(row, col)">
            <el-input
              v-if="canEdit && curTd === row + ',' + col"
              v-model="tableData[row][col]"
              v-focus
              @blur="onBlur"
            ></el-input>
            <span v-else>{{ e }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 10px">
      <el-button @click="addRow">添加行</el-button>
      <el-button @click="addCol">添加列</el-button>
      <el-button @click="deleteRow">删除行</el-button>
      <el-button @click="deleteCol">删除列</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import toast from '@/utils/toast'

const store = useMainStore()
const { curComponent } = storeToRefs(store)

const curTd = ref('')
const canEdit = ref(false)

const tableData = computed(() => {
  return curComponent.value ? curComponent.value.propValue.data : []
})

const onDblclick = () => {
  canEdit.value = true
}

const onClick = (row: any, col: any) => {
  curTd.value = `${row},${col}`
}

const onBlur = () => {
  canEdit.value = false
  curTd.value = ''
}

const deleteRow = () => {
  if (!curTd.value) {
    toast('请先选择单元格')
    return
  }

  const row = Number(curTd.value.split(',')[0])
  tableData.value.splice(row, 1)
}

const addRow = () => {
  const cols = tableData.value[0].length
  const newRow = new Array(cols).fill(' ')
  tableData.value.push(newRow)
}

const addCol = () => {
  tableData.value.forEach((item: any) => {
    item.push(' ')
  })
}

const deleteCol = () => {
  if (!curTd.value) {
    toast('请先选择单元格')
    return
  }

  const col = Number(curTd.value.split(',')[1])
  tableData.value.forEach((item: any) => {
    item.splice(col, 1)
  })
}

// v-focus directive
const vFocus = {
  mounted: (el: HTMLElement) => el.querySelector('input')?.focus(),
}
</script>

<style lang="scss" scoped>
.edit-table {
  overflow: auto;
  margin-bottom: 8px;

  & > table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;
    word-break: break-all;
    word-wrap: break-word;

    td {
      border: 1px solid #ebeef5;
      height: 40px;
      min-width: 60px;
      text-align: center;
      cursor: pointer;
      box-sizing: border-box;
      position: relative;

      &:hover {
        background-color: #f5f7fa;
      }
    }

    .selected {
      border: 2px solid #409eff;
    }
  }

  .el-button {
    margin-bottom: 10px;
  }
}
</style>
