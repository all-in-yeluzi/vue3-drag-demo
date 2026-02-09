<template>
  <div class="group">
    <div>
      <component
        :is="item.component"
        v-for="item in propValue"
        :id="'component' + item.id"
        :key="item.id"
        class="component"
        :style="item.groupStyle"
        :prop-value="item.propValue"
        :element="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
  propValue: {
    type: Array as any,
    default: () => [],
  },
  element: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style lang="scss" scoped>
.group {
  & > div {
    position: relative;
    width: 100%;
    height: 100%;

    .component {
      position: absolute;
    }
  }
}
</style>
