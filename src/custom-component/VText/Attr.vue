<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="内容">
        <el-input v-model="curComponent.propValue" type="textarea" :rows="3" />
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
