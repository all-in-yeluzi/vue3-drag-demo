<template>
  <div class="dv-border-box-13" style="overflow: visible">
    <svg :width="width" :height="height" class="border-svg-container">
      <path
        :fill="backgroundColor"
        :stroke="colors[0]"
        stroke-width="2"
        :d="`
          M 5 20 L 5 10 L 12 3  L 60 3 L 68 10
          L ${width - 20} 10 L ${width - 5} 25
          L ${width - 5} ${height - 5} L 20 ${height - 5}
          L 5 ${height - 20} L 5 20
        `"
      />
      <path
        fill="transparent"
        stroke-width="3"
        stroke-linecap="round"
        stroke-dasharray="10, 5"
        :stroke="colors[0]"
        d="M 16 9 L 61 9"
      />
      <path
        fill="transparent"
        :stroke="colors[1]"
        d="M 5 20 L 5 10 L 12 3  L 60 3 L 68 10"
      />
      <path
        fill="transparent"
        :stroke="colors[1]"
        :d="`M ${width - 5} ${height - 30} L ${width - 5} ${height - 5} L ${width - 30} ${height - 5}`"
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
import { computed, toRefs, PropType } from 'vue'

const props = defineProps({
  color: {
    type: Array as PropType<string[]>,
    default: () => ['#6586ec', '#2cf7fe'],
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
const colors = computed(() => color.value || ['#6586ec', '#2cf7fe'])
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)
</script>

<style scoped>
.dv-border-box-13 {
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
