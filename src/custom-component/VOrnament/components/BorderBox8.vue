<template>
  <div class="dv-border-box-8" style="overflow: visible">
    <svg :width="width" :height="height" class="border-svg-container">
      <defs>
        <path
          :id="pathId"
          :d="pathD"
          fill="transparent"
        />
        <radialGradient :id="gradientId" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity="1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
        <mask :id="maskId">
          <circle cx="0" cy="0" r="150" :fill="`url(#${gradientId})`">
            <animateMotion
              :dur="`${dur}s`"
              :path="pathD"
              rotate="auto"
              repeatCount="indefinite"
            />
          </circle>
        </mask>
      </defs>

      <polygon
        :fill="backgroundColor"
        :points="`5, 5 ${width - 5}, 5 ${width - 5} ${height - 5} 5, ${height - 5}`"
      />

      <use
        :stroke="colors[0]"
        stroke-width="1"
        :xlink:href="`#${pathId}`"
      />

      <use
        :stroke="colors[1]"
        stroke-width="3"
        :xlink:href="`#${pathId}`"
        :mask="`url(#${maskId})`"
      >
        <animate
          attributeName="stroke-dasharray"
          :from="`0, ${length}`"
          :to="`${length}, 0`"
          :dur="`${dur}s`"
          repeatCount="indefinite"
        />
      </use>
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
import { computed, toRefs, ref, watchEffect, type PropType } from 'vue'

const props = defineProps({
  color: {
    type: Array as PropType<string[]>,
    default: () => ['#235fa7', '#4fd2dd'],
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
  dur: {
    type: Number,
    default: 3,
  },
  reverse: {
    type: Boolean,
    default: false,
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

const { color, width, height, reverse } = toRefs(props)
const colors = computed(() => color.value || ['#235fa7', '#4fd2dd'])
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)

const pathId = `border-box-8-path-${Math.random().toString(36).substring(2, 9)}`
const gradientId = `border-box-8-gradient-${Math.random().toString(36).substring(2, 9)}`
const maskId = `border-box-8-mask-${Math.random().toString(36).substring(2, 9)}`

const pathD = computed(() => {
  if (reverse.value) {
    return `M 2.5, 2.5 L 2.5, ${height.value - 2.5} L ${width.value - 2.5}, ${height.value - 2.5} L ${width.value - 2.5}, 2.5 L 2.5, 2.5`
  }
  return `M 2.5, 2.5 L ${width.value - 2.5}, 2.5 L ${width.value - 2.5}, ${height.value - 2.5} L 2.5, ${height.value - 2.5} L 2.5, 2.5`
})

const length = computed(() => {
  return (width.value + height.value - 5) * 2
})
</script>

<style scoped>
.dv-border-box-8 {
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
