<template>
  <div class="attr-list" v-if="curComponent">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="斑马纹">
        <el-switch v-model="curComponent.propValue.stripe"></el-switch>
      </el-form-item>
      <el-form-item label="表头加粗">
        <el-switch v-model="curComponent.propValue.thBold"></el-switch>
      </el-form-item>
      <el-form-item label="表格数据">
        <EditTable></EditTable>
      </el-form-item>
      <el-form-item label="列配置(动态数据)">
        <div v-for="(col, index) in curComponent.propValue.columns" :key="index" style="display: flex; margin-bottom: 5px;">
           <el-input v-model="col.label" placeholder="表头名" size="small" style="margin-right: 5px;"></el-input>
           <el-input v-model="col.prop" placeholder="字段Key" size="small" style="margin-right: 5px;"></el-input>
           <el-button type="danger" circle size="small" @click="removeCol(index as number)">X</el-button>
        </div>
        <el-button type="primary" size="small" @click="addCol">添加列</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import EditTable from './EditTable.vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'

const store = useMainStore()
const { curComponent } = storeToRefs(store)

const addCol = () => {
  if (!curComponent.value) return
  if (!curComponent.value.propValue.columns) {
    curComponent.value.propValue.columns = []
  }
  curComponent.value.propValue.columns.push({ label: '', prop: '' })
}

const removeCol = (index: number) => {
  if (!curComponent.value) return
  curComponent.value.propValue.columns.splice(index, 1)
}
</script>
