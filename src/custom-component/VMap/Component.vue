<template>
  <div style="min-height: 300px; min-width: 300px">
    <v-chart
      v-if="isMapLoaded"
      ref="vChartRef"
      class="chart"
      :option="option"
      autoresize
    />
    <div v-else style="display: flex; justify-content: center; align-items: center; height: 100%; color: #ccc;">
       地图加载中...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import VChart from 'vue-echarts'
import { use, registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { MapChart, ScatterChart, EffectScatterChart, HeatmapChart, BarChart, LinesChart } from 'echarts/charts'
import {
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  GridComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  MapChart,
  ScatterChart,
  EffectScatterChart,
  HeatmapChart,
  BarChart,
  LinesChart,
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  GridComponent,
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
const option = ref(props.propValue.option)
const isMapLoaded = ref(false)

// 深度监听 propValue 的变化
watch(
  () => props.propValue,
  (newValue) => {
    option.value = newValue.option
  },
  { deep: true },
)

onMounted(async () => {
  try {
      // 注册中国地图
      // 使用 DataV.GeoAtlas 的数据
      const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      const geoJson = await response.json()
      registerMap('china', geoJson)
      isMapLoaded.value = true
  } catch (error) {
      console.error('Failed to load map data:', error)
      // 即使加载失败也显示图表（可能不显示地图但显示其他组件）
      isMapLoaded.value = true
  }
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
