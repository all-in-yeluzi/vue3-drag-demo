<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
import eventBus from '@/utils/eventBus'

export default defineComponent({
  props: {
    linkage: {
      type: Object,
      default: () => ({}),
    },
    element: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const changeStyle = (data: any[] = []) => {
      data.forEach((item) => {
        item.style.forEach((e: any) => {
          if (e.key) {
            props.element.style[e.key] = e.value
          }
        })
      })
    }

    const onClick = (componentId: any) => {
      const data = props.linkage.data.filter((item: any) => item.id === componentId && item.event === 'v-click')
      changeStyle(data)
    }

    const onHover = (componentId: any) => {
      const data = props.linkage.data.filter((item: any) => item.id === componentId && item.event === 'v-hover')
      changeStyle(data)
    }

    onMounted(() => {
      if (props.linkage?.data?.length) {
        eventBus.on('v-click', onClick)
        eventBus.on('v-hover', onHover)
      }

      const { data, duration } = props.linkage || {}
      if (data?.length) {
        const el = document.querySelector(`#component${props.element.id}`) as HTMLElement
        if (el) {
          el.style.transition = `all ${duration}s`
        }
      }
    })

    onBeforeUnmount(() => {
      if (props.linkage?.data?.length) {
        eventBus.off('v-click', onClick)
        eventBus.off('v-hover', onHover)
      }
    })
  },
})
</script>
