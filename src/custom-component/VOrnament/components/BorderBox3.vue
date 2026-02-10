<template>
  <div class="dv-border-box-3" style="overflow: visible">
    <svg :width="width" :height="height" class="border-svg-container">
      <polygon
        :fill="backgroundColor"
        :points="`
          23, 23 
          ${width - 24}, 23 
          ${width - 24}, ${height - 24} 
          23, ${height - 24}
        `"
      />
      <polyline
        class="dv-bb3-line1"
        :stroke="colors[0]"
        :points="`4, 4 ${width - 22} ,4 ${width - 22}, ${height - 22} 4, ${height - 22} 4, 4`"
      />
      <polyline
        class="dv-bb3-line2"
        :stroke="colors[1]"
        :points="`10, 10 ${width - 16}, 10 ${width - 16}, ${height - 16} 10, ${height - 16} 10, 10`"
      >
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
      </polyline>
      <polyline
        class="dv-bb3-line2"
        :stroke="colors[1]"
        :points="`16, 16 ${width - 10}, 16 ${width - 10}, ${height - 10} 16, ${height - 10} 16, 16`"
      >
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
      </polyline>
      <polyline
        class="dv-bb3-line2"
        :stroke="colors[1]"
        :points="`22, 22 ${width - 4}, 22 ${width - 4}, ${height - 4} 22, ${height - 4} 22, 22`"
      >
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
      </polyline>
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
    default: () => ['#2862b7', '#2862b7'],
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
const colors = computed(() => color.value || ['#2862b7', '#2862b7'])
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)
</script>

<style scoped>
.dv-border-box-3 {
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
}
.dv-bb3-line1 {
  stroke-width: 3;
}
.dv-bb3-line2 {
  stroke-width: 1;
}
.border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
