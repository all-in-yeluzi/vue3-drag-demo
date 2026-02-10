<template>
  <div style="min-height: 300px; min-width: 300px">
    <v-chart
      ref="vChartRef"
      class="chart"
      :option="option"
      autoresize
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
} from 'echarts/components'
import OnEvent from '../common/OnEvent.vue'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
])

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

const vChartRef = ref<any>(null)
let option = ref(props.propValue.option)

watch(
  () => props.propValue.option,
  (newValue) => {
    option.value = newValue
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
