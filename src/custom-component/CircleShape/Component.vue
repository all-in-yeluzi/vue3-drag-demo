<template>
  <div class="circle">
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
.circle {
  border-radius: 50%;
  overflow: hidden;
}
</style>
