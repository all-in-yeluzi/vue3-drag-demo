<template>
  <table class="v-table">
    <thead v-if="hasColumns">
      <tr>
        <th v-for="(col, index) in propValue.columns" :key="index" :class="{ bold: propValue.thBold }">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in propValue.data"
        :key="index"
        :class="{
          stripe: propValue.stripe && Number(index) % 2,
          bold: !hasColumns && propValue.thBold && index === 0,
        }"
      >
        <template v-if="hasColumns">
            <td v-for="(col, i) in propValue.columns" :key="i">{{ item[col.prop] }}</td>
        </template>
        <template v-else>
            <td v-for="(e, i) in item" :key="i">{{ e }}</td>
        </template>
      </tr>
    </tbody>
  </table>
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

const hasColumns = computed(() => {
  return props.propValue.columns && props.propValue.columns.length > 0
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

  td, th {
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
