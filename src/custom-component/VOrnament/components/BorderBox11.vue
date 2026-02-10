<template>
  <div class="dv-border-box-11" style="overflow: visible">
    <svg :width="width" :height="height" class="border-svg-container" style="overflow: visible">
      <defs>
        <filter :id="filterId" height="150%" width="150%" x="-25%" y="-25%">
          <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="thicken" />
          <feGaussianBlur in="thicken" stdDeviation="3" result="blurred" />
          <feFlood :flood-color="colors[1]" result="glowColor" />
          <feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored" />
          <feMerge>
            <feMergeNode in="softGlowColored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <polygon
        :fill="backgroundColor"
        :points="`
          20, 32 ${width * 0.5 - titleWidth / 2 + xOffset}, ${32 + yOffset} ${width * 0.5 - titleWidth / 2 + 20 + xOffset}, ${53 + yOffset}
          ${width * 0.5 + titleWidth / 2 - 20 + xOffset}, ${53 + yOffset} ${width * 0.5 + titleWidth / 2 + xOffset}, ${32 + yOffset}
          ${width - 20}, 32 ${width - 8}, 48 ${width - 8}, ${height - 25} ${width - 20}, ${height - 8}
          20, ${height - 8} 8, ${height - 25} 8, 50
        `"
      />

      <polyline
        :stroke="colors[0]"
        :filter="`url(#${filterId})`"
        fill="none"
        stroke-width="1"
        :points="`
          ${(width - titleWidth) / 2 + xOffset}, ${30 + yOffset}
          20, 30 7, 50 7, ${50 + (height - 167) / 2}
          13, ${55 + (height - 167) / 2} 13, ${135 + (height - 167) / 2}
          7, ${140 + (height - 167) / 2} 7, ${height - 27}
          20, ${height - 7} ${width - 20}, ${height - 7} ${width - 7}, ${height - 27}
          ${width - 7}, ${140 + (height - 167) / 2} ${width - 13}, ${135 + (height - 167) / 2}
          ${width - 13}, ${55 + (height - 167) / 2} ${width - 7}, ${50 + (height - 167) / 2}
          ${width - 7}, 50 ${width - 20}, 30 ${(width + titleWidth) / 2 + xOffset}, ${30 + yOffset}
          ${(width + titleWidth) / 2 - 20 + xOffset}, ${7 + yOffset} ${(width - titleWidth) / 2 + 20 + xOffset}, ${7 + yOffset}
          ${(width - titleWidth) / 2 + xOffset}, ${30 + yOffset} ${(width - titleWidth) / 2 + 20 + xOffset}, ${52 + yOffset}
          ${(width + titleWidth) / 2 - 20 + xOffset}, ${52 + yOffset} ${(width + titleWidth) / 2 + xOffset}, ${30 + yOffset}
        `"
      />

      <polygon
        :stroke="colors[0]"
        fill="transparent"
        :points="`
          ${(width + titleWidth) / 2 - 5 + xOffset}, ${30 + yOffset} ${(width + titleWidth) / 2 - 21 + xOffset}, ${11 + yOffset}
          ${(width + titleWidth) / 2 - 27 + xOffset}, ${11 + yOffset} ${(width + titleWidth) / 2 - 8 + xOffset}, ${34 + yOffset}
        `"
      />

      <polygon
        :stroke="colors[0]"
        fill="transparent"
        :points="`
          ${(width - titleWidth) / 2 + 5 + xOffset}, ${30 + yOffset} ${(width - titleWidth) / 2 + 22 + xOffset}, ${49 + yOffset}
          ${(width - titleWidth) / 2 + 28 + xOffset}, ${49 + yOffset} ${(width - titleWidth) / 2 + 8 + xOffset}, ${26 + yOffset}
        `"
      />

      <polygon
        :stroke="colors[0]"
        :fill="fade(colors[1] || defaultColor[1], 30)"
        :filter="`url(#${filterId})`"
        :points="`
          ${(width + titleWidth) / 2 - 11 + xOffset}, ${37 + yOffset} ${(width + titleWidth) / 2 - 32 + xOffset}, ${11 + yOffset}
          ${(width - titleWidth) / 2 + 23 + xOffset}, ${11 + yOffset} ${(width - titleWidth) / 2 + 11 + xOffset}, ${23 + yOffset}
          ${(width - titleWidth) / 2 + 33 + xOffset}, ${49 + yOffset} ${(width + titleWidth) / 2 - 22 + xOffset}, ${49 + yOffset}
        `"
      />

      <polygon
        :filter="`url(#${filterId})`"
        :fill="colors[0]"
        opacity="1"
        :points="`
          ${(width - titleWidth) / 2 - 10 + xOffset}, ${37 + yOffset} ${(width - titleWidth) / 2 - 31 + xOffset}, ${37 + yOffset}
          ${(width - titleWidth) / 2 - 25 + xOffset}, ${46 + yOffset} ${(width - titleWidth) / 2 - 4 + xOffset}, ${46 + yOffset}
        `"
      >
        <animate
          attributeName="opacity"
          values="1;0.7;1"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <polygon
        :filter="`url(#${filterId})`"
        :fill="colors[0]"
        opacity="0.7"
        :points="`
          ${(width - titleWidth) / 2 - 40 + xOffset}, ${37 + yOffset} ${(width - titleWidth) / 2 - 61 + xOffset}, ${37 + yOffset}
          ${(width - titleWidth) / 2 - 55 + xOffset}, ${46 + yOffset} ${(width - titleWidth) / 2 - 34 + xOffset}, ${46 + yOffset}
        `"
      >
        <animate
          attributeName="opacity"
          values="0.7;0.4;0.7"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <polygon
        :filter="`url(#${filterId})`"
        :fill="colors[0]"
        opacity="0.5"
        :points="`
          ${(width - titleWidth) / 2 - 70 + xOffset}, ${37 + yOffset} ${(width - titleWidth) / 2 - 91 + xOffset}, ${37 + yOffset}
          ${(width - titleWidth) / 2 - 85 + xOffset}, ${46 + yOffset} ${(width - titleWidth) / 2 - 64 + xOffset}, ${46 + yOffset}
        `"
      >
        <animate
          attributeName="opacity"
          values="0.5;0.2;0.5"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <polygon
        :filter="`url(#${filterId})`"
        :fill="colors[0]"
        opacity="1"
        :points="`
          ${(width + titleWidth) / 2 + 30 + xOffset}, ${37 + yOffset} ${(width + titleWidth) / 2 + 9 + xOffset}, ${37 + yOffset}
          ${(width + titleWidth) / 2 + 3 + xOffset}, ${46 + yOffset} ${(width + titleWidth) / 2 + 24 + xOffset}, ${46 + yOffset}
        `"
      >
        <animate
          attributeName="opacity"
          values="1;0.7;1"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <polygon
        :filter="`url(#${filterId})`"
        :fill="colors[0]"
        opacity="0.7"
        :points="`
          ${(width + titleWidth) / 2 + 60 + xOffset}, ${37 + yOffset} ${(width + titleWidth) / 2 + 39 + xOffset}, ${37 + yOffset}
          ${(width + titleWidth) / 2 + 33 + xOffset}, ${46 + yOffset} ${(width + titleWidth) / 2 + 54 + xOffset}, ${46 + yOffset}
        `"
      >
        <animate
          attributeName="opacity"
          values="0.7;0.4;0.7"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <polygon
        :filter="`url(#${filterId})`"
        :fill="colors[0]"
        opacity="0.5"
        :points="`
          ${(width + titleWidth) / 2 + 90 + xOffset}, ${37 + yOffset} ${(width + titleWidth) / 2 + 69 + xOffset}, ${37 + yOffset}
          ${(width + titleWidth) / 2 + 63 + xOffset}, ${46 + yOffset} ${(width + titleWidth) / 2 + 84 + xOffset}, ${46 + yOffset}
        `"
      >
        <animate
          attributeName="opacity"
          values="0.5;0.2;0.5"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>
      <text
        class="dv-border-box-11-title"
        :x="width / 2 + xOffset"
        :y="32 + yOffset"
        :fill="titleColor || '#fff'"
        :font-size="titleFontSize"
        :font-weight="titleFontWeight"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ title }}
      </text>

      <polygon
        :fill="colors[0]"
        :filter="`url(#${filterId})`"
        :points="`
          7, ${53 + (height - 167) / 2} 11, ${57 + (height - 167) / 2}
          11, ${133 + (height - 167) / 2} 7, ${137 + (height - 167) / 2}
        `"
      />

      <polygon
        :fill="colors[0]"
        :filter="`url(#${filterId})`"
        :points="`
          ${width - 7}, ${53 + (height - 167) / 2} ${width - 11}, ${57 + (height - 167) / 2}
          ${width - 11}, ${133 + (height - 167) / 2} ${width - 7}, ${137 + (height - 167) / 2}
        `"
      />
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
    default: () => ['#8aaafb', '#1f33a2'],
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
  titleWidth: {
    type: Number,
    default: 250,
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
const defaultColor = ['#8aaafb', '#1f33a2']
const colors = computed(() => color.value || defaultColor)
const xOffset = computed(() => (props.titleOffset && props.titleOffset[0]) || 0)
const yOffset = computed(() => (props.titleOffset && props.titleOffset[1]) || 0)

const filterId = `border-box-11-filter-${Math.random().toString(36).substring(2, 9)}`

const fade = (color: string, opacity: number) => {
  if (!color) return ''
  // Hex to RGBA
  let r = 0, g = 0, b = 0
  if (color.startsWith('#')) {
    if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16)
      g = parseInt(color[2] + color[2], 16)
      b = parseInt(color[3] + color[3], 16)
    } else if (color.length === 7) {
      r = parseInt(color.slice(1, 3), 16)
      g = parseInt(color.slice(3, 5), 16)
      b = parseInt(color.slice(5, 7), 16)
    }
  } else if (color.startsWith('rgb')) {
    const parts = color.match(/\d+/g)
    if (parts) {
      r = parseInt(parts[0])
      g = parseInt(parts[1])
      b = parseInt(parts[2])
    }
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}
</script>

<style scoped>
.dv-border-box-11 {
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
