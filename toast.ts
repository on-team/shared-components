import { Readable, Writable, writable } from 'svelte/store'
import Toasts from './Toasts.svelte'

export function showToast(type: ToastModel['type'], message: string) {
  const newId = Symbol()

  toastModelsStore.update((toastModels) => {
    toastModels.push({ id: newId, message, type })
    return toastModels
  })

  // 一定時間経過したあとに削除する
  setTimeout(() => {
    toastModelsStore.update((toastModels) => toastModels.filter(({ id }) => id !== newId))
  }, 3000)

  // DOM上のToastsを削除してから追加し直す。
  // これによりToastsがDOM上に複数存在することを防ぎ、さらに他のレイヤーより上に重なって表示されるようになる。
  existingToasts?.$destroy()
  existingToasts = new Toasts({ target: document.body })
}

type ToastModel = {
  id: symbol
  message: string
  type: 'success' | 'fail'
}

const toastModelsStore: Writable<ToastModel[]> = writable([])
// 外部で書き換えられると寿命管理ができなくなるのでReadableとしてエクスポートする
const _toastModelsStore: Readable<ToastModel[]> = toastModelsStore
export { _toastModelsStore as toastModelsStore }

let existingToasts: Toasts | undefined
