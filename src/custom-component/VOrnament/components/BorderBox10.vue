<template>
  <div class="dv-border-box-10" :style="`box-shadow: inset 0 0 25px 3px ${colors[0]}`" style="overflow: visible">
    <svg :width="width" :height="height" class="border-svg-container">
      <polygon
        :fill="backgroundColor"
        :points="`
          4, 0 ${width - 4}, 0 ${width}, 4 ${width}, ${height - 4} ${width - 4}, ${height}
          4, ${height} 0, ${height - 4} 0, 4
        `"
      />
      <!-- Top Left -->
      <polygon
        :fill="colors[1]"
        points="40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3"
      />
      <!-- Top Right -->
      <polygon
        :fill="colors[1]"
        :points="`
          ${width - 40}, 0 ${width - 5}, 0 ${width}, 5 ${width}, 16 ${width - 3}, 19
          ${width - 3}, 7 ${width - 7}, 3 ${width - 35}, 3
        `"
      />
      <!-- Bottom Right -->
      <polygon
        :fill="colors[1]"
        :points="`
          ${width - 40}, ${height} ${width - 5}, ${height} ${width}, ${height - 5} ${width}, ${height - 16}
          ${width - 3}, ${height - 19} ${width - 3}, ${height - 7} ${width - 7}, ${height - 3} ${width - 35}, ${height - 3}
        `"
      />
      <!-- Bottom Left -->
      <polygon
        :fill="colors[1]"
        :points="`
          40, ${height} 5, ${height} 0, ${height - 5} 0, ${height - 16}
          3, ${height - 19} 3, ${height - 7} 7, ${height - 3} 35, ${height - 3}
        `"
      />
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
    default: () => ['#1d48c4', '#d3e1f8'],
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
const colors = computed(() => color.value || ['#1d48c4', '#d3e1f8'])
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)
</script>

<style scoped>
.dv-border-box-10 {
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
.border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
