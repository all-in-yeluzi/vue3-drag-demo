<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form v-if="curComponent">
      <el-form-item label="类型">
        <el-select v-model="curComponent.propValue.component" placeholder="请选择边框类型">
          <el-option
            v-for="item in borderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="主颜色">
        <el-color-picker v-model="curComponent.propValue.config.color[0]" show-alpha />
      </el-form-item>
      <el-form-item label="副颜色">
        <el-color-picker v-model="curComponent.propValue.config.color[1]" show-alpha />
      </el-form-item>
      <el-form-item label="背景颜色">
        <el-color-picker v-model="curComponent.propValue.config.backgroundColor" show-alpha />
      </el-form-item>

      <el-form-item label="标题" v-if="curComponent.propValue.content !== undefined">
        <el-input v-model="curComponent.propValue.content" type="textarea" :rows="3" />
      </el-form-item>

      <el-form-item label="SVG标题" v-if="curComponent.propValue.content !== undefined">
        <el-switch v-model="curComponent.propValue.config.useSVGTitle" active-text="启用" inactive-text="禁用" />
      </el-form-item>

      <template v-if="curComponent.propValue.content !== undefined && curComponent.propValue.config.useSVGTitle">
        <el-form-item label="标题位置X">
          <el-slider v-model="curComponent.propValue.config.titleOffset[0]" :min="-300" :max="300"  />
        </el-form-item>
        <el-form-item label="标题位置Y">
          <el-slider v-model="curComponent.propValue.config.titleOffset[1]" :min="-300" :max="300"  />
        </el-form-item>
        <el-form-item label="标题宽度" v-if="curComponent.propValue.component === 'dv-border-box-11'">
          <el-input-number v-model="curComponent.propValue.config.titleWidth" :min="50" :max="500" />
        </el-form-item>
      </template>

      <template v-if="curComponent.propValue.content !== undefined && curComponent.propValue.titleStyle && !curComponent.propValue.config.useSVGTitle">
        <el-form-item label="标题位置">
          <el-select v-model="curComponent.propValue.titleStyle.horizontalAlign" placeholder="水平对齐" style="width: 48%; margin-right: 4%">
            <el-option label="居左" value="flex-start"></el-option>
            <el-option label="居中" value="center"></el-option>
            <el-option label="居右" value="flex-end"></el-option>
          </el-select>
          <el-select v-model="curComponent.propValue.titleStyle.verticalAlign" placeholder="垂直对齐" style="width: 48%">
            <el-option label="顶部" value="flex-start"></el-option>
            <el-option label="居中" value="center"></el-option>
            <el-option label="底部" value="flex-end"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="curComponent.propValue.content !== undefined && curComponent.propValue.titleStyle">
        <el-form-item label="字体大小">
          <el-input-number v-model="curComponent.propValue.titleStyle.fontSize" :min="12" :max="100" />
        </el-form-item>
        <el-form-item label="字体颜色">
          <el-color-picker v-model="curComponent.propValue.titleStyle.color" show-alpha />
        </el-form-item>
        <el-form-item label="字体粗细">
          <el-select v-model="curComponent.propValue.titleStyle.fontWeight">
            <el-option label="正常" value="normal"></el-option>
            <el-option label="加粗" value="bold"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <el-form-item label="组件配置">
        <el-button @click="openConfigEditor">编辑JSON配置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog v-model="dialogVisible" title="编辑配置(JSON)" width="75%">
      <div ref="aceRef" class="ace" style="height: 400px; width: 100%;"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formatJson">格式化</el-button>
          <el-button type="primary" @click="updateConfig">更新配置</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-chrome'
import 'ace-builds/src-min-noconflict/mode-json5'
import toast from '@/utils/toast'

const store = useMainStore()
const { curComponent } = storeToRefs(store)

watch(() => curComponent.value, (newVal) => {
  if (newVal && newVal.propValue && newVal.propValue.content !== undefined) {
    if (!newVal.propValue.titleStyle) {
      newVal.propValue.titleStyle = {
        horizontalAlign: 'center',
        verticalAlign: 'center',
        fontSize: 24,
        color: '#fff',
        fontWeight: 'normal'
      }
    }
    
    if (!newVal.propValue.config) {
      newVal.propValue.config = {}
    }
    if (!newVal.propValue.config.titleOffset) {
      newVal.propValue.config.titleOffset = [0, 0]
    }
    if (newVal.propValue.config.useSVGTitle === undefined) {
      newVal.propValue.config.useSVGTitle = false
    }
    if (newVal.propValue.component === 'dv-border-box-11' && !newVal.propValue.config.titleWidth) {
       newVal.propValue.config.titleWidth = 250
    }
  }
}, { immediate: true })

const borderOptions = [
  { label: '边框1', value: 'dv-border-box-1' },
  { label: '边框2', value: 'dv-border-box-2' },
  { label: '边框3', value: 'dv-border-box-3' },
  { label: '边框4', value: 'dv-border-box-4' },
  { label: '边框5', value: 'dv-border-box-5' },
  { label: '边框6', value: 'dv-border-box-6' },
  { label: '边框7', value: 'dv-border-box-7' },
  { label: '边框8', value: 'dv-border-box-8' },
  { label: '边框9', value: 'dv-border-box-9' },
  { label: '边框10', value: 'dv-border-box-10' },
  { label: '边框11', value: 'dv-border-box-11' },
  { label: '边框12', value: 'dv-border-box-12' },
  { label: '边框13', value: 'dv-border-box-13' },
]

const dialogVisible = ref(false)
const aceRef = ref(null)
let editor: any = null

const openConfigEditor = () => {
  if (!curComponent.value) return
  dialogVisible.value = true
  nextTick(() => {
    if (!editor) {
      ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/')
      if (aceRef.value) {
        editor = ace.edit(aceRef.value, {
          maxLines: 30,
          minLines: 30,
          fontSize: 14,
          theme: 'ace/theme/chrome',
          mode: 'ace/mode/json5',
          tabSize: 2,
          readOnly: false,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        })
      }
    }
    const configStr = JSON.stringify(curComponent.value?.propValue.config || {}, null, 2)
    editor.setValue(configStr)
  })
}

const formatJson = () => {
  try {
    const val = editor.getValue()
    const jsonObj = JSON.parse(val)
    editor.setValue(JSON.stringify(jsonObj, null, 2))
  } catch (e) {
    toast('JSON 格式错误')
  }
}

const updateConfig = () => {
  try {
    if (!curComponent.value) return
    const val = editor.getValue()
    const jsonObj = JSON.parse(val)
    curComponent.value.propValue.config = jsonObj
    dialogVisible.value = false
    toast('配置更新成功')
  } catch (e) {
    toast('JSON 格式错误')
  }
}
</script>