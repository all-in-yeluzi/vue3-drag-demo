<template>
  <div class="component-list" @dragstart="handleDragStart">
    <div v-for="(item, index) in componentList" :key="index" class="list" :draggable="true" :data-index="index">
      <el-icon v-if="item.icon.startsWith('el')">
        <component :is="elIconMap[item.icon]" />
      </el-icon>
      <span v-else class="iconfont" :class="'icon-' + item.icon"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import componentList from '@/custom-component/component-list'
import { DataAnalysis } from '@element-plus/icons-vue'

const elIconMap: Record<string, any> = {
  'el-icon-data-analysis': DataAnalysis,
}

const handleDragStart = (e: DragEvent) => {
  if (!e.dataTransfer) return
  const targetEl = (e.target as HTMLElement)?.closest('.list') as HTMLElement | null
  const index = targetEl?.dataset?.index ?? ''
  e.dataTransfer.setData('index', String(index))
}
</script>

<style lang="scss" scoped>
.component-list {
  opacity: 1;
  height: 65%;
  padding: 8px;
  display: grid;
  position: relative;
  grid-gap: 10px 19px;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 40px);
  transition: opacity 0.5s 0.5s;

  .list {
    width: 80px;
    height: 40px;
    border: 1px solid #ddd;
    cursor: grab;
    text-align: center;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      cursor: grabbing;
    }

    .iconfont {
      margin-right: 4px;
      font-size: 20px;
    }

    .icon-wenben,
    .icon-biaoge {
      font-size: 18px;
    }

    .icon-tupian {
      font-size: 16px;
    }
  }
}
</style>
