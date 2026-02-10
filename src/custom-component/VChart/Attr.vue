<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form>
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
      <el-form-item label="横坐标" v-if="option.xAxis">
        <el-switch v-model="option.xAxis.show" active-text="显示横坐标"></el-switch>
      </el-form-item>
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

const option = computed(() => {
  return curComponent.value?.propValue.option || {}
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
