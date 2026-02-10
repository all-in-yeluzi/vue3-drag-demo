import { useMainStore } from '@/store'
import eventBus from '@/utils/eventBus'

const ctrlKey = 17,
  commandKey = 91, // mac command
  vKey = 86, // 粘贴
  cKey = 67, // 复制
  xKey = 88, // 剪切
  yKey = 89, // 重做
  zKey = 90, // 撤销
  gKey = 71, // 组合
  bKey = 66, // 拆分
  lKey = 76, // 锁定
  uKey = 85, // 解锁
  sKey = 83, // 保存
  pKey = 80, // 预览
  dKey = 68, // 删除
  deleteKey = 46, // 删除
  eKey = 69 // 清空画布

export const keycodes = [66, 67, 68, 69, 71, 76, 80, 83, 85, 86, 88, 89, 90]

// 与组件状态无关的操作
const basemap: any = {
  [vKey]: paste,
  [yKey]: redo,
  [zKey]: undo,
  [sKey]: save,
  [pKey]: preview,
  [eKey]: clearCanvas,
}

// 组件锁定状态下可以执行的操作
const lockMap: any = {
  ...basemap,
  [uKey]: unlock,
}

// 组件未锁定状态下可以执行的操作
const unlockMap: any = {
  ...basemap,
  [cKey]: copy,
  [xKey]: cut,
  [gKey]: compose,
  [bKey]: decompose,
  [dKey]: deleteComponent,
  [deleteKey]: deleteComponent,
  [lKey]: lock,
}

let isCtrlOrCommandDown = false
// 全局监听按键操作并执行相应命令
export function listenGlobalKeyDown() {
  const store = useMainStore()
  window.onkeydown = (e) => {
    if (!store.isInEdiotr) return

    const { curComponent } = store
    const { keyCode } = e
    if (keyCode === ctrlKey || keyCode === commandKey) {
      isCtrlOrCommandDown = true
    } else if (keyCode == deleteKey && curComponent) {
      store.deleteComponent()
      store.recordSnapshot()
    } else if (isCtrlOrCommandDown) {
      if (unlockMap[keyCode] && (!curComponent || !curComponent.isLock)) {
        e.preventDefault()
        unlockMap[keyCode](store)
      } else if (lockMap[keyCode] && curComponent && curComponent.isLock) {
        e.preventDefault()
        lockMap[keyCode](store)
      }
    }
  }

  window.onkeyup = (e) => {
    if (e.keyCode === ctrlKey || e.keyCode === commandKey) {
      isCtrlOrCommandDown = false
    }
  }

  window.onmousedown = () => {
    store.setInEditorStatus(false)
  }
}

function copy(store: any) {
  store.copy()
}

function paste(store: any) {
  store.paste()
  store.recordSnapshot()
}

function cut(store: any) {
  store.cut()
}

function redo(store: any) {
  store.redo()
}

function undo(store: any) {
  store.undo()
}

function compose(store: any) {
  if (store.areaData.components.length) {
    store.compose()
    store.recordSnapshot()
  }
}

function decompose(store: any) {
  const curComponent = store.curComponent
  if (curComponent && !curComponent.isLock && curComponent.component == 'Group') {
    store.decompose()
    store.recordSnapshot()
  }
}

function save() {
  eventBus.emit('save')
}

function preview() {
  eventBus.emit('preview')
}

function deleteComponent(store: any) {
  if (store.curComponent) {
    store.deleteComponent()
    store.recordSnapshot()
  }
}

function clearCanvas() {
  eventBus.emit('clearCanvas')
}

function lock(store: any) {
  store.lock()
}

function unlock(store: any) {
  store.unlock()
}
