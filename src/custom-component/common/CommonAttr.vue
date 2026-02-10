<template>
  <div class="v-common-attr" v-if="curComponent" @mousedown="setInitial(curComponent.style)">
    <el-collapse v-model="activeName" accordion @change="onChange">
      <el-collapse-item title="通用样式" name="style">
        <el-form>
          <el-form-item v-for="({ key, label }, index) in styleKeys" :key="index" :label="label">
            <el-color-picker v-if="isIncludesColor(key)" v-model="curComponent.style[key]" show-alpha></el-color-picker>
            <el-select v-else-if="selectKey.includes(key)" v-model="curComponent.style[key]">
              <el-option
                v-for="item in optionMap[key]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-else-if="key == 'fontSize' && curComponent.component == 'VText'"
              v-model.number="curComponent.style[key]"
              type="number"
              @input="setFontSize"
            />
            <el-input v-else v-model.number="curComponent.style[key]" type="number" />
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <Request v-if="curComponent.request"></Request>
      <Linkage v-if="curComponent.linkage"></Linkage>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { styleData, selectKey, optionMap } from '@/utils/attr'
import Request from './Request.vue'
import Linkage from './Linkage.vue'

const store = useMainStore()
const { curComponent } = storeToRefs(store)

const activeName = ref(curComponent.value ? curComponent.value.collapseName : '')
const initialStyle = ref<any>(null)

const styleKeys = computed(() => {
  if (curComponent.value) {
    const curComponentStyleKeys = Object.keys(curComponent.value.style)
    return styleData.filter((item) => curComponentStyleKeys.includes(item.key))
  }

  return []
})

watch(curComponent, (val) => {
  if (val) {
    activeName.value = val.collapseName
  }
})

const setInitial = (style: any) => {
  initialStyle.value = JSON.parse(JSON.stringify(style))
}

const setFontSize = () => {
  if (!curComponent.value) return
  const proportion = curComponent.value.style.fontSize / initialStyle.value.fontSize
  const updatedStyle = {
    width: Number((proportion * initialStyle.value.width).toFixed(4)),
    height: Number((proportion * initialStyle.value.height).toFixed(4)),
    padding: Number((proportion * initialStyle.value.padding).toFixed(4)),
  }
  curComponent.value.style = { ...curComponent.value.style, ...updatedStyle }
  store.setShapeStyle(curComponent.value.style)
  store.recordSnapshot()
}

const onChange = () => {
  if (curComponent.value) {
    curComponent.value.collapseName = activeName.value
  }
}

const isIncludesColor = (str: string) => {
  return str.toLowerCase().includes('color')
}
</script>

<style lang="scss">
.v-common-attr {
  .el-input-group__prepend {
    padding: 0 10px;
  }
}
</style>
