<template>
  <div class="attr-list">
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
</script>
