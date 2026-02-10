<template>
  <div class="dv-border-box-9" style="overflow: visible">
    <svg :width="width" :height="height" class="border-svg-container">
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
          <animate attributeName="x1" values="0%;100%;0%" dur="10s" begin="0s" repeatCount="indefinite" />
          <animate attributeName="x2" values="100%;0%;100%" dur="10s" begin="0s" repeatCount="indefinite" />
          <stop offset="0%" :stop-color="colors[0]">
            <animate attributeName="stop-color" :values="`${colors[0]};${colors[1]};${colors[0]}`" dur="10s" begin="0s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" :stop-color="colors[1]">
            <animate attributeName="stop-color" :values="`${colors[1]};${colors[0]};${colors[1]}`" dur="10s" begin="0s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <mask :id="maskId">
          <polyline
            stroke="#fff"
            stroke-width="3"
            fill="transparent"
            :points="`8, ${height * 0.4} 8, 3, ${width * 0.4 + 7}, 3`"
          />
          <polyline
            fill="#fff"
            :points="`
              8, ${height * 0.15} 8, 3, ${width * 0.1 + 7}, 3
              ${width * 0.1}, 8 14, 8 14, ${height * 0.15 - 7}
            `"
          />
          <polyline
            stroke="#fff"
            stroke-width="3"
            fill="transparent"
            :points="`${width * 0.5}, 3 ${width - 3}, 3, ${width - 3}, ${height * 0.25}`"
          />
          <polyline
            fill="#fff"
            :points="`
              ${width * 0.52}, 3 ${width * 0.58}, 3
              ${width * 0.58 - 7}, 9 ${width * 0.52 + 7}, 9
            `"
          />
          <polyline
            fill="#fff"
            :points="`
              ${width * 0.9}, 3 ${width - 3}, 3 ${width - 3}, ${height * 0.1}
              ${width - 9}, ${height * 0.1 - 7} ${width - 9}, 9 ${width * 0.9 + 7}, 9
            `"
          />
          <polyline
            stroke="#fff"
            stroke-width="3"
            fill="transparent"
            :points="`8, ${height * 0.5} 8, ${height - 3} ${width * 0.3 + 7}, ${height - 3}`"
          />
          <polyline
            fill="#fff"
            :points="`
              8, ${height * 0.55} 8, ${height * 0.7}
              2, ${height * 0.7 - 7} 2, ${height * 0.55 + 7}
            `"
          />
          <polyline
            stroke="#fff"
            stroke-width="3"
            fill="transparent"
            :points="`${width * 0.35}, ${height - 3} ${width - 3}, ${height - 3} ${width - 3}, ${height * 0.35}`"
          />
          <polyline
            fill="#fff"
            :points="`
              ${width * 0.92}, ${height - 3} ${width - 3}, ${height - 3} ${width - 3}, ${height * 0.8}
              ${width - 9}, ${height * 0.8 + 7} ${width - 9}, ${height - 9} ${width * 0.92 + 7}, ${height - 9}
            `"
          />
        </mask>
      </defs>
      <polygon
        :fill="backgroundColor"
        :points="`
          15, 9 ${width * 0.1 + 1}, 9 ${width * 0.1 + 4}, 6 ${width * 0.52 + 2}, 6
          ${width * 0.52 + 6}, 10 ${width * 0.58 - 7}, 10 ${width * 0.58 - 2}, 6
          ${width * 0.9 + 2}, 6 ${width * 0.9 + 6}, 10 ${width - 10}, 10 ${width - 10}, ${height * 0.1 - 6}
          ${width - 6}, ${height * 0.1 - 1} ${width - 6}, ${height * 0.8 + 1} ${width - 10}, ${height * 0.8 + 6}
          ${width - 10}, ${height - 10} ${width * 0.92 + 7}, ${height - 10}  ${width * 0.92 + 2}, ${height - 6}
          11, ${height - 6} 11, ${height * 0.15 - 2} 15, ${height * 0.15 - 7}
        `"
      />
      <rect
        x="0"
        y="0"
        :width="width"
        :height="height"
        :fill="`url(#${gradientId})`"
        :mask="`url(#${maskId})`"
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
    default: () => ['#11eefd', '#0078d2'],
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
const colors = computed(() => color.value || ['#11eefd', '#0078d2'])
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)
const id = Math.random().toString(36).substring(2, 9)
const gradientId = `border-box-9-gradient-${id}`
const maskId = `border-box-9-mask-${id}`
</script>

<style scoped>
.dv-border-box-9 {
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
