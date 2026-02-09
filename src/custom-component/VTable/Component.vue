<template>
  <table class="v-table">
    <tbody>
      <tr
        v-for="(item, index) in propValue.data"
        :key="index"
        :class="{
          stripe: propValue.stripe && Number(index) % 2,
          bold: propValue.thBold && index === 0,
        }"
      >
        <td v-for="(e, i) in item" :key="i">{{ e }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import OnEvent from '../common/OnEvent.vue'

defineProps({
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
</script>

<style lang="scss" scoped>
.v-table {
  border-collapse: collapse;
  table-layout: fixed;
  word-break: break-all;
  word-wrap: break-word;
  width: 100%;
  height: 100%;

  td {
    border: 1px solid #ccc;
    height: 10px;
  }

  .stripe {
    background-color: #fafafa;
  }

  .bold {
    font-weight: bold;
  }
}
</style>
