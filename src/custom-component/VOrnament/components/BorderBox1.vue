<template>
  <div class="dv-border-box-1" style="overflow: visible">
    <svg :width="width" :height="height" class="border">
      <polygon
        :fill="backgroundColor"
        :points="`10, 27 10, ${height - 27} 13, ${height - 24} 13, ${height - 21} 24, ${height - 11}
        38, ${height - 11} 41, ${height - 8} 73, ${height - 8} 75, ${height - 10} 81, ${height - 10}
        85, ${height - 6} ${width - 85}, ${height - 6} ${width - 81}, ${height - 10} ${width - 75}, ${height - 10}
        ${width - 73}, ${height - 8} ${width - 41}, ${height - 8} ${width - 38}, ${height - 11}
        ${width - 24}, ${height - 11} ${width - 13}, ${height - 21} ${width - 13}, ${height - 24}
        ${width - 10}, ${height - 27} ${width - 10}, 27 ${width - 13}, 25 ${width - 13}, 21
        ${width - 24}, 11 ${width - 38}, 11 ${width - 41}, 8 ${width - 73}, 8 ${width - 75}, 10
        ${width - 81}, 10 ${width - 85}, 6 85, 6 81, 10 75, 10 73, 8 41, 8 38, 11 24, 11 13, 21 13, 24`"
      />
    </svg>

    <svg
      width="150px"
      height="150px"
      :key="item"
      v-for="item in borderClasses"
      :class="`${item} border`"
    >
      <polygon
        :fill="colors[0]"
        points="6,66 6,18 12,12 18,12 24,6 27,6 30,9 36,9 39,6 84,6 81,9 75,9 73.2,7 40.8,7 37.8,10.2 24,10.2 12,21 12,24 9,27 9,51 7.8,54 7.8,63"
      >
        <animate
          attributeName="fill"
          :values="`${colors[0]};${colors[1]};${colors[0]}`"
          dur="0.5s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>
      <polygon
        :fill="colors[1]"
        points="27.6,4.8 38.4,4.8 35.4,7.8 30.6,7.8"
      >
        <animate
          attributeName="fill"
          :values="`${colors[1]};${colors[0]};${colors[1]}`"
          dur="0.5s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>
      <polygon
        :fill="colors[0]"
        points="9,54 9,63 7.2,66 7.2,75 7.8,78 7.8,110 8.4,110 8.4,66 9.6,66 9.6,54"
      >
        <animate
          attributeName="fill"
          :values="`${colors[0]};${colors[1]};transparent`"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>
    </svg>

    <svg class="border" :width="width" :height="height" style="pointer-events: none; overflow: visible">
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
import { computed, toRefs } from 'vue'

const props = withDefaults(defineProps<{
  color?: string[]
  backgroundColor?: string
  width?: number
  height?: number
  title?: string
  titleOffset?: number[]
  titleFontSize?: number
  titleColor?: string
  titleFontWeight?: string
}>(), {
  color: () => ['#4fd2dd', '#235fa7'],
  backgroundColor: 'transparent',
  width: 0,
  height: 0,
  title: '',
  titleOffset: () => [0, 0],
  titleFontSize: 18,
  titleColor: '',
  titleFontWeight: 'normal',
})

const { color } = toRefs(props)
const borderClasses = computed(() => {
  return ['left-top', 'right-top', 'left-bottom', 'right-bottom']
})
const colors = computed(() => color.value || ['#4fd2dd', '#235fa7'])
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)
</script>

<style scoped>
.dv-border-box-1 {
  position: relative;
  width: 100%;
  height: 100%;
}
.border {
  position: absolute;
  display: block;
}
.right-top {
  right: 0px;
  transform: rotateY(180deg);
}
.left-bottom {
  bottom: 0px;
  transform: rotateX(180deg);
}
.right-bottom {
  right: 0px;
  bottom: 0px;
  transform: rotateX(180deg) rotateY(180deg);
}
.border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
