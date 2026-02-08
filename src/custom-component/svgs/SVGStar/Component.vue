<template>
  <div class="svg-star-container">
    <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
      <polygon
        ref="star"
        :points="points"
        :fill="element.style.backgroundColor"
        :stroke="element.style.borderColor"
        :stroke-width="element.style.borderWidth || 1"
      />
    </svg>
    <VText :prop-value="element.propValue" :element="element" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{ propValue: string; element: any }>()
const points = ref('')

const draw = () => {
  const { width, height } = props.element.style
  const ratios = [
    [0.5, 0],
    [0.625, 0.375],
    [1, 0.375],
    [0.75, 0.625],
    [0.875, 1],
    [0.5, 0.75],
    [0.125, 1],
    [0.25, 0.625],
    [0, 0.375],
    [0.375, 0.375],
  ]
  points.value = ratios.map(([x, y]) => `${width * x} ${height * y}`).toString()
}

onMounted(draw)
watch(
  () => [props.element.style.width, props.element.style.height],
  () => draw(),
)
</script>

<style lang="scss" scoped>
.svg-star-container {
  width: 100%;
  height: 100%;
  position: relative;
}

svg {
  width: 100%;
  height: 100%;
}

.v-text {
  position: absolute;
  top: 58%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 40%;
}
</style>
