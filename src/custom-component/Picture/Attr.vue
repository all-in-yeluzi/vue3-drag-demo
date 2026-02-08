<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="镜像翻转">
        <div style="clear: both">
          <el-checkbox v-model="curComponent.propValue.flip.horizontal" label="水平翻转"></el-checkbox>
          <el-checkbox v-model="curComponent.propValue.flip.vertical" label="垂直翻转"></el-checkbox>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'

const store = useMainStore()
const { curComponent } = storeToRefs(store)
</script>
