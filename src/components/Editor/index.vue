<template>
  <div
    id="editor"
    class="editor"
    :class="{ edit: isEdit }"
    :style="{
      ...getCanvasStyle(canvasStyleData),
      width: changeStyleWithScale(canvasStyleData.width) + 'px',
      height: changeStyleWithScale(canvasStyleData.height) + 'px',
    }"
    @contextmenu="handleContextMenu"
    @mousedown="handleMouseDown"
  >
    <Grid :is-dark-mode="isDarkMode" />
    <Shape
      v-for="(item, index) in componentData"
      :key="item.id"
      :default-style="item.style"
      :style="getShapeStyle(item.style)"
      :active="item.id === (curComponent || {}).id"
      :element="item"
      :index="index"
      :class="{ lock: item.isLock }"
    >
      <component
        :is="item.component"
        v-if="item.component.startsWith('SVG')"
        :id="'component' + item.id"
        :style="getSVGStyle(item.style)"
        class="component"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      />
      <component
        :is="item.component"
        v-else-if="item.component != 'VText'"
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      />
      <component
        :is="item.component"
        v-else
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
        @input="handleInput"
      />
    </Shape>
    <ContextMenu />
    <MarkLine />
    <Area v-show="isShowArea" :start="start" :width="width" :height="height" />
    <GroupComponentBox v-if="areaData?.components?.length" v-bind="areaData.style" />
  </div>
  <!-- <el-slider v-model="scale" @change="handleScaleChange" /> -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import Shape from './Shape.vue'
import {
  getStyle,
  getComponentRotatedStyle,
  getShapeStyle,
  getSVGStyle as getSVGStyleUtil,
  getCanvasStyle,
} from '@/utils/style'
import ContextMenu from './ContextMenu.vue'
import MarkLine from './MarkLine.vue'
import Area from './Area.vue'
import GroupComponentBox from './GroupComponentBox.vue'
import eventBus from '@/utils/eventBus'
import Grid from './Grid.vue'
import { changeStyleWithScale } from '@/utils/translate'
import changeComponentsSizeWithScale, { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale'
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: true,
  },
})
const scale = ref(100)
const store = useMainStore()
const { componentData, curComponent, canvasStyleData, editor, isDarkMode, areaData } = storeToRefs(store)

const editorX = ref(0)
const editorY = ref(0)
const start = ref({ x: 0, y: 0 })
const width = ref(0)
const height = ref(0)
const isShowArea = ref(false)
const svgFilterAttrs = ['width', 'height', 'top', 'left', 'rotate']

onMounted(() => {
  store.getEditor()
  eventBus.on('hideArea', () => {
    hideArea()
  })
})

const handleMouseDown = (e: MouseEvent) => {
  hideArea()
  if (!store.editor) return
  const rectInfo = store.editor.getBoundingClientRect()
  editorX.value = rectInfo.x
  editorY.value = rectInfo.y
  const startX = e.clientX
  const startY = e.clientY
  start.value.x = startX - editorX.value
  start.value.y = startY - editorY.value
  isShowArea.value = true
  const move = (moveEvent: MouseEvent) => {
    width.value = Math.abs(moveEvent.clientX - startX)
    height.value = Math.abs(moveEvent.clientY - startY)
    if (moveEvent.clientX < startX) {
      start.value.x = moveEvent.clientX - editorX.value
    }
    if (moveEvent.clientY < startY) {
      start.value.y = moveEvent.clientY - editorY.value
    }
  }
  const up = (evt: MouseEvent) => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
    if (evt.clientX == startX && evt.clientY == startY) {
      hideArea()
      return
    }
    createGroup()
  }
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

const hideArea = () => {
  isShowArea.value = false
  width.value = 0
  height.value = 0
  store.setAreaData({
    style: { left: 0, top: 0, width: 0, height: 0 },
    components: [],
  })
}

const createGroup = () => {
  const data = getSelectArea()
  if (data.length <= 1) {
    hideArea()
    return
  }
  let top = Infinity
  let left = Infinity
  let right = -Infinity
  let bottom = -Infinity
  data.forEach((component: any) => {
    let style: any = {}
    if (component.component == 'Group') {
      component.propValue.forEach((item: any) => {
        const rectInfo = document.querySelector(`#component${item.id}`)!.getBoundingClientRect()
        style.left = rectInfo.left - editorX.value
        style.top = rectInfo.top - editorY.value
        style.right = rectInfo.right - editorX.value
        style.bottom = rectInfo.bottom - editorY.value
        if (style.left < left) left = style.left
        if (style.top < top) top = style.top
        if (style.right > right) right = style.right
        if (style.bottom > bottom) bottom = style.bottom
      })
    } else {
      style = getComponentRotatedStyle(component.style)
    }
    if (style.left < left) left = style.left
    if (style.top < top) top = style.top
    if (style.right > right) right = style.right
    if (style.bottom > bottom) bottom = style.bottom
  })
  start.value.x = left
  start.value.y = top
  width.value = right - left
  height.value = bottom - top
  store.setAreaData({
    style: { left, top, width: width.value, height: height.value },
    components: data,
  })
  isShowArea.value = false
}

const getSelectArea = () => {
  const result: any[] = []
  const { x, y } = start.value
  componentData.value.forEach((component: any) => {
    if (component.isLock) return
    const { left, top, width: compWidth, height: compHeight } = getComponentRotatedStyle(component.style)
    if (x <= left && y <= top && left + compWidth <= x + width.value && top + compHeight <= y + height.value) {
      result.push(component)
    }
  })
  return result
}

const handleContextMenu = (e: MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()
  const editorEl = document.querySelector('.editor') as HTMLElement
  const editorRect = editorEl.getBoundingClientRect()
  let left = e.clientX - editorRect.left
  let top = e.clientY - editorRect.top
  let adjustedLeft = left > editorRect.width ? editorRect.width : left
  let adjustedTop = top > editorRect.height ? editorRect.height : top
  store.showContextMenu({ top: adjustedTop, left: adjustedLeft })
}

const getComponentStyle = (style: any) => {
  return getStyle(style, svgFilterAttrs)
}
const getSVGStyle = (style: any) => {
  return getSVGStyleUtil(style, svgFilterAttrs)
}
const handleInput = (element: any, value: any) => {
  store.setShapeStyle({ height: getTextareaHeight(element, value) })
}
const getTextareaHeight = (element: any, text: any) => {
  let { lineHeight, fontSize, height } = element.style
  if (lineHeight === '') {
    lineHeight = 1.5
  }
  const newHeight = (text.split('<br>').length - 1) * lineHeight * (fontSize || canvasStyleData.value.fontSize)
  return height > newHeight ? height : newHeight
}
const handleScaleChange = () => {
  store.setLastScale(scale.value)
  scale.value = ~~scale.value || 1
    changeComponentsSizeWithScale(scale.value)
}
</script>
<style lang="scss" scoped>
.editor {
  position: relative;
  background: #fff;
  margin: auto;
  .lock {
    opacity: 0.5;
    &:hover {
      cursor: not-allowed;
    }
  }
}
.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>
