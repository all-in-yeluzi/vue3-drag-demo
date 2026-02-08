<template>
  <el-dialog
    :title="`${config.label} 动画配置`"
    :model-value="true"
    width="30%"
    center
    @close="handleCloseModal"
  >
    <div class="time">
      动画时长：<el-input-number
        v-model="config.animationTime"
        controls-position="right"
        :min="0.1"
        :precision="2"
        :step="0.01"
      />
    </div>
    <div class="loop">
      是否循环：<el-switch v-model="config.isLoop" active-text="是" inactive-text="否" :disabled="isDisabled">
      </el-switch>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseModal">取 消</el-button>
        <el-button type="primary" @click="handleSaveSetting">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import eventBus from '@/utils/eventBus'

const props = defineProps({
  curIndex: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['close'])

const store = useMainStore()
const { curComponent } = storeToRefs(store)

const config = ref<any>({})

const isDisabled = computed(() => {
  return curComponent.value.animations.length > 1
})

const { label, animationTime, isLoop = false, value } = curComponent.value.animations[props.curIndex] || {}
config.value = {
  animationTime,
  label,
  isLoop,
  value,
}

const handleCloseModal = () => {
  emit('close')
}

const handleSaveSetting = () => {
  const { isLoop } = config.value
  store.alterAnimation({
    index: props.curIndex,
    data: {
      animationTime: config.value.animationTime,
      isLoop,
    },
  })
  eventBus.emit('stopAnimation')
  handleCloseModal()
}
</script>

<style scoped lang="scss">
.loop {
  margin-top: 10px;
}
</style>
