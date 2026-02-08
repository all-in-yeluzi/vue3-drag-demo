<template>
  <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
    <polygon
      :points="points"
      :fill="element.style.backgroundColor"
      :stroke="element.style.borderColor"
      :stroke-width="element.style.borderWidth || 1"
    />
  </svg>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  propValue: {
    type: String,
    required: true,
    default: '',
  },
  element: {
    type: Object,
    default: () => ({}),
  },
})

const points = ref('')
const draw = () => {
  const { width, height } = (props as any).element.style
  const ratios = [
    [0.5, 0.05],
    [1, 0.95],
    [0, 0.95],
  ]
  points.value = ratios.map(([x, y]) => `${width * x} ${height * y}`).toString()
}

onMounted(draw)
watch(
  () => [(props as any).element.style.width, (props as any).element.style.height],
  () => draw(),
)
</script>

<style lang="scss" scoped>
svg {
  width: 100%;
  height: 100%;
}
</style>
