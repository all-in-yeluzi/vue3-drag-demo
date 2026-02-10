<template>
  <div class="dv-border-box-6" style="overflow: visible">
    <svg :width="width" :height="height" class="border-svg-container">
      <polygon
        :fill="backgroundColor"
        :points="`9, 7 ${width - 9}, 7 ${width - 9}, ${height - 7} 9, ${height - 7}`"
      />
      <circle :fill="colors[1]" cx="5" cy="5" r="2" />
      <circle :fill="colors[1]" :cx="width - 5" cy="5" r="2" />
      <circle :fill="colors[1]" :cx="width - 5" :cy="height - 5" r="2" />
      <circle :fill="colors[1]" cx="5" :cy="height - 5" r="2" />
      
      <polyline :stroke="colors[0]" :points="`10, 4 ${width - 10}, 4`" />
      <polyline :stroke="colors[0]" :points="`10, ${height - 4} ${width - 10}, ${height - 4}`" />
      <polyline :stroke="colors[0]" :points="`5, 70 5, ${height - 70}`" />
      <polyline :stroke="colors[0]" :points="`${width - 5}, 70 ${width - 5}, ${height - 70}`" />
      <polyline :stroke="colors[0]" :points="`3, 10 3, 50`" />
      <polyline :stroke="colors[0]" :points="`7, 30 7, 80`" />
      <polyline :stroke="colors[0]" :points="`${width - 3}, 10 ${width - 3}, 50`" />
      <polyline :stroke="colors[0]" :points="`${width - 7}, 30 ${width - 7}, 80`" />
      <polyline :stroke="colors[0]" :points="`3, ${height - 10} 3, ${height - 50}`" />
      <polyline :stroke="colors[0]" :points="`7, ${height - 30} 7, ${height - 80}`" />
      <polyline :stroke="colors[0]" :points="`${width - 3}, ${height - 10} ${width - 3}, ${height - 50}`" />
      <polyline :stroke="colors[0]" :points="`${width - 7}, ${height - 30} ${width - 7}, ${height - 80}`" />
    </svg>
    <svg class="border-svg-container" :width="width" :height="height" style="pointer-events: none; overflow: visible">
      <text
        :x="width / 2 + xOffset"
        :y="20 + yOffset"
        :fill="titleColor || colors[0]"
        :font-size="titleFontSize"
        :font-weight="titleFontWeight"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ title }}
      </text>
    </svg>
    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, type PropType } from 'vue'

const props = defineProps({
  color: {
    type: Array as PropType<string[]>,
    default: () => ['rgba(255, 255, 255, 0.35)', 'gray'],
  },
  backgroundColor: {
    type: String,
    default: 'transparent',
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: '',
  },
  titleOffset: {
    type: Array as PropType<number[]>,
    default: () => [0, 0],
  },
  titleFontSize: {
    type: Number,
    default: 18,
  },
  titleColor: {
    type: String,
    default: '',
  },
  titleFontWeight: {
    type: String,
    default: 'normal',
  }
})

const { color } = toRefs(props)
const colors = computed(() => color.value || ['rgba(255, 255, 255, 0.35)', 'gray'])
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)
</script>

<style scoped>
.dv-border-box-6 {
  position: relative;
  width: 100%;
  height: 100%;
}
.border-svg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.border-svg-container polyline {
  fill: none;
  stroke-width: 1;
}
.border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>


