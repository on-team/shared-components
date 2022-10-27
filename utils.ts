import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

/**
 * いわゆるタグ付きユニオン型を定義するためのユーティリティ。
 * 代数的データ型と違って再帰的なデータ型は定義できない。
 * @example
 * DiscriminatedUnion<{ Rect: { width: number; height: number }; Circle: { radius: number } }>
 *  ↑と↓は等価な型
 * { type: 'Rect'; width: number; height: number } | { type: 'Circle'; radius: number }
 */
export type DiscriminatedUnion<T, K extends keyof T = keyof T> = K extends K ? { type: K } & T[K] : never

/** 与えられたURL（相対パス可）が別ドメインのものかどうかを判定する */
export function isExternalUrl(url: string): boolean {
  const absoluteUrl = new URL(url, location.origin)
  return absoluteUrl.origin !== location.origin
}

/**
 * Svelteのclassディレクティブはコンポーネントにclass Propsを用意しても使えないので、
 * 例えば
 * class:invisible={i === 0}
 * の代わりに
 * classes={{ invisible: i === 0 }}
 * のように使うclasses Propsを用意しておき、この関数で1つの文字列にする。
 */
export function joinClasses(classes: Record<string, unknown> | undefined): string {
  return Object.entries(classes ?? {})
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key)
    .join(' ')
}

/**
 *
 * @param from {number} 連番の最初の数字
 * @param to {number} 最後の数字
 * @example range(1, 3) # => [1, 2, 3]
 */
export function range(from: number, to: number, step = 1): number[] {
  const arr = []
  for (let i = from; i <= to; i += step) arr.push(i)
  return arr
}

/** Object.fromEntriesの型を改善しただけの関数 */
export function objectFromEntries<K extends string, T>(entries: Iterable<readonly [K, T]>): Record<K, T> {
  return Object.fromEntries(entries) as Record<K, T>
}

export function lockBodyScroll(element: HTMLElement) {
  disableBodyScroll(element)

  return {
    destroy() {
      enableBodyScroll(element)
    },
  }
}
