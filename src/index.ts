import { App } from 'vue'
import zvdc from '@/views/Home.vue'
import { useMainStore as useEditorStore, useMainStore } from '@/store'
import { registerCustomComponents } from '@/custom-component'

// Import styles
import '@/assets/iconfont/iconfont.css'
import '@/styles/animate.scss'
import '@/styles/reset.css'
import '@/styles/global.scss'
import '@/styles/dark.scss'

const install = (app: App) => {
  registerCustomComponents(app)
  app.component('z-vdc', zvdc)
}

// Helper to expose an imperative editor object
const createEditorAdapter = () => {
  const store = useMainStore()
  return {
    setData: (data: any[]) => store.setComponentData(data),
    getData: () => store.componentData,
    addComponent: (component: any) => store.addComponent({ component }),
    setComponentList: (list: any[]) => store.setComponentList(list),
    get store() {
      return store
    },
  }
}

export { zvdc, useEditorStore, registerCustomComponents, install, createEditorAdapter }

export default {
  install,
}
