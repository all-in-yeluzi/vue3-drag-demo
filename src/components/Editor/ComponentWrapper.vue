<template>
  <div @click="onClick" @mouseenter="onMouseEnter">
    <component
      :is="config.component"
      v-if="config.component.startsWith('SVG')"
      ref="component"
      class="component"
      :style="getSVGStyle(config.style)"
      :prop-value="config.propValue"
      :element="config"
      :request="config.request"
      :linkage="config.linkage"
    />

    <component
      :is="config.component"
      v-else
      ref="component"
      class="component"
      :style="getStyle(config.style)"
      :prop-value="config.propValue"
      :element="config"
      :request="config.request"
      :linkage="config.linkage"
    />
    <OnEvent :linkage="config.linkage" :element="config" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getStyle, getSVGStyle } from '@/utils/style'
import runAnimation from '@/utils/runAnimation'
import { events } from '@/utils/events'
import eventBus from '@/utils/eventBus'
import OnEvent from '@/custom-component/common/OnEvent.vue'
import dataManager from '@/utils/data-manager'

const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const component = ref<any>(null)

onMounted(() => {
  if (component.value) {
    runAnimation(component.value.$el, props.config.animations)
  }

  // 编辑器模式下请求数据，禁用定时器
  // 在预览模式下，ComponentWrapper 负责注册请求，允许定时器 (isEditor=false)
  if (props.config.request && props.config.request.url) {
    dataManager.registerComponent(props.config, false)
  }
})

const onClick = () => {
  const eventMap = props.config.events
  Object.keys(eventMap).forEach((event) => {
    ;(events as any)[event](eventMap[event])
  })

  eventBus.emit('v-click', props.config.id)
}

const onMouseEnter = () => {
  eventBus.emit('v-hover', props.config.id)
}
</script>

<style lang="scss" scoped>
.component {
  position: absolute;
}
</style>
