<template>
  <div class="ace">
    <div class="header">
      <el-button class="btn" :icon="Search" @click="openSearchBox"> 查找 </el-button>
      <el-button class="btn" :icon="Close" @click="closeEditor"> 关闭 </el-button>
    </div>
    <div class="ace-editor">
      <div ref="editorRef" class="editor" />
    </div>
    <div class="footer">
      <el-button type="primary" @click="setCode"> 重置代码 </el-button>
      <el-button type="success" @click="getCode"> 保存提交 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-one_dark'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/mode-json5'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { Search, Close } from '@element-plus/icons-vue'

const emit = defineEmits(['closeEditor'])

const store = useMainStore()
const { canvasStyleData, curComponent } = storeToRefs(store)

const editorRef = ref<HTMLElement | null>(null)
let editor: any = null
const obj = ref<any>(null)

const setCode = () => {
  obj.value = curComponent.value || canvasStyleData.value
  editor.setValue(JSON.stringify(obj.value, null, 4))
}

watch([curComponent, canvasStyleData], () => {
  setCode()
})

onMounted(() => {
  ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/')
  if (editorRef.value) {
    editor = ace.edit(editorRef.value, {
      maxLines: 40,
      minLines: 40,
      fontSize: 14,
      theme: 'ace/theme/one_dark',
      mode: 'ace/mode/json5',
      tabSize: 4,
      readOnly: false,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
    })

    setCode()
  }
})

const getCode = () => {
  let str = editor.getValue()
  if (!curComponent.value) {
    store.aceSetCanvasData(JSON.parse(str))
  } else {
    store.aceSetcurComponent(JSON.parse(str))
  }
}

const openSearchBox = () => {
  editor.execCommand('find')
}

const closeEditor = () => {
  emit('closeEditor')
}
</script>

<style lang="scss" scoped>
.ace {
  position: absolute;
  height: calc(100% - 80px);
  width: 550px;
  top: 63px;
  background-color: #fff;
  border: 1px solid #ddd;
  z-index: 100;
  padding: 10px;

  .header,
  .footer {
    display: flex;
    justify-content: flex-end;
  }

  .ace-editor {
    height: calc(100% - 80px);
    overflow: auto;
  }
}

.editor {
  margin: 10px 0;
}
</style>
