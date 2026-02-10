<template>
  <div style="overflow: hidden">
    <img :src="propValue.url" class="img" :style="imgStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OnEvent from '../common/OnEvent.vue'

const props = defineProps({
  propValue: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  element: {
    type: Object,
    default: () => ({}),
  },
})

const imgStyle = computed(() => {
  const h = props.propValue?.flip?.horizontal ? -1 : 1
  const v = props.propValue?.flip?.vertical ? -1 : 1
  return {
    transform: `scale(${h}, ${v})`,
    width: '100%',
    height: '100%',
  }
})
</script>

<style lang="scss" scoped>
.img {
  width: 100%;
  height: 100%;
}
</style>
