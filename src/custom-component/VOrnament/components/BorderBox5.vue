<template>
  <div class="dv-border-box-5" style="overflow: visible">
    <svg :width="width" :height="height" class="border-svg-container" :class="{ 'dv-bb5-reverse': reverse }">
      <polygon
        :fill="backgroundColor"
        :points="`10, 22 ${width - 22}, 22 ${width - 22}, ${height - 86} ${width - 84}, ${height - 24} 10, ${height - 24}`"
      />
      <polyline
        class="dv-bb5-line-1"
        :stroke="colors[0]"
        :points="`8, 5 ${width - 5}, 5 ${width - 5}, ${height - 100} ${width - 100}, ${height - 5} 8, ${height - 5} 8, 5`"
      />
      <polyline
        class="dv-bb5-line-1"
        :stroke="colors[1]"
        :points="`3, 5 ${width - 20}, 5 ${width - 20}, ${height - 60} ${width - 74}, ${height - 5} 3, ${height - 5} 3, 5`"
      />
      <polyline
        class="dv-bb5-line-2"
        :stroke="colors[1]"
        :points="`50, 13 ${width - 35}, 13`"
      />
      <polyline
        class="dv-bb5-line-3"
        :stroke="colors[1]"
        :points="`15, 20 ${width - 35}, 20`"
      />
      <polyline
        class="dv-bb5-line-3"
        :stroke="colors[1]"
        :points="`15, ${height - 20} ${width - 110}, ${height - 20}`"
      />
      <polyline
        class="dv-bb5-line-3"
        :stroke="colors[1]"
        :points="`15, ${height - 13} ${width - 110}, ${height - 13}`"
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
    default: () => ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.20)'],
  },
  backgroundColor: {
    type: String,
    default: 'transparent',
  },
  reverse: {
    type: Boolean,
    default: false,
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
const colors = computed(() => color.value || ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.20)'])
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)
</script>

<style scoped>
.dv-border-box-5 {
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
.dv-bb5-reverse {
  transform: rotate(180deg);
}
.dv-bb5-line-1 {
  stroke-width: 1;
}
.dv-bb5-line-2 {
  stroke-width: 5;
}
.dv-bb5-line-3 {
  stroke-width: 2;
}
.border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>


