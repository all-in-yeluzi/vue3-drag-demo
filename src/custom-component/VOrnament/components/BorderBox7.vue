<template>
  <div class="dv-border-box-7" :style="`box-shadow: inset 0 0 40px ${colors[0]}; border: 1px solid ${colors[0]}; background-color: ${backgroundColor}`" style="overflow: visible">
    <svg :width="width" :height="height" class="border-svg-container">
      <polyline
        class="dv-bb7-line-width2"
        :stroke="colors[0]"
        :points="`0, 25 0, 0 25, 0`"
      />
      <polyline
        class="dv-bb7-line-width2"
        :stroke="colors[0]"
        :points="`${width - 25}, 0 ${width}, 0 ${width}, 25`"
      />
      <polyline
        class="dv-bb7-line-width2"
        :stroke="colors[0]"
        :points="`${width - 25}, ${height} ${width}, ${height} ${width}, ${height - 25}`"
      />
      <polyline
        class="dv-bb7-line-width2"
        :stroke="colors[0]"
        :points="`0, ${height - 25} 0, ${height} 25, ${height}`"
      />
      <polyline
        class="dv-bb7-line-width5"
        :stroke="colors[1]"
        :points="`0, 10 0, 0 10, 0`"
      />
      <polyline
        class="dv-bb7-line-width5"
        :stroke="colors[1]"
        :points="`${width - 10}, 0 ${width}, 0 ${width}, 10`"
      />
      <polyline
        class="dv-bb7-line-width5"
        :stroke="colors[1]"
        :points="`${width - 10}, ${height} ${width}, ${height} ${width}, ${height - 10}`"
      />
      <polyline
        class="dv-bb7-line-width5"
        :stroke="colors[1]"
        :points="`0, ${height - 10} 0, ${height} 10, ${height}`"
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
    default: () => ['rgba(128, 128, 128, 0.3)', 'rgba(128, 128, 128, 0.5)'],
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
const colors = computed(() => color.value || ['rgba(128, 128, 128, 0.3)', 'rgba(128, 128, 128, 0.5)'])
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)
</script>

<style scoped>
.dv-border-box-7 {
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
  stroke-linecap: round;
}
.dv-bb7-line-width2 {
  stroke-width: 2;
}
.dv-bb7-line-width5 {
  stroke-width: 5;
}
.border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>


