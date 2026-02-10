<template>
  <div class="line-shape"></div>
</template>

<script setup lang="ts">
import OnEvent from '../common/OnEvent.vue'

defineProps({
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
</script>

<style lang="scss" scoped>
.line-shape {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
