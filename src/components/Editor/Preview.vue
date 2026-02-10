<template>
  <div ref="container" class="bg">
    <el-button v-if="!isScreenshot" class="close" @click="close">关闭</el-button>
    <el-button v-else class="close" @click="htmlToImage">确定</el-button>
    <div class="canvas-container">
      <div
        class="canvas"
        :style="{
          ...getCanvasStyle(canvasStyleData),
          width: changeStyleWithScale(canvasStyleData.width) + 'px',
          height: changeStyleWithScale(canvasStyleData.height) + 'px',
        }"
      >
        <ComponentWrapper v-for="item in componentData" :key="item.id" :config="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { getCanvasStyle } from '@/utils/style'
import ComponentWrapper from './ComponentWrapper.vue'
import { changeStyleWithScale } from '@/utils/translate'
import { toPng } from 'html-to-image'
import { deepCopy } from '@/utils/utils'
import dataManager from '@/utils/data-manager'

defineProps({
  isScreenshot: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const store = useMainStore()
const { componentData, canvasStyleData } = storeToRefs(store)

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  // 预览模式直接使用 store 数据，保持响应式，以便 DataManager 更新数据后组件能渲染
})

onUnmounted(() => {
  dataManager.clearAll()
})

const close = () => {
  emit('close')
}

const htmlToImage = () => {
  if (container.value) {
    toPng(container.value.querySelector('.canvas') as HTMLElement)
      .then((dataUrl) => {
        const a = document.createElement('a')
        a.setAttribute('download', 'screenshot')
        a.href = dataUrl
        a.click()
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error)
      })
      .finally(close)
  }
}
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgb(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;

  .canvas-container {
    width: calc(100% - 40px);
    height: calc(100% - 120px);
    overflow: auto;

    .canvas {
      background: #fff;
      position: relative;
      margin: auto;
    }
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
