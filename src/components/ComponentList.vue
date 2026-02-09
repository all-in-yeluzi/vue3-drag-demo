<template>
  <div class="component-list-wrapper">
    <!-- 左侧分类导航 -->
    <div class="category-nav">
      <div
        v-for="category in categories"
        :key="category.key"
        class="nav-item"
        :class="{ active: currentCategory === category.key }"
        @click="currentCategory = category.key"
        :title="category.label"
      >
        <el-icon :size="24">
          <component :is="category.icon" />
        </el-icon>
        <span class="nav-label">{{ category.label }}</span>
      </div>
    </div>

    <!-- 右侧组件列表 -->
    <div class="component-panel">
      <div class="panel-header">
        {{ categories.find((c) => c.key === currentCategory)?.label }}
      </div>

      <!-- 图层列表 -->
      <RealTimeComponentList v-if="currentCategory === 'layer'" />

      <!-- 组件库列表 -->
      <div v-else class="component-scroll" @dragstart="handleDragStart">
        <div v-for="(group, subKey) in currentComponents" :key="subKey" class="component-group">
          <div class="group-title">{{ getSubCategoryLabel(subKey as string) }}</div>
          <div class="group-content">
            <div
              v-for="(item, index) in group"
              :key="index"
              class="list"
              :draggable="true"
              :data-index="item.index"
            >
              <el-icon v-if="item.component.icon.startsWith('el')">
                <component :is="elIconMap[item.component.icon]" />
              </el-icon>
              <span v-else class="iconfont" :class="'icon-' + item.component.icon"></span>
              <span class="component-label">{{ item.component.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import componentList from '@/custom-component/component-list'
import RealTimeComponentList from '@/components/RealTimeComponentList.vue'
import { DataAnalysis, Grid, Star, Menu, PieChart, Collection } from '@element-plus/icons-vue'

const elIconMap: Record<string, any> = {
  'el-icon-data-analysis': DataAnalysis,
}

const categories = [
  { key: 'base', label: '基础', icon: Grid },
  { key: 'shape', label: '形状', icon: Star },
  { key: 'functional', label: '功能', icon: Menu },
  { key: 'chart', label: '图表', icon: PieChart },
  { key: 'layer', label: '图层', icon: Collection },
]

// 子分类映射
const subCategoryMap: Record<string, string> = {
  // Base
  text: '文本',
  basic: '基础控件',
  media: '媒体',
  // Shape
  svg: 'SVG图形',
  // Functional
  table: '表格',
  // Chart
  bar: '柱状图',
  line: '折线图',
  pie: '饼图',
}

const currentCategory = ref('base')

const currentComponents = computed(() => {
  const filtered = componentList
    .map((component, index) => ({ component, index }))
    .filter((item) => item.component.category === currentCategory.value)

  // 按 subcategory 分组
  const grouped: Record<string, typeof filtered> = {}
  filtered.forEach((item) => {
    const sub = item.component.subcategory || 'other'
    if (!grouped[sub]) {
      grouped[sub] = []
    }
    grouped[sub].push(item)
  })
  return grouped
})

const getSubCategoryLabel = (key: string) => {
  return subCategoryMap[key] || '其他'
}

const handleDragStart = (e: DragEvent) => {
  if (!e.dataTransfer) return
  const targetEl = (e.target as HTMLElement)?.closest('.list') as HTMLElement | null
  const index = targetEl?.dataset?.index ?? ''
  e.dataTransfer.setData('index', String(index))
}
</script>

<style lang="scss" scoped>
.component-list-wrapper {
  height: 100%;
  display: flex;
  overflow: hidden;

  .category-nav {
    width: 60px;
    flex-shrink: 0;
    border-right: 1px solid var(--border-color, #ddd);
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f7fa;
    padding-top: 10px;

    .nav-item {
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #606266;
      transition: all 0.3s;
      margin-bottom: 5px;

      .nav-label {
        font-size: 12px;
        margin-top: 4px;
        transform: scale(0.9);
      }

      &:hover {
        background-color: #e6f7ff;
        color: #409eff;
      }

      &.active {
        background-color: #fff;
        color: #409eff;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: #409eff;
        }
      }
    }
  }

  .component-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .panel-header {
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      font-weight: bold;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      color: #333;
    }

    .component-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 10px;

      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
      }
    }

    .component-group {
      margin-bottom: 15px;

      .group-title {
        font-size: 13px;
        color: #909399;
        margin-bottom: 8px;
        padding-left: 5px;
        border-left: 3px solid #dcdfe6;
        line-height: 1;
      }

      .group-content {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;

        .list {
          aspect-ratio: 1;
          border: 1px solid #ddd;
          cursor: grab;
          text-align: center;
          color: #333;
          padding: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
          background: #fff;

          &:active {
            cursor: grabbing;
          }

          &:hover {
            border-color: #409eff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
          }

          .iconfont {
            font-size: 24px;
            margin-bottom: 5px;
          }

          .el-icon {
            font-size: 24px;
            margin-bottom: 5px;
          }

          .component-label {
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
