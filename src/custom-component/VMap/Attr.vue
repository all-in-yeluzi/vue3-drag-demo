<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="标题" v-if="option.title">
        <el-switch v-model="option.title.show" active-text="显示标题"></el-switch>
        <el-input v-model="option.title.text" placeholder="请输入内容" v-if="option.title.show"></el-input>
      </el-form-item>
      <el-form-item label="工具提示" v-if="option.tooltip">
        <el-switch v-model="option.tooltip.show" active-text="显示提示"></el-switch>
      </el-form-item>
      <el-form-item label="图例" v-if="option.legend">
        <el-switch v-model="option.legend.show" active-text="显示图例"></el-switch>
      </el-form-item>
      
      <el-form-item label="静态数据源">
        <el-button @click="openStaticWinbox">修改配置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog v-model="dialogVisible" title="配置修改" width="75%">
      <div ref="aceRef" class="ace"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="updateData">更新配置</el-button>
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

const store = useMainStore()
const { curComponent } = storeToRefs(store)

const option = computed(() => {
  return curComponent.value?.propValue.option || {}
})

const dialogVisible = ref(false)
const aceRef = ref<HTMLElement | null>(null)
let editor: any = null

const openStaticWinbox = () => {
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
          tabSize: 4,
          readOnly: false,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        })
      }
    }
    
    // 显示完整的 option 配置，方便用户复制粘贴 ECharts 示例
    const optionStr = JSON.stringify(option.value, null, 4)
    editor.setValue(optionStr)
  })
}

const updateData = () => {
  try {
    if (!curComponent.value) return
    const str = editor.getValue()
    const newOption = JSON.parse(str)
    curComponent.value.propValue.option = newOption
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
</style>
