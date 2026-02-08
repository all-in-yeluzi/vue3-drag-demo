<template>
  <div>
    <div :class="isDarkMode ? 'dark toolbar' : 'toolbar'">
      <el-button @click="onAceEditorChange">JSON</el-button>
      <el-button @click="onImportJSON">导入</el-button>
      <el-button @click="onExportJSON">导出</el-button>
      <el-button @click="undo">撤消</el-button>
      <el-button @click="redo">重做</el-button>
      <label for="input" class="insert">
        插入图片
        <input id="input" type="file" hidden @change="handleFileChange" />
      </label>

      <el-button style="margin-left: 10px" @click="preview(false)"> 预览 </el-button>
      <el-button @click="save">保存</el-button>
      <el-button @click="clearCanvas">清空画布</el-button>
      <el-button :disabled="!areaData.components.length" @click="compose"> 组合 </el-button>
      <el-button
        :disabled="!curComponent || curComponent.isLock || curComponent.component != 'Group'"
        @click="decompose"
      >
        拆分
      </el-button>

      <el-button :disabled="!curComponent || curComponent.isLock" @click="lock"> 锁定 </el-button>
      <el-button :disabled="!curComponent || !curComponent.isLock" @click="unlock"> 解锁 </el-button>
      <el-button @click="preview(true)">截图</el-button>

      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="canvasStyleData.width" />
        <span>*</span>
        <input v-model="canvasStyleData.height" />
      </div>
      <div class="canvas-config">
        <span>画布比例</span>
        <input v-model="scale" @input="handleScaleChange" />
        %
      </div>
      <el-switch
        v-model="switchValue"
        class="dark-mode-switch"
        :active-icon="Sunny"
        :inactive-icon="Moon"
        active-color="#000"
        @change="handleToggleDarkMode"
      ></el-switch>
      <el-dropdown
        v-if="showComponentAlign"
        :hide-on-click="false"
        class="align-dropdown"
        trigger="click"
        @command="handleComponentAlign"
      >
        <el-button type="primary">
          对齐方式
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in alignList"
              :key="item.value"
              :command="item.value"
              :disabled="item.isDisabled ? areaData.components.length < 3 : false"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 预览 -->
    <Preview v-if="isShowPreview" :is-screenshot="isScreenshot" @close="handlePreviewChange" />
    <AceEditor v-if="isShowAceEditor" @closeEditor="closeEditor" />

    <el-dialog
      :title="isExport ? '导出数据' : '导入数据'"
      v-model="isShowDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-input v-model="jsonData" type="textarea" :rows="20" placeholder="请输入 JSON 数据"></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShowDialog = false">取 消</el-button>
          <el-upload
            v-show="!isExport"
            action="/"
            :before-upload="beforeUpload"
            :show-file-list="false"
            accept="application/json"
          >
            <el-button type="primary">选择 JSON 文件</el-button>
          </el-upload>
          <el-button type="primary" @click="processJSON">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import generateID from '@/utils/generateID'
import toast from '@/utils/toast'
import Preview from '@/components/Editor/Preview.vue'
import AceEditor from '@/components/Editor/AceEditor.vue'
import { commonStyle, commonAttr } from '@/custom-component/component-list'
import eventBus from '@/utils/eventBus'
import { $ } from '@/utils/utils'
import changeComponentsSizeWithScale, { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale'
import { getComponentRotatedStyle } from '@/utils/style'
import { useFile } from '@/hooks/useFile'
import { ArrowDown, Sunny, Moon } from '@element-plus/icons-vue'

const store = useMainStore()
const { componentData, canvasStyleData, areaData, curComponent, curComponentIndex, isDarkMode } = storeToRefs(store)
const { downloadFileUtil, readFileAsText, readFileAsDataURL } = useFile()

const isShowPreview = ref(false)
const isShowAceEditor = ref(false)
const timer = ref<any>(null)
const isScreenshot = ref(false)
const scale = ref(100)
const switchValue = ref(false)
const isShowDialog = ref(false)
const jsonData = ref('')
const isExport = ref(false)

const alignList = [
  {
    label: '左对齐',
    value: 'leftAlign',
  },
  {
    label: '水平居中',
    value: 'centerAlign',
  },
  {
    label: '右对齐',
    value: 'rightAlign',
  },
  {
    label: '顶对齐',
    value: 'topAlign',
  },
  {
    label: '垂直居中',
    value: 'middleAlign',
  },
  {
    label: '底对齐',
    value: 'bottomAlign',
  },
  {
    label: '水平等间距',
    value: 'horizontalSpacing',
    isDisabled: true,
  },
  {
    label: '垂直等间距',
    value: 'verticalSpacing',
    isDisabled: true,
  },
]

const showComponentAlign = computed(() => {
  return (curComponent.value && !curComponent.value.isLock) || areaData.value.components.length > 1
})

onMounted(() => {
  eventBus.on('preview', (payload) => preview(Boolean(payload)))
  eventBus.on('save', () => save())
  eventBus.on('clearCanvas', () => clearCanvas())

  scale.value = canvasStyleData.value.scale
  const savedMode = localStorage.getItem('isDarkMode')
  if (savedMode) {
    handleToggleDarkMode(JSON.parse(savedMode))
  }
})

const handleComponentAlign = (command: any) => {
  store[command as keyof typeof store]()
  store.recordSnapshot()

  let top = Infinity,
    left = Infinity
  let right = -Infinity,
    bottom = -Infinity
  if (areaData.value.components.length > 1) {
    areaData.value.components.forEach((component: any) => {
      let style = getComponentRotatedStyle(component.style)
      if (style.left < left) left = style.left
      if (style.top < top) top = style.top
      if (style.right > right) right = style.right
      if (style.bottom > bottom) bottom = style.bottom
    })
    store.setAreaData({
      style: {
        left,
        top,
        width: right - left,
        height: bottom - top,
      },
      components: areaData.value.components,
    })
  }
}

const handleToggleDarkMode = (value: boolean) => {
  if (value !== null) {
    store.toggleDarkMode(value)
    switchValue.value = value
  }
}

const handleScaleChange = () => {
  clearTimeout(timer.value)
  store.setLastScale(scale.value)
  timer.value = setTimeout(() => {
    // eslint-disable-next-line no-bitwise
    scale.value = ~~scale.value || 1
    changeComponentsSizeWithScale(scale.value)
  }, 1000)
}

const onAceEditorChange = () => {
  isShowAceEditor.value = !isShowAceEditor.value
}

const closeEditor = () => {
  onAceEditorChange()
}

const lock = () => {
  store.lock()
}

const unlock = () => {
  store.unlock()
}

const compose = () => {
  store.compose()
  store.recordSnapshot()
}

const decompose = () => {
  store.decompose()
  store.recordSnapshot()
}

const undo = () => {
  store.undo()
}

const redo = () => {
  store.redo()
}

const handleFileChange = (e: any) => {
  const file = e.target.files[0]
  if (!file.type.includes('image')) {
    toast('只能插入图片')
    return
  }

  readFileAsDataURL(file).then((fileResult) => {
    const img = new Image()
    img.onload = () => {
      const component = {
        ...commonAttr,
        id: generateID(),
        component: 'Picture',
        label: '图片',
        icon: '',
        propValue: {
          url: fileResult,
          flip: {
            horizontal: false,
            vertical: false,
          },
        },
        style: {
          ...commonStyle,
          top: 0,
          left: 0,
          width: img.width,
          height: img.height,
        },
      }

      changeComponentSizeWithScale(component)

      store.addComponent({ component })
      store.recordSnapshot()

      // 修复重复上传同一文件，@change 不触发的问题
      const input = document.getElementById('input')
      if (input) {
        input.setAttribute('type', 'text')
        input.setAttribute('type', 'file')
      }
    }

    img.src = fileResult
  })
}

const preview = (screenshot: boolean) => {
  isScreenshot.value = screenshot
  isShowPreview.value = true
  store.setEditMode('preview')
}

const save = () => {
  localStorage.setItem('canvasData', JSON.stringify(componentData.value))
  localStorage.setItem('canvasStyle', JSON.stringify(canvasStyleData.value))
  toast('保存成功', 'success')
}

const clearCanvas = () => {
  store.setCurComponent({
    component: null,
    index: null,
  })
  store.setComponentData([])
  store.recordSnapshot()
}

const handlePreviewChange = () => {
  isShowPreview.value = false
  store.setEditMode('edit')
}

const onImportJSON = () => {
  jsonData.value = ''
  isExport.value = false
  isShowDialog.value = true
}

const processJSON = () => {
  try {
    const data = JSON.parse(jsonData.value)

    if (isExport.value) {
      downloadFileUtil(jsonData.value, 'application/json', 'data.json')
    } else if (Array.isArray(data)) {
      store.setComponentData(data)
    } else if (data && typeof data === 'object') {
      if (data.componentData && Array.isArray(data.componentData)) {
        store.setComponentData(data.componentData)
      }
      if (data.canvasStyleData && typeof data.canvasStyleData === 'object') {
        store.setCanvasStyle(data.canvasStyleData)
      }
    } else {
      toast('数据格式错误，请传入合法的 JSON 格式数据')
      return
    }

    isShowDialog.value = false
  } catch (error) {
    toast('数据格式错误，请传入合法的 JSON 格式数据')
  }
}

const onExportJSON = () => {
  isShowDialog.value = true
  isExport.value = true
  const exportData = {
    componentData: componentData.value,
    canvasStyleData: canvasStyleData.value,
  }
  jsonData.value = JSON.stringify(exportData, null, 4)
}

const beforeUpload = (file: any) => {
  readFileAsText(file).then((res) => {
    jsonData.value = res
  })
  return false
}
</script>

<style lang="scss" scoped>
.toolbar {
  padding: 15px 10px;
  white-space: nowrap;
  overflow-x: auto;
  background: var(--main-bg-color);
  border-color: var(--ace-bg-color);
  border-bottom: 1px solid var(--border-color);

  .align-dropdown {
    margin-left: 10px;
  }

  .canvas-config {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    color: var(--text-color);

    input {
      width: 50px;
      margin-left: 4px;
      outline: none;
      padding: 0 5px;
      border: 1px solid var(--border-color);
      color: #606266;
    }

    span {
      margin-left: 10px;
    }
  }

  .el-button--small {
    background: var(--main-bg-color);
    border: 1px solid var(--toolbar-border-color);
    color: var(--button-text-color);
  }

  .el-button--small:hover {
    background: var(--button-active-text-color);
    border-color: var(--actived-bg-color);
    color: var(--main-bg-color);
  }

  .insert {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid var(--toolbar-border-color);
    color: var(--text-color);
    appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-left: 10px;
  }

  .insert {
    background: var(--main-bg-color);
    border: 1px solid var(--toolbar-border-color);
    color: var(--button-text-color);

    &:active {
      background: var(--button-active-text-color);
      border-color: var(--actived-bg-color);
      color: var(--main-bg-color);
    }

    &:hover {
      background: var(--button-active-text-color);
      border-color: var(--actived-bg-color);
      color: var(--main-bg-color);
    }
  }

  .el-button.is-disabled {
    color: var(--disable-text-color);
    border-color: var(--disable-border-color);
    background: var(--main-bg-color);

    &:hover {
      background: var(--main-bg-color);
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;

  & > * {
    margin-left: 10px;
  }
}
</style>
