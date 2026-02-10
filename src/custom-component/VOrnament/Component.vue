<template>
  <div class="v-datav-wrapper" style="width: 100%; height: 100%; overflow: visible" ref="wrapperRef">
    <component
      :is="resolveComponent(propValue.component)"
      v-bind="componentProps"
      style="width: 100%; height: 100%"
    >
      <div v-if="propValue.content && !isSVGTitleEnabled" v-html="propValue.content" class="content-slot" :style="titleStyle"></div>
    </component>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, onMounted, watch } from 'vue'
import Decoration1 from './components/Decoration1.vue'
import BorderBox1 from './components/BorderBox1.vue'
import BorderBox2 from './components/BorderBox2.vue'
import BorderBox3 from './components/BorderBox3.vue'
import BorderBox4 from './components/BorderBox4.vue'
import BorderBox5 from './components/BorderBox5.vue'
import BorderBox6 from './components/BorderBox6.vue'
import BorderBox7 from './components/BorderBox7.vue'
import BorderBox8 from './components/BorderBox8.vue'
import BorderBox9 from './components/BorderBox9.vue'
import BorderBox10 from './components/BorderBox10.vue'
import BorderBox11 from './components/BorderBox11.vue'
import BorderBox12 from './components/BorderBox12.vue'
import BorderBox13 from './components/BorderBox13.vue'
import Loading from './components/Loading.vue'

const props = defineProps({
  propValue: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  element: {
    type: Object,
    default: () => ({}),
  },
})

const { propValue, element } = toRefs(props)
const wrapperRef = ref(null)
const width = ref(0)
const height = ref(0)

const componentMap: Record<string, any> = {
  'dv-decoration-1': Decoration1,
  'dv-border-box-1': BorderBox1,
  'dv-border-box-2': BorderBox2,
  'dv-border-box-3': BorderBox3,
  'dv-border-box-4': BorderBox4,
  'dv-border-box-5': BorderBox5,
  'dv-border-box-6': BorderBox6,
  'dv-border-box-7': BorderBox7,
  'dv-border-box-8': BorderBox8,
  'dv-border-box-9': BorderBox9,
  'dv-border-box-10': BorderBox10,
  'dv-border-box-11': BorderBox11,
  'dv-border-box-12': BorderBox12,
  'dv-border-box-13': BorderBox13,
  'dv-loading': Loading
}

const resolveComponent = (name: string) => {
  return componentMap[name] || 'div'
}

const isSVGTitleEnabled = computed(() => {
  return propValue.value.config && propValue.value.config.useSVGTitle
})

// Pass width/height to SVG components
const componentProps = computed(() => {
  const config = propValue.value.config || {}
  return {
    ...config,
    width: width.value,
    height: height.value,
    title: isSVGTitleEnabled.value ? propValue.value.content : undefined,
    titleFontSize: (propValue.value.titleStyle && propValue.value.titleStyle.fontSize) || 18,
    titleColor: (propValue.value.titleStyle && propValue.value.titleStyle.color) || '',
    titleFontWeight: (propValue.value.titleStyle && propValue.value.titleStyle.fontWeight) || 'normal'
  }
})

const titleStyle = computed(() => {
  const style = propValue.value.titleStyle || {}
  return {
    justifyContent: style.horizontalAlign || 'center',
    alignItems: style.verticalAlign || 'center',
    fontSize: (style.fontSize || 24) + 'px',
    color: style.color || '#fff',
    fontWeight: style.fontWeight || 'normal',
    padding: '10px'
  }
})

onMounted(() => {
  if (element.value.style) {
    width.value = element.value.style.width
    height.value = element.value.style.height
  }
})

watch(() => element.value.style, (newStyle) => {
  if (newStyle) {
    width.value = newStyle.width
    height.value = newStyle.height
  }
}, { deep: true })

</script>

<style scoped>
.v-datav-wrapper {
  overflow: hidden;
}
.content-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
}
</style>
