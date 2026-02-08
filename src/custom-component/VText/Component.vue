<template>
  <div v-if="editMode == 'edit'" class="v-text" @keydown="handleKeydown" @keyup="handleKeyup">
    <!-- tabindex >= 0 使得 div 可以 focus，并且绑定键盘事件 -->
    <div
      ref="text"
      :contenteditable="canEdit"
      :class="{ canEdit }"
      :tabindex="element.id"
      :style="{ verticalAlign: element.style.verticalAlign }"
      @dblclick="setEdit"
      @paste="clearStyle"
      @mousedown="handleMousedown"
      @blur="handleBlur"
      @input="handleInput"
      v-html="element.propValue"
    ></div>
  </div>
  <div v-else class="v-text preview">
    <div :style="{ verticalAlign: element.style.verticalAlign }" v-html="element.propValue"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { keycodes } from '@/utils/shortcutKey'
import eventBus from '@/utils/eventBus'
import OnEvent from '../common/OnEvent.vue'

const props = defineProps({
  propValue: {
    type: String,
    default: '',
  },
  element: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['input'])

const store = useMainStore()
const { editMode } = storeToRefs(store)

const canEdit = ref(false)
const ctrlKey = 17
const isCtrlDown = ref(false)
const text = ref<HTMLElement | null>(null)

const setEdit = () => {
  if (props.element.isLock) return
  canEdit.value = true
  nextTick(() => {
    const el = text.value as HTMLElement
    if (el) {
      el.focus()
      selectText(el)
    }
  })
}

const selectText = (element: HTMLElement) => {
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(element)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

const handleInput = (e: any) => {
  emit('input', props.element, e.target.innerHTML)
}

const handleKeydown = (e: any) => {
  if (e.keyCode == ctrlKey) {
    isCtrlDown.value = true
  } else if (isCtrlDown.value && canEdit.value && keycodes.includes(e.keyCode)) {
    e.stopPropagation()
  } else if (e.keyCode == 46) {
    // deleteKey
    e.stopPropagation()
  }
}

const handleKeyup = (e: any) => {
  if (e.keyCode == ctrlKey) {
    isCtrlDown.value = false
  }
}

const handleMousedown = (e: any) => {
  if (canEdit.value) {
    e.stopPropagation()
  }
}

const clearStyle = (e: any) => {
  e.preventDefault()
  const clp = e.clipboardData
  const text = clp.getData('text/plain') || ''
  if (text !== '') {
    document.execCommand('insertText', false, text)
  }

  emit('input', props.element, e.target.innerHTML)
}

const handleBlur = (e: any) => {
  const target = e?.target as HTMLElement | null
  if (!target) {
    canEdit.value = false
    return
  }
  props.element.propValue = target.innerHTML || '&nbsp;'
  const html = target.innerHTML
  if (html !== '') {
    props.element.propValue = target.innerHTML
  } else {
    props.element.propValue = ''
    nextTick(() => {
      props.element.propValue = '&nbsp;'
    })
  }
  canEdit.value = false
}

onMounted(() => {
  eventBus.on('componentClick', (id) => {
    // 点击画布时不取消组件编辑状态，点击其他组件时取消当前组件编辑状态
    if (id !== props.element.id) {
      handleBlur({ target: text.value })
    }
  })
})
</script>

<style lang="scss" scoped>
.v-text {
  width: 100%;
  height: 100%;
  display: table;

  div {
    display: table-cell;
    width: 100%;
    height: 100%;
    outline: none;
    word-break: break-all;
    padding: 4px;
  }

  .canEdit {
    cursor: text;
    height: 100%;
  }
}

.preview {
  user-select: none;
}
</style>
