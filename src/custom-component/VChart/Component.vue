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

// 深度监听 propValue 的变化，包括 option 和 data/mapper
watch(
  () => props.propValue,
  (newValue) => {
    // 优先处理动态数据绑定
    if (newValue.data && Array.isArray(newValue.data) && newValue.data.length > 0 && newValue.mapper) {
      updateChartWithData(newValue.data, newValue.mapper)
    } else {
      // 回退到静态配置
      option.value = newValue.option
    }
  },
  { deep: true },
)

const updateChartWithData = (data: any[], mapper: any) => {
  if (!mapper.x || !mapper.y) return // 必须配置 x 和 y 轴字段

  const newOption = JSON.parse(JSON.stringify(props.propValue.option))
  
  // 简单情况：单系列
  if (!mapper.s) {
     const xAxisData = data.map(item => item[mapper.x])
     const seriesData = data.map(item => item[mapper.y])
     
     if (newOption.xAxis) {
       newOption.xAxis.data = xAxisData
     }
     
     // 假设第一个系列是我们要填充的
     if (newOption.series && newOption.series.length > 0) {
       newOption.series[0].data = seriesData
       if (mapper.seriesName) {
         newOption.series[0].name = mapper.seriesName
       }
     } else if (newOption.series && !Array.isArray(newOption.series)) {
        newOption.series.data = seriesData
        if (mapper.seriesName) {
          newOption.series.name = mapper.seriesName
        }
     }
  } else {
    // 复杂情况：多系列分组 (s 字段作为分组依据)
    // 1. 提取所有 x 轴类目 (去重排序)
    const xAxisData = Array.from(new Set(data.map(item => item[mapper.x])))
    
    // 2. 提取所有系列名
    const seriesNames = Array.from(new Set(data.map(item => item[mapper.s])))
    
    // 3. 构建系列数据
    const newSeries = seriesNames.map(name => {
      // 找到该系列的所有数据点
      const seriesItems = data.filter(item => item[mapper.s] === name)
      // 按照 x 轴顺序填充数据，缺失的补 0 或 null
      const seriesData = xAxisData.map(xVal => {
        const item = seriesItems.find(i => i[mapper.x] === xVal)
        return item ? item[mapper.y] : 0
      })
      
      // 复制原有第一个系列的样式配置
      const baseSeries = Array.isArray(props.propValue.option.series) 
        ? props.propValue.option.series[0] 
        : props.propValue.option.series
        
      return {
        ...baseSeries,
        name: name,
        data: seriesData
      }
    })
    
    if (newOption.xAxis) {
      newOption.xAxis.data = xAxisData
    }
    newOption.series = newSeries
    
    // 更新图例
    if (newOption.legend) {
      newOption.legend.data = seriesNames
    }
  }
  
  option.value = newOption
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
