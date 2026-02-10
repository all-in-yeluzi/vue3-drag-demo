<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form v-if="curComponent">
      <el-form-item label="标题" v-if="option.title">
        <el-switch v-model="option.title.show" active-text="显示标题"></el-switch>
        <el-input v-model="option.title.text" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="工具提示" v-if="option.tooltip">
        <el-switch v-model="option.tooltip.show" active-text="显示提示"></el-switch>
      </el-form-item>
      <el-form-item label="图例" v-if="option.legend">
        <el-switch v-model="option.legend.show" active-text="显示图例"></el-switch>
      </el-form-item>
      
      <!-- 动态数据映射配置 -->
      <el-form-item label="数据绑定(动态)">
        <div style="background: #f5f7fa; padding: 10px; border-radius: 4px; width: 100%">
          <el-alert title="仅对动态数据生效" type="warning" :closable="false" style="margin-bottom: 10px; padding: 5px"></el-alert>
          <div style="margin-bottom: 5px">
            <span style="font-size: 12px; color: #666">X轴/类目轴字段:</span>
            <el-input v-model="curComponent.propValue.mapper.x" placeholder="例如: date" size="small"></el-input>
          </div>
          <div style="margin-bottom: 5px">
             <span style="font-size: 12px; color: #666">Y轴/数值字段:</span>
             <el-input v-model="curComponent.propValue.mapper.y" placeholder="例如: value" size="small"></el-input>
          </div>
          <div style="margin-bottom: 5px">
             <span style="font-size: 12px; color: #666">系列名称(单系列有效):</span>
             <el-input v-model="curComponent.propValue.mapper.seriesName" placeholder="例如: 设备数量" size="small"></el-input>
          </div>
          <div>
             <span style="font-size: 12px; color: #666">系列分组字段(选填):</span>
             <el-input v-model="curComponent.propValue.mapper.s" placeholder="例如: type" size="small"></el-input>
          </div>
        </div>
      </el-form-item>

      <el-collapse v-model="activeNames">
        <el-collapse-item title="X轴设置" name="xAxis" v-if="option.xAxis">
          <el-form-item label="显示X轴">
             <el-switch v-model="option.xAxis.show"></el-switch>
          </el-form-item>
          <template v-if="option.xAxis.show">
            <el-form-item label="轴名称">
              <el-input v-model="option.xAxis.name" placeholder="请输入轴名称"></el-input>
            </el-form-item>
            <el-form-item label="名称样式" v-if="option.xAxis.nameTextStyle">
               <el-color-picker v-model="option.xAxis.nameTextStyle.color" show-alpha></el-color-picker>
               <el-input-number v-model="option.xAxis.nameTextStyle.fontSize" :min="10" :max="30" controls-position="right" style="width: 100px; margin-left: 10px"></el-input-number>
            </el-form-item>
            <el-form-item label="标签颜色" v-if="option.xAxis.axisLabel">
               <el-color-picker v-model="option.xAxis.axisLabel.color" show-alpha></el-color-picker>
            </el-form-item>
             <el-form-item label="标签大小" v-if="option.xAxis.axisLabel">
               <el-input-number v-model="option.xAxis.axisLabel.fontSize" :min="10" :max="30" controls-position="right"></el-input-number>
            </el-form-item>
            <el-form-item label="标签角度" v-if="option.xAxis.axisLabel">
               <el-slider v-model="option.xAxis.axisLabel.rotate" :min="-90" :max="90"></el-slider>
            </el-form-item>
             <el-form-item label="轴线颜色" v-if="option.xAxis.axisLine && option.xAxis.axisLine.lineStyle">
               <el-color-picker v-model="option.xAxis.axisLine.lineStyle.color" show-alpha></el-color-picker>
            </el-form-item>
          </template>
        </el-collapse-item>

        <el-collapse-item title="Y轴设置" name="yAxis" v-if="option.yAxis">
           <el-form-item label="显示Y轴">
             <el-switch v-model="option.yAxis.show"></el-switch>
          </el-form-item>
          <template v-if="option.yAxis.show">
            <el-form-item label="轴名称">
              <el-input v-model="option.yAxis.name" placeholder="请输入轴名称"></el-input>
            </el-form-item>
             <el-form-item label="名称样式" v-if="option.yAxis.nameTextStyle">
               <el-color-picker v-model="option.yAxis.nameTextStyle.color" show-alpha></el-color-picker>
               <el-input-number v-model="option.yAxis.nameTextStyle.fontSize" :min="10" :max="30" controls-position="right" style="width: 100px; margin-left: 10px"></el-input-number>
            </el-form-item>
            <el-form-item label="标签颜色" v-if="option.yAxis.axisLabel">
               <el-color-picker v-model="option.yAxis.axisLabel.color" show-alpha></el-color-picker>
            </el-form-item>
             <el-form-item label="标签大小" v-if="option.yAxis.axisLabel">
               <el-input-number v-model="option.yAxis.axisLabel.fontSize" :min="10" :max="30" controls-position="right"></el-input-number>
            </el-form-item>
             <el-form-item label="显示轴线" v-if="option.yAxis.axisLine">
               <el-switch v-model="option.yAxis.axisLine.show"></el-switch>
            </el-form-item>
             <el-form-item label="轴线颜色" v-if="option.yAxis.axisLine && option.yAxis.axisLine.lineStyle">
               <el-color-picker v-model="option.yAxis.axisLine.lineStyle.color" show-alpha></el-color-picker>
            </el-form-item>
             <el-form-item label="网格线" v-if="option.yAxis.splitLine">
               <el-switch v-model="option.yAxis.splitLine.show"></el-switch>
            </el-form-item>
             <el-form-item label="网格线色" v-if="option.yAxis.splitLine && option.yAxis.splitLine.lineStyle">
               <el-color-picker v-model="option.yAxis.splitLine.lineStyle.color" show-alpha></el-color-picker>
            </el-form-item>
          </template>
        </el-collapse-item>

        <el-collapse-item title="数值设置" name="seriesLabel" v-if="seriesItem">
           <el-form-item label="显示数值">
             <el-switch v-model="seriesItem.label.show"></el-switch>
          </el-form-item>
          <template v-if="seriesItem.label && seriesItem.label.show">
             <el-form-item label="字体颜色">
               <el-color-picker v-model="seriesItem.label.color" show-alpha></el-color-picker>
            </el-form-item>
             <el-form-item label="字体大小">
               <el-input-number v-model="seriesItem.label.fontSize" :min="10" :max="30" controls-position="right"></el-input-number>
            </el-form-item>
             <el-form-item label="位置">
               <el-select v-model="seriesItem.label.position">
                 <el-option label="顶部" value="top"></el-option>
                 <el-option label="内部" value="inside"></el-option>
                 <el-option label="左侧" value="left"></el-option>
                 <el-option label="右侧" value="right"></el-option>
                 <el-option label="底部" value="bottom"></el-option>
               </el-select>
            </el-form-item>
          </template>
        </el-collapse-item>

        <el-collapse-item title="图表样式" name="seriesStyle" v-if="seriesItem">
           <el-form-item label="图形颜色" v-if="seriesItem.itemStyle">
               <el-color-picker v-model="seriesItem.itemStyle.color" show-alpha></el-color-picker>
           </el-form-item>
           <template v-if="seriesItem.type === 'bar'">
              <el-form-item label="柱条宽度">
                 <el-slider v-model="seriesItem.barWidth" :min="1" :max="100"  style="width: 200px"></el-slider>
              </el-form-item>
              <el-form-item label="圆角半径" v-if="seriesItem.itemStyle">
                 <el-slider v-model="seriesItem.itemStyle.barBorderRadius" :min="0" :max="50"  style="width: 200px"></el-slider>
              </el-form-item>
           </template>
           <template v-if="seriesItem.type === 'line'">
              <el-form-item label="平滑曲线">
                 <el-switch v-model="seriesItem.smooth"></el-switch>
              </el-form-item>
           </template>
        </el-collapse-item>

        <el-collapse-item title="坐标轴边距" name="grid" v-if="option.grid">
           <el-form-item label="左边距">
              <el-slider v-model="option.grid.left" :min="0" :max="200"  style="width: 200px"></el-slider>
           </el-form-item>
           <el-form-item label="右边距">
              <el-slider v-model="option.grid.right" :min="0" :max="200"  style="width: 200px"></el-slider>
           </el-form-item>
           <el-form-item label="上边距">
              <el-slider v-model="option.grid.top" :min="0" :max="200"  style="width: 200px"></el-slider>
           </el-form-item>
           <el-form-item label="下边距">
              <el-slider v-model="option.grid.bottom" :min="0" :max="200"  style="width: 200px"></el-slider>
           </el-form-item>
        </el-collapse-item>
      </el-collapse>

      <el-form-item label="更换图表类型">
        <el-dropdown trigger="click" @command="handleChartTypeChange">
          <span class="el-dropdown-link">
            {{ currentChartName }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="chart in charts" :key="chart.title" :command="chart.title">
                {{ chart.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-form-item>
      <el-form-item label="静态数据源">
        <el-button @click="openStaticWinbox">修改数据</el-button>
      </el-form-item>
    </el-form>

    <el-dialog v-model="dialogVisible" title="数据修改" width="75%">
      <div ref="aceRef" class="ace"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="updateData">更新数据</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-chrome'
import 'ace-builds/src-min-noconflict/mode-json5'
import toast from '@/utils/toast'
import { ArrowDown } from '@element-plus/icons-vue'

const store = useMainStore()
const { curComponent } = storeToRefs(store)
const activeNames = ref([])

const option = computed(() => {
  return curComponent.value?.propValue.option || {}
})

const seriesItem = computed(() => {
  if (!curComponent.value || !curComponent.value.propValue.option) return null
  const series = curComponent.value.propValue.option.series
  if (Array.isArray(series)) {
    return series[0]
  }
  return series
})

const charts = [
  {
    title: 'bar',
    name: '柱状图',
  },
  {
    title: 'scatter',
    name: '散点图',
  },
  {
    title: 'line',
    name: '折线图',
  },
  {
    title: 'pie',
    name: '饼图',
  },
]

const currentChartName = computed(() => {
  const type = option.value.series?.type || option.value.series?.[0]?.type
  const chart = charts.find((c) => c.title === type)
  return chart ? chart.name : '未知图表'
})

const dialogVisible = ref(false)
const aceRef = ref<HTMLElement | null>(null)
let editor: any = null

const handleChartTypeChange = (chartTitle: string) => {
  if (Array.isArray(option.value.series)) {
    option.value.series.forEach((s: any) => (s.type = chartTitle))
  } else {
    option.value.series.type = chartTitle
  }
}

const openStaticWinbox = () => {
  dialogVisible.value = true
  nextTick(() => {
    if (!editor) {
      ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/')
      if (aceRef.value) {
        editor = ace.edit(aceRef.value, {
          maxLines: 28,
          minLines: 28,
          fontSize: 14,
          theme: 'ace/theme/chrome',
          mode: 'ace/mode/json5',
          tabSize: 4,
          readOnly: false,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        })
      }
    }
    
    // 初始化图表数据在editor中
    let dataStr = ''
    let xAxisStr = ''
    
    // Handle different series structures (array or object)
    if (Array.isArray(option.value.series)) {
       // Assuming the first series contains the data we want to edit or we just pick the first one
       dataStr = JSON.stringify(option.value.series[0].data)
    } else {
       dataStr = JSON.stringify(option.value.series.data)
    }

    if (option.value.xAxis && option.value.xAxis.data) {
        xAxisStr = JSON.stringify(option.value.xAxis.data)
    }

    editor.setValue(`${dataStr}\n${xAxisStr}`)
  })
}

const findString = (str: string, ch1: string, ch2: string) => {
  const start = str.indexOf(ch1)
  const end = str.indexOf(ch2, start) // Search from start
  if (start === -1 || end === -1) return ''
  return str.substring(start, end + 1)
}

const updateData = () => {
  try {
    const str = editor.getValue()
    const arrDataStr = findString(str, '[', ']')
    const remainingStr = str.substring(str.indexOf(']') + 1)
    const arrXAxisStr = findString(remainingStr, '[', ']')
    
    if (arrDataStr) {
        const newData = JSON.parse(arrDataStr)
        if (Array.isArray(option.value.series)) {
            option.value.series.forEach((s: any) => (s.data = newData))
        } else {
            option.value.series.data = newData
        }
    }
    
    if (arrXAxisStr && option.value.xAxis) {
        option.value.xAxis.data = JSON.parse(arrXAxisStr)
    }
    
    toast('更新成功')
    dialogVisible.value = false
  } catch (e) {
    toast('数据格式错误，请检查 JSON 格式')
    console.error(e)
  }
}
</script>

<style lang="scss" scoped>
.ace {
  margin: 5px;
  margin-top: -20px;
  height: 600px;
  width: 100%;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
