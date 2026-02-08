import { ElMessage } from 'element-plus'

export default function toast(message = '', type: 'success' | 'warning' | 'info' | 'error' = 'error', duration = 1500) {
  ElMessage({
    message,
    type,
    duration,
  })
}
