import { App, defineAsyncComponent } from 'vue'

const components = ['CircleShape', 'Picture', 'VText', 'VButton', 'Group', 'RectShape', 'LineShape', 'VTable', 'VChart', 'VMap', 'VOrnament']

const svgs = ['SVGStar', 'SVGTriangle']

export function registerCustomComponents(app: App) {
  components.forEach((key) => {
    app.component(key, defineAsyncComponent(() => import(`@/custom-component/${key}/Component.vue`)))
    app.component(`${key}Attr`, defineAsyncComponent(() => import(`@/custom-component/${key}/Attr.vue`)))
  })

  svgs.forEach((key) => {
    app.component(key, defineAsyncComponent(() => import(`@/custom-component/svgs/${key}/Component.vue`)))
    app.component(`${key}Attr`, defineAsyncComponent(() => import(`@/custom-component/svgs/${key}/Attr.vue`)))
  })
}
