<template>
  <div class="event-list">
    <div class="div-events">
      <el-button @click="isShowEvent = true">添加事件</el-button>
      <div>
        <el-tag v-for="event in Object.keys(curComponent.events)" :key="event" closable @close="removeEvent(event)">
          {{ event }}
        </el-tag>
      </div>
    </div>

    <!-- 选择事件 -->
    <Modal v-model="isShowEvent">
      <el-tabs v-model="eventActiveName">
        <el-tab-pane
          v-for="item in eventList"
          :key="item.key"
          :label="item.label"
          :name="item.key"
          style="padding: 40px 20px 0"
        >
          <el-input
            v-if="item.key == 'redirect'"
            v-model="item.param"
            type="textarea"
            placeholder="请输入完整的 URL"
            @keydown.stop
          />
          <el-input
            v-if="item.key == 'alert'"
            v-model="item.param"
            type="textarea"
            placeholder="请输入要 alert 的内容"
            @keydown.stop
          />
          <el-button style="margin-top: 20px" @click="addEvent(item.key, item.param)">确定</el-button>
        </el-tab-pane>
      </el-tabs>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import Modal from '@/components/Modal.vue'
import { eventList } from '@/utils/events'

const store = useMainStore()
const { curComponent } = storeToRefs(store)

const isShowEvent = ref(false)
const eventActiveName = ref('redirect')

const addEvent = (event: string, param: any) => {
  isShowEvent.value = false
  store.addEvent({ event, param })
}

const removeEvent = (event: string) => {
  store.removeEvent(event)
}
</script>

<style lang="scss" scoped>
.event-list {
  .div-events {
    text-align: center;
    padding: 0 20px;

    .el-button {
      display: inline-block;
      margin-bottom: 10px;
    }

    .el-tag {
      display: block;
      width: 50%;
      margin: auto;
      margin-bottom: 10px;
    }
  }
}
</style>
