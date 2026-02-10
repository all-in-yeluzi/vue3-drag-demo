<template>
  <div class="rect-shape">
    <v-text :prop-value="element.propValue" :element="element" />
  </div>
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
.rect-shape {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
