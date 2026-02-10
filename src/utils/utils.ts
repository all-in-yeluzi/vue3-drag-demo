export function deepCopy(target: any, map = new WeakMap()): any {
  if (typeof target === 'object' && target !== null) {
    // 处理循环引用
    if (map.has(target)) {
      return map.get(target)
    }

    const result: any = Array.isArray(target) ? [] : {}
    map.set(target, result)

    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        if (typeof target[key] === 'object' && target[key] !== null) {
          result[key] = deepCopy(target[key], map)
        } else {
          result[key] = target[key]
        }
      }
    }

    return result
  }

  return target
}

export function swap(arr: any[], i: number, j: number) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

export function $(selector: string): HTMLElement {
  return document.querySelector(selector) as HTMLElement
}

const components = ['VText', 'RectShape', 'CircleShape']
export function isPreventDrop(component: string) {
  return !components.includes(component) && !component.startsWith('SVG')
}
