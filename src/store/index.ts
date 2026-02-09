import { defineStore } from 'pinia'
import generateID from '@/utils/generateID'
import eventBus from '@/utils/eventBus'
import decomposeComponent from '@/utils/decomposeComponent'
import { $ } from '@/utils/utils'
import defaultList, { commonStyle, commonAttr } from '@/custom-component/component-list'
import { createGroupStyle, getComponentRotatedStyle } from '@/utils/style'
import { deepCopy, swap } from '@/utils/utils'
import changeComponentsSizeWithScale from '@/utils/changeComponentsSizeWithScale'
import toast from '@/utils/toast'
import type { Component, CanvasStyleData, AreaData, CopyData } from '@/types'

// 设置画布默认数据 https://github.com/woai3c/visual-drag-demo/issues/92
let defaultcomponentData: Component[] = []
function getDefaultcomponentData() {
  return JSON.parse(JSON.stringify(defaultcomponentData))
}

export function setDefaultcomponentData(data: Component[] = []) {
  defaultcomponentData = data
}

export const useMainStore = defineStore('main', {
  state: () => ({
    // ...animation.state (none)
    // ...compose.state
    areaData: {
      style: {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      },
      components: [],
    } as AreaData,
    editor: null as HTMLElement | null,

    // ...contextmenu.state
    menuTop: 0,
    menuLeft: 0,
    menuShow: false,

    // ...copy.state
    copyData: null as CopyData | null,
    isCut: false,

    // ...event.state (none)
    // ...layer.state (none)

    // ...snapshot.state
    snapshotData: [] as Component[][],
    snapshotIndex: -1,

    // ...lock.state (none)
    // ...align.state (none)

    lastScale: 100,
    editMode: 'edit', // edit preview
    canvasStyleData: {
      width: 1200,
      height: 740,
      scale: 100,
      color: '#000',
      opacity: 1,
      background: '#fff',
      fontSize: 14,
    } as CanvasStyleData,
    isInEdiotr: false,
    componentData: [] as Component[],
    curComponent: null as Component | null,
    curComponentIndex: null as number | null,
    isClickComponent: false,
    rightList: true,
    isDarkMode: false,
    componentList: defaultList as Component[], // 组件库列表
  }),
  actions: {
    // Component List Management
    setComponentList(list: Component[]) {
      this.componentList = list
    },
    addComponentToList(component: Component) {
      // 尝试查找同名组件的默认配置，以补全样式键值
      const defaultComponent = defaultList.find((c) => c.component === component.component)
      let defaultStyle = {}
      if (defaultComponent) {
        defaultStyle = { ...defaultComponent.style }
      }

      // 确保组件包含公共属性，防止缺少字段导致错误
      const componentWithCommon = {
        ...commonAttr,
        ...component,
        style: {
          ...commonStyle,
          ...defaultStyle, // 补全默认样式键值
          ...component.style, // 覆盖自定义样式
        },
      }
      // 再次深拷贝以断开引用（特别是 commonAttr 里的引用类型）
      this.componentList.push(deepCopy(componentWithCommon))
    },

    // Animation
    addAnimation(animation: any) {
      if (this.curComponent) {
        this.curComponent.animations = this.curComponent.animations || []
        this.curComponent.animations.push(animation)
      }
    },
    removeAnimation(index: number) {
      if (this.curComponent && this.curComponent.animations) {
        this.curComponent.animations.splice(index, 1)
      }
    },
    alterAnimation({ index, data = {} }: { index: number; data: any }) {
      if (this.curComponent && this.curComponent.animations && typeof index === 'number') {
        const original = this.curComponent.animations[index]
        this.curComponent.animations[index] = { ...original, ...data }
      }
    },

    // Compose
    getEditor() {
      this.editor = $('#editor')
    },
    setAreaData(data: AreaData) {
      this.areaData = data
    },
    compose() {
      const selectedComponents = [...this.areaData.components]
      const components: any[] = []
      selectedComponents.forEach((component: any) => {
        if (component.component != 'Group') {
          components.push(component)
        } else {
          // 如果要组合的组件中，已经存在组合数据，则需要提前拆分
          const parentStyle = { ...component.style }
          const subComponents = component.propValue
          const editorRect = this.editor!.getBoundingClientRect()

          subComponents.forEach((component: any) => {
            decomposeComponent(component, editorRect, parentStyle)
          })

          components.push(...component.propValue)
        }
      })

      const groupComponent = {
        id: generateID(),
        component: 'Group',
        label: '组合',
        icon: 'zuhe',
        ...commonAttr,
        style: {
          ...commonStyle,
          ...this.areaData.style,
        },
        propValue: components,
      }

      createGroupStyle(groupComponent)

      this.addComponent({
        component: groupComponent,
      })

      eventBus.emit('hideArea')

      this.batchDeleteComponent(selectedComponents)
      {
        const ids = new Set(selectedComponents.map((c: any) => c.id))
        if (ids.size) {
          this.componentData = this.componentData.filter((c: any) => !ids.has(c.id))
        }
      }
      this.setCurComponent({
        component: this.componentData[this.componentData.length - 1],
        index: this.componentData.length - 1,
      })

      this.areaData.components = []
    },
    batchDeleteComponent(deleteData: any[]) {
      deleteData.forEach((component) => {
        for (let i = 0, len = this.componentData.length; i < len; i++) {
          if (component.id == this.componentData[i].id) {
            this.componentData.splice(i, 1)
            break
          }
        }
      })
    },
    decompose() {
      if (!this.curComponent || !this.editor) return
      const curComponent = this.curComponent
      const editor = this.editor
      const parentStyle = { ...curComponent.style }
      const components = curComponent.propValue
      const editorRect = editor.getBoundingClientRect()

      this.deleteComponent()
      components.forEach((component: any) => {
        decomposeComponent(component, editorRect, parentStyle)
        this.addComponent({ component })
      })
    },

    // ContextMenu
    showContextMenu({ top, left }: { top: number; left: number }) {
      this.menuShow = true
      this.menuTop = top
      this.menuLeft = left
    },
    hideContextMenu() {
      this.menuShow = false
    },

    // Copy
    copy() {
      if (!this.curComponent) {
        toast('请选择组件')
        return
      }
      this.restorePreCutData()
      this.copyDataHelper()
      this.isCut = false
    },
    paste(isMouse: boolean) {
      if (!this.copyData) {
        toast('请选择组件')
        return
      }
      const data = this.copyData.data

      if (isMouse) {
        data.style.top = this.menuTop
        data.style.left = this.menuLeft
      } else {
        data.style.top += 10
        data.style.left += 10
      }

      this.addComponent({ component: this.deepCopyHelper(data) })
      if (this.isCut) {
        this.copyData = null
      }
    },
    cut() {
      if (!this.curComponent) {
        toast('请选择组件')
        return
      }
      this.restorePreCutData()
      this.copyDataHelper()
      this.deleteComponent()
      this.isCut = true
    },
    restorePreCutData() {
      if (this.isCut && this.copyData) {
        const data = deepCopy(this.copyData.data)
        const index = this.copyData.index
        this.addComponent({ component: data, index })
        if (this.curComponentIndex !== null && this.curComponentIndex >= index) {
          this.curComponentIndex++
        }
      }
    },
    copyDataHelper() {
      if (!this.curComponent) return
      this.copyData = {
        data: deepCopy(this.curComponent),
        index: this.curComponentIndex!,
      }
    },
    deepCopyHelper(data: any) {
      const result = deepCopy(data)
      result.id = generateID()
      if (result.component === 'Group') {
        result.propValue.forEach((component: any, i: number) => {
          result.propValue[i] = this.deepCopyHelper(component)
        })
      }
      return result
    },

    // Event
    addEvent({ event, param }: { event: string; param: any }) {
      if (this.curComponent) {
        this.curComponent.events = this.curComponent.events || {}
        this.curComponent.events[event] = param
      }
    },
    removeEvent(event: string) {
      if (this.curComponent && this.curComponent.events) {
        delete this.curComponent.events[event]
      }
    },

    // Layer
    upComponent() {
      if (this.curComponentIndex !== null && this.curComponentIndex < this.componentData.length - 1) {
        swap(this.componentData, this.curComponentIndex, this.curComponentIndex + 1)
        this.curComponentIndex = this.curComponentIndex + 1
      } else {
        toast('已经到顶了')
      }
    },
    downComponent() {
      if (this.curComponentIndex !== null && this.curComponentIndex > 0) {
        swap(this.componentData, this.curComponentIndex, this.curComponentIndex - 1)
        this.curComponentIndex = this.curComponentIndex - 1
      } else {
        toast('已经到底了')
      }
    },
    topComponent() {
      if (this.curComponentIndex !== null && this.curComponentIndex < this.componentData.length - 1) {
        this.componentData.splice(this.curComponentIndex, 1)
        this.componentData.push(this.curComponent!)
        this.curComponentIndex = this.componentData.length - 1
      } else {
        toast('已经到顶了')
      }
    },
    bottomComponent() {
      if (this.curComponentIndex !== null && this.curComponentIndex > 0) {
        this.componentData.splice(this.curComponentIndex, 1)
        this.componentData.unshift(this.curComponent!)
        this.curComponentIndex = 0
      } else {
        toast('已经到底了')
      }
    },

    // Snapshot
    undo() {
      if (this.snapshotIndex >= 0) {
        this.snapshotIndex--
        let componentData = deepCopy(this.snapshotData[this.snapshotIndex]) || getDefaultcomponentData()

        componentData = changeComponentsSizeWithScale(this.lastScale, componentData)
        this.setComponentData(componentData)
        // 更新当前选中组件的引用
        const curComponent = componentData.find((component: any) => component.id === this.curComponent?.id)
        const index = curComponent ? componentData.indexOf(curComponent) : null
        this.setCurComponent({ component: curComponent, index })
      }
    },
    redo() {
      if (this.snapshotIndex < this.snapshotData.length - 1) {
        this.snapshotIndex++
        let componentData = changeComponentsSizeWithScale(
          this.lastScale,
          deepCopy(this.snapshotData[this.snapshotIndex]),
        )
        this.setComponentData(componentData)
      }
    },
    recordSnapshot() {
      // 添加新的快照
      let copyData = deepCopy(this.componentData)
      copyData.forEach((v: any) => (v.lastScale = this.lastScale))
      this.snapshotData[++this.snapshotIndex] = copyData
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (this.snapshotIndex < this.snapshotData.length - 1) {
        this.snapshotData = this.snapshotData.slice(0, this.snapshotIndex + 1)
      }

      // 限制快照数量，防止内存溢出
      const SNAPSHOT_LIMIT = 50
      if (this.snapshotData.length > SNAPSHOT_LIMIT) {
        this.snapshotData.shift()
        this.snapshotIndex--
      }
    },

    // Lock
    lock() {
      if (this.curComponent) {
        this.curComponent.isLock = true
      }
    },
    unlock() {
      if (this.curComponent) {
        this.curComponent.isLock = false
      }
    },

    // Align
    leftAlign() {
      if (this.areaData.components.length > 1) {
        let minLeft = Math.min(
          ...this.areaData.components.map((component: any) => {
            let rotatedStyle = getComponentRotatedStyle(component.style)
            return rotatedStyle.left
          }),
        )
        this.areaData.components.forEach((component: any) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          let diffX = rotatedStyle.left - minLeft
          this.changeAlign(component, { left: component.style.left - diffX })
        })
      } else {
        let rotateLeft = getComponentRotatedStyle(this.curComponent!.style)
        let newLeft = this.curComponent!.style.left - rotateLeft.left
        this.changeAlign(this.curComponent, { left: newLeft })
      }
    },
    rightAlign() {
      if (this.areaData.components.length > 1) {
        let maxRight = Math.max(
          ...this.areaData.components.map((component: any) => {
            let rotatedStyle = getComponentRotatedStyle(component.style)
            return rotatedStyle.right
          }),
        )
        this.areaData.components.forEach((component: any) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          let diffX = maxRight - rotatedStyle.right
          this.changeAlign(component, { left: component.style.left + diffX })
        })
      } else {
        let rotatedStyle = getComponentRotatedStyle(this.curComponent!.style)
        let newLeft = this.curComponent!.style.left - rotatedStyle.left
        let right = this.canvasStyleData.width + newLeft - rotatedStyle.width
        this.changeAlign(this.curComponent, { left: right })
      }
    },
    centerAlign() {
      if (this.areaData.components.length > 1) {
        let minLeft = Math.min(
          ...this.areaData.components.map((component: any) => getComponentRotatedStyle(component.style).left),
        )
        let maxRight = Math.max(
          ...this.areaData.components.map((component: any) => getComponentRotatedStyle(component.style).right),
        )
        let centerX = (minLeft + maxRight) / 2
        this.areaData.components.forEach((component: any) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          let componentCenterX = (rotatedStyle.left + rotatedStyle.right) / 2
          let diffX = centerX - componentCenterX
          this.changeAlign(component, { left: component.style.left + diffX })
        })
      } else {
        let rotatedStyle = getComponentRotatedStyle(this.curComponent!.style)
        let canvasCenterX = this.canvasStyleData.width / 2
        let componentCenterX = (rotatedStyle.left + rotatedStyle.right) / 2
        let newLeft = this.curComponent!.style.left + (canvasCenterX - componentCenterX)
        this.changeAlign(this.curComponent, { left: newLeft })
      }
    },
    topAlign() {
      if (this.areaData.components.length > 1) {
        let minTop = Math.min(
          ...this.areaData.components.map((component: any) => {
            let rotatedStyle = getComponentRotatedStyle(component.style)
            return rotatedStyle.top
          }),
        )
        this.areaData.components.forEach((component: any) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          let diffY = rotatedStyle.top - minTop
          this.changeAlign(component, { top: component.style.top - diffY })
        })
      } else {
        let rotatedStyle = getComponentRotatedStyle(this.curComponent!.style)
        let newTop = this.curComponent!.style.top - rotatedStyle.top
        this.changeAlign(this.curComponent, { top: newTop })
      }
    },
    bottomAlign() {
      if (this.areaData.components.length > 1) {
        let maxBottom = Math.max(
          ...this.areaData.components.map((component: any) => {
            let rotatedStyle = getComponentRotatedStyle(component.style)
            return rotatedStyle.bottom
          }),
        )
        this.areaData.components.forEach((component: any) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          let diffY = maxBottom - rotatedStyle.bottom
          this.changeAlign(component, { top: component.style.top + diffY })
        })
      } else {
        let rotatedStyle = getComponentRotatedStyle(this.curComponent!.style)
        let newTop = this.curComponent!.style.top - rotatedStyle.top
        let top = this.canvasStyleData.height + newTop - rotatedStyle.height
        this.changeAlign(this.curComponent, { top })
      }
    },
    middleAlign() {
      if (this.areaData.components.length > 1) {
        let minTop = Math.min(
          ...this.areaData.components.map((component: any) => getComponentRotatedStyle(component.style).top),
        )
        let maxBottom = Math.max(
          ...this.areaData.components.map((component: any) => getComponentRotatedStyle(component.style).bottom),
        )
        let centerY = (minTop + maxBottom) / 2
        this.areaData.components.forEach((component: any) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          let componentCenterY = (rotatedStyle.top + rotatedStyle.bottom) / 2
          let diffY = centerY - componentCenterY
          this.changeAlign(component, { top: component.style.top + diffY })
        })
      } else {
        let rotatedStyle = getComponentRotatedStyle(this.curComponent!.style)
        let canvasCenterY = this.canvasStyleData.height / 2
        let componentCenterY = (rotatedStyle.top + rotatedStyle.bottom) / 2
        let newTop = this.curComponent!.style.top + (canvasCenterY - componentCenterY)
        this.changeAlign(this.curComponent, { top: newTop })
      }
    },
    verticalSpacing() {
      const { components } = this.areaData
      if (components.length > 2) {
        let totalHeight = 0
        components.forEach((component: any) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          totalHeight += rotatedStyle.height
        })
        const containerHeight = this.areaData.style.height
        const availableSpace = containerHeight - totalHeight
        const spacing = Math.floor(availableSpace / (components.length - 1))
        components.sort(
          (a: any, b: any) => getComponentRotatedStyle(a.style).top - getComponentRotatedStyle(b.style).top,
        )
        let currentTop = 0
        components.forEach((component: any) => {
          this.changeAlign(component, { top: this.areaData.style.top + currentTop })
          currentTop += spacing + getComponentRotatedStyle(component.style).height
        })
      }
    },
    horizontalSpacing() {
      const { components } = this.areaData
      if (components.length > 2) {
        let totalWidth = 0
        components.forEach((component: any) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          totalWidth += rotatedStyle.width
        })
        const containerWidth = this.areaData.style.width
        const availableSpace = containerWidth - totalWidth
        const spacing = Math.floor(availableSpace / (components.length - 1))
        components.sort(
          (a: any, b: any) => getComponentRotatedStyle(a.style).left - getComponentRotatedStyle(b.style).left,
        )
        let currentLeft = 0
        components.forEach((component: any) => {
          component.style.left = this.areaData.style.left + currentLeft
          currentLeft += spacing + getComponentRotatedStyle(component.style).width
        })
      }
    },
    changeAlign(componentData: any, Align: any) {
      if (Array.isArray(componentData)) {
        componentData.forEach((item) => {
          this.changeAlign(item, Align)
        })
        return
      }
      for (let key in Align) {
        if (Align.hasOwnProperty(key)) {
          componentData.style[key] = Align[key]
        }
      }
    },

    // Main
    aceSetCanvasData(value: CanvasStyleData) {
      this.canvasStyleData = value
    },
    setLastScale(value: number) {
      this.lastScale = value
    },
    aceSetcurComponent(value: any) {
      for (let i = 0; i < this.componentData.length; i++) {
        if (this.componentData[i].id === value.id) {
          this.componentData.splice(i, 1)
        }
      }
      this.componentData.push(value)
      this.curComponent = value
    },
    setClickComponentStatus(status: boolean) {
      this.isClickComponent = status
    },
    isShowRightList() {
      this.rightList = !this.rightList
    },
    toggleDarkMode(status: boolean) {
      this.isDarkMode = status
      this.canvasStyleData.background = status ? '#817f7f' : '#fff'
      localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode))
    },
    setEditMode(mode: string) {
      this.editMode = mode
    },
    setInEditorStatus(status: boolean) {
      this.isInEdiotr = status
    },
    setCanvasStyle(style: CanvasStyleData) {
      this.canvasStyleData = style
    },
    setCurComponent({ component, index }: { component: Component | null; index: number | null }) {
      this.curComponent = component
      this.curComponentIndex = index
    },
    setShapeStyle({ top, left, width, height, rotate, padding }: any) {
      if (this.curComponent) {
        if (top !== undefined) this.curComponent.style.top = Math.round(top)
        if (left !== undefined) this.curComponent.style.left = Math.round(left)
        if (width) this.curComponent.style.width = Math.round(width)
        if (padding) this.curComponent.style.padding = Math.round(padding)
        if (height) this.curComponent.style.height = Math.round(height)
        if (rotate) this.curComponent.style.rotate = Math.round(rotate)
      }
    },
    setShapeSingleStyle({ key, value }: { key: string; value: any }) {
      if (this.curComponent) {
        this.curComponent.style[key] = value
      }
    },
    setComponentData(componentData: any[] = []) {
      this.componentData = componentData
    },
    addComponent({ component, index }: { component: Component; index?: number }) {
      if (index !== undefined) {
        this.componentData.splice(index, 0, component)
      } else {
        this.componentData.push(component)
      }
    },
    deleteComponent(index?: number) {
      if (index === undefined) {
        index = this.curComponentIndex as number
      }

      if (index == this.curComponentIndex) {
        this.curComponentIndex = null
        this.curComponent = null
      }

      if (/\d/.test(String(index))) {
        this.componentData.splice(index, 1)
      }
    },
  },
})
