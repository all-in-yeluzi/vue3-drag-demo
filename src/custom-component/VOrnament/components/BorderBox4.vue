<template>
  <div class="dv-border-box-4" style="overflow: visible">
    <svg :width="width" :height="height" class="border-svg-container" :class="{ 'dv-bb4-reverse': reverse }">
      <polygon
        :fill="backgroundColor"
        :points="`${width - 15}, 22 170, 22 150, 7 40, 7 28, 21 32, 24
        16, 42 16, ${height - 32} 41, ${height - 7} ${width - 15}, ${height - 7}`"
      />
      <polyline
        class="dv-bb4-line-1"
        :stroke="colors[0]"
        :points="`145, ${height - 5} 40, ${height - 5} 10, ${height - 35} 10, 40 40, 5 150, 5 170, 20 ${width - 15}, 20`"
      />
      <polyline
        class="dv-bb4-line-2"
        :stroke="colors[1]"
        :points="`245, ${height - 1} 36, ${height - 1} 14, ${height - 23} 14, ${height - 100}`"
      />
      <polyline
        class="dv-bb4-line-3"
        :stroke="colors[0]"
        :points="`7, ${height - 40} 7, ${height - 75}`"
      />
      <polyline
        class="dv-bb4-line-3"
        :stroke="colors[0]"
        :points="`28, 24 13, 41 13, 64`"
      />
      <polyline
        class="dv-bb4-line-2"
        :stroke="colors[0]"
        :points="`5, 45 5, 140`"
      />
      <polyline
        class="dv-bb4-line-2"
        :stroke="colors[1]"
        :points="`14, 75 14, 180`"
      />
      <polyline
        class="dv-bb4-line-2"
        :stroke="colors[1]"
        :points="`55, 11 147, 11 167, 26 250, 26`"
      />
      <polyline
        class="dv-bb4-line-3"
        :stroke="colors[1]"
        :points="`158, 5 173, 16`"
      />
      <polyline
        class="dv-bb4-line-3"
        :stroke="colors[0]"
        stroke-dasharray="100, 250"
        :points="`200, 17 ${width - 10}, 17`"
      />
      <polyline
        class="dv-bb4-line-2"
        :stroke="colors[1]"
        stroke-dasharray="80, 270"
        :points="`385, 17 ${width - 10}, 17`"
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
    default: () => ['red', 'rgba(0,0,255,0.8)'],
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
const colors = computed(() => color.value || ['red', 'rgba(0,0,255,0.8)'])
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)
</script>

<style scoped>
.dv-border-box-4 {
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
.dv-bb4-reverse {
  transform: rotate(180deg);
}
.dv-bb4-line-1 {
  stroke-width: 1;
}
.dv-bb4-line-2 {
  stroke-width: 1;
}
.dv-bb4-line-3 {
  stroke-width: 3;
  stroke-linecap: round;
}
.border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
