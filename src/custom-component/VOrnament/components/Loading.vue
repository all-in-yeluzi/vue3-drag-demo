<template>
  <div class="dv-loading">
    <svg :width="width" :height="height" viewBox="0 0 50 50">
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#8aaafb"
        stroke-width="5"
        stroke-dasharray="90, 150"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
    <div class="loading-tip">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 50,
  },
  height: {
    type: Number,
    default: 50,
  }
})

const { width, height } = toRefs(props)
</script>

<style scoped>
.dv-loading {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.loading-tip {
  margin-top: 10px;
  font-size: 14px;
  color: #8aaafb;
}
</style>
