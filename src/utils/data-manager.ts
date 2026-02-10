import { useMainStore } from '@/store'
import { request } from '@/utils/request'
import { ElMessage } from 'element-plus'

// Define a type for the cancellation function
type CancelFunction = () => void

class DataManager {
  private static instance: DataManager
  private activeRequests: Map<string, CancelFunction> = new Map()

  private constructor() {}

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  /**
   * Register a component for data fetching
   * @param component The component configuration object
   * @param isEditor Whether running in editor mode (disables polling)
   */
  public registerComponent(component: any, isEditor: boolean = false) {
    if (!component.request || !component.request.url) return

    // Cancel existing request for this component if any
    this.unregisterComponent(component.id)

    const requestOptions = { ...component.request }
    if (isEditor) {
      requestOptions.series = false // Disable polling in editor
    }

    const cancel = this.startRequestLoop(component, requestOptions)
    if (cancel) {
      this.activeRequests.set(component.id, cancel)
    }
  }

  /**
   * Unregister a component and stop its pending requests/polling
   * @param componentId 
   */
  public unregisterComponent(componentId: string) {
    const cancel = this.activeRequests.get(componentId)
    if (cancel) {
      cancel()
      this.activeRequests.delete(componentId)
    }
  }

  /**
   * Clear all active requests
   */
  public clearAll() {
    this.activeRequests.forEach((cancel) => cancel())
    this.activeRequests.clear()
  }

  /**
   * Manually fetch data for a component immediately
   */
  public async fetchOne(component: any) {
    if (!component.request || !component.request.url) return
    const requestOptions = { ...component.request, series: false }
    await this.fetchData(component, requestOptions)
  }

  private startRequestLoop(component: any, options: any): CancelFunction {
    let timer: any = null
    let count = 0
    let isCancelled = false

    const run = async () => {
      if (isCancelled) return

      await this.fetchData(component, options)

      if (options.series && !isCancelled) {
         // Check request count limit
        if (options.requestCount != 0 && options.requestCount <= count) {
          return
        }
        
        timer = setTimeout(async () => {
          count++
          await run()
        }, options.time)
      }
    }

    run()

    return () => {
      isCancelled = true
      if (timer) clearTimeout(timer)
    }
  }

  private async fetchData(component: any, options: any) {
    try {
      // Use the existing request utility which returns a Promise
      // Note: We are bypassing the old requestWrapper to control the store update ourselves
      const response: any = await this.rawRequest(options)
      
      // Determine path and value based on component type
      let path = 'propValue'
      let value = response

      // Parse JSON if needed (request utils usually return JSON object if parsed, or string)
      // The existing request implementation in utils/request.ts:
      // resolve(e.target.response) -> usually string
      // getURLData/getURLParam suggests it handles some logic.
      // Let's look at how requestWrapper handled it:
      // obj[key] = JSON.parse(data) if responseType is object/array
      
      let parsedData = value
      if (typeof value === 'string') {
        try {
           parsedData = JSON.parse(value)
        } catch (e) {
           // keep as string
        }
      }

      // 数据过滤逻辑
      if (component.request && component.request.dataHandler) {
        try {
          // 用户自定义过滤脚本: function(data) { ... }
          // 这里假定用户只填写函数体，如 "return data.data"
          const handler = new Function('data', component.request.dataHandler)
          const result = handler(parsedData)
          // 只有当返回 undefined 时才认为是无操作（或者用户忘了return），否则使用返回值
          if (result !== undefined) {
            parsedData = result
          }
        } catch (e: any) {
          console.error(`Data filter error for component ${component.id}:`, e)
          ElMessage.warning(`数据过滤脚本执行出错: ${e.message}`)
        }
      } else {
        // 默认行为：自动解包常见的 API 响应格式 { code: 0, data: [...] }
        if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData) && 'data' in parsedData) {
           parsedData = parsedData.data
        }
      }

      if (component.component === 'VChart') {
        // 如果数据是数组，更新 data 字段（支持字段映射）
        // 如果数据是对象且包含 series/xAxis，更新 option 字段（兼容旧模式）
        if (Array.isArray(parsedData)) {
          path = 'data'
        } else if (parsedData && typeof parsedData === 'object' && ('series' in parsedData || 'xAxis' in parsedData)) {
          path = 'option'
        } else {
          // 默认情况，如果无法识别，更新 data 尝试让组件处理
          path = 'data'
        }
      } else if (component.component === 'VTable') {
        path = 'data'
      }

      // Update Store
      const store = useMainStore()
      store.updateComponentProps(component.id, path, parsedData)
      
    } catch (err: any) {
      console.error(`Failed to fetch data for component ${component.id}:`, err)
      ElMessage.error(err?.message || 'Data fetch error')
    }
  }

  private async rawRequest(options: any) {
    return request(options)
  }
}

export default DataManager.getInstance()
