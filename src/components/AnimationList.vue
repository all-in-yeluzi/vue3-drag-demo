<template>
  <div class="animation-list" v-if="curComponent">
    <div class="div-animation">
      <el-button @click="isShowAnimation = true">添加动画</el-button>
      <el-button @click="previewAnimate">预览动画</el-button>
      <div>
        <el-tag v-for="(tag, index) in curComponent.animations" :key="index" closable @close="removeAnimation(index)">
          {{ tag.label }}
          <el-icon class="cursor" @click="handleAnimationSetting(index)"><Setting /></el-icon>
        </el-tag>
      </div>
    </div>

    <!-- 选择动画 -->
    <Modal v-model="isShowAnimation">
      <el-tabs v-model="animationActiveName">
        <el-tab-pane v-for="item in animationClassData" :key="item.label" :label="item.label" :name="item.label">
          <el-scrollbar class="animate-container">
            <div
              v-for="animate in item.children"
              :ref="(el) => setAnimateRef(el, animate.value)"
              :key="animate.value"
              class="animate"
              @mouseenter="runAnimationFn(animate)"
              @click="addAnimation(animate)"
            >
              <div>
                {{ animate.label }}
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </Modal>
    <!-- 编辑动画配置 -->
    <AnimationSettingModal
      v-if="isShowAnimationSetting"
      :cur-index="curIndex"
      @close="isShowAnimationSetting = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import Modal from '@/components/Modal.vue'
import eventBus from '@/utils/eventBus'
import animationClassData from '@/utils/animationClassData'
import runAnimation from '@/utils/runAnimation'
import AnimationSettingModal from './AnimationSettingModal.vue'
import { Setting } from '@element-plus/icons-vue'

const store = useMainStore()
const { curComponent } = storeToRefs(store)

const isShowAnimation = ref(false)
const animationActiveName = ref('进入')
const isShowAnimationSetting = ref(false)
const curIndex = ref(0)
const animateRefs = ref<any>({})

const setAnimateRef = (el: any, value: string) => {
  if (el) {
    animateRefs.value[value] = el
  }
}

const addAnimation = (animate: any) => {
  store.addAnimation(animate)
  isShowAnimation.value = false
}

const previewAnimate = () => {
  eventBus.emit('runAnimation')
}

const removeAnimation = (index: any) => {
  store.removeAnimation(index)
  if (curComponent.value && curComponent.value.animations && !curComponent.value.animations.length) {
    // 清空动画数据，停止运动
    eventBus.emit('stopAnimation')
  }
}

const handleAnimationSetting = (index: any) => {
  isShowAnimationSetting.value = true
  curIndex.value = index
}

const runAnimationFn = async (animate: any) => {
  if (animate.pending) return

  animate.pending = true
  await runAnimation(animateRefs.value[animate.value], [animate])

  // 防止无限触发同一元素的动画
  setTimeout(() => {
    animate.pending = false
  }, 100)
}
</script>

<style lang="scss">
.animation-list {
  .cursor {
    cursor: pointer;
    margin-left: 5px;
  }

  .div-animation {
    text-align: center;

    & > div {
      margin-top: 20px;
    }

    .el-tag {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      margin: auto;
      margin-bottom: 10px;
    }
  }

  .el-scrollbar__view {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-left: 10px;

    .animate {
      cursor: pointer;
    }

    .animate > div {
      width: 100px;
      height: 60px;
      background: #f5f8fb;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 12px;
      margin-bottom: 10px;
      font-size: 12px;
      color: #333;
      border-radius: 3px;
      user-select: none;
      cursor: pointer;
    }
  }
}
</style>
