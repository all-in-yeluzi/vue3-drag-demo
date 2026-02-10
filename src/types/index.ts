export interface CanvasStyleData {
  width: number
  height: number
  scale: number
  color: string
  opacity: number
  background: string
  fontSize: number
}

export interface ComponentStyle {
  width: number
  height: number
  top: number
  left: number
  rotate: number
  padding?: number
  [key: string]: any // Allow other style properties
}

export interface ComponentRequest {
  method: string
  data: any[]
  url: string
  series: boolean
  time: number
  paramType: string
  requestCount: number
}

export interface ComponentLinkage {
  duration: number
  data: {
    id: string
    label: string
    event: string
    style: { key: string; value: string }[]
  }[]
}

export interface Component {
  id?: string
  component: string
  label: string
  icon: string
  propValue: any
  style: ComponentStyle
  category?: string // 组件分类
  subcategory?: string // 组件子分类
  request?: ComponentRequest
  animations?: any[]
  events?: Record<string, any>
  groupStyle?: any
  isLock?: boolean
  collapseName?: string
  linkage?: ComponentLinkage
  [key: string]: any // Allow flexible properties
}

export interface AreaData {
  style: {
    top: number
    left: number
    width: number
    height: number
  }
  components: Component[]
}

export interface CopyData {
  data: Component
  index: number
}
