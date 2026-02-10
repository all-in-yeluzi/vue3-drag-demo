<template>
  <div class="dv-decoration-1" :style="style">
    <svg :width="width" :height="height">
      <rect :x="rectX" :y="rectY" :width="rectWidth" :height="rectHeight" :fill="colors[0]">
        <animate
          attributeName="width"
          :values="`0;${rectWidth};0`"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          :values="`${rectX};${rectX - rectWidth/2};${rectX}`"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
      <rect :x="rectX" :y="rectY" :width="rectWidth" :height="rectHeight" :fill="colors[1]">
        <animate
          attributeName="width"
          :values="`0;${rectWidth};0`"
          dur="2s"
          begin="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          :values="`${rectX};${rectX - rectWidth/2};${rectX}`"
          dur="2s"
          begin="1s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, PropType } from 'vue'

const props = defineProps({
  color: {
    type: Array as PropType<string[]>,
    default: () => ['#fff', '#0de7c2'],
  },
  style: {
    type: Object,
    default: () => ({}),
  },
  width: {
    type: Number,
    default: 200,
  },
  height: {
    type: Number,
    default: 50,
  }
})

const { color, width, height } = toRefs(props)

const colors = computed(() => color.value || ['#fff', '#0de7c2'])

const rectWidth = computed(() => width.value * 0.2)
const rectHeight = computed(() => height.value * 0.2)
const rectX = computed(() => width.value / 2 - rectWidth.value / 2)
const rectY = computed(() => height.value / 2 - rectHeight.value / 2)
</script>

<style scoped>
.dv-decoration-1 {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
