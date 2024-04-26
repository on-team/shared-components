import { writable } from 'svelte/store'

const getPageSizeFromLocalStorage = () => {
  const storedPageSize = localStorage.getItem('pagination')
  return storedPageSize ? parseInt(storedPageSize, 10) : 10
}

export const paginationStore = writable({
  pageSize: getPageSizeFromLocalStorage(),
})

export const updatePageSize = (newPageSize: number) => {
  localStorage.setItem('pagination', newPageSize.toString())
  paginationStore.update((state) => ({
    ...state,
    pageSize: newPageSize,
  }))
}
