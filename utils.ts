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

/** Object.entriesの型を改善しただけの関数 */
export function objectEntries<K extends string, T>(value: Record<K, T>): readonly [K, T][] {
  return Object.entries(value) as any
}

/**
 * クリック可能な要素がネストしているとき、clickイベントを二重処理してしまう問題の対策用関数。
 * 例えば以下のようなDOM構造でbutton押下時にa要素のon:clickも実行されることが問題になる。
 * <a href={...} on:click={...}>
 *   <button on:click={...}>Inner button</button>
 *   Outer contents
 * </a>
 */
export function isNestedClickEvent(event: MouseEvent) {
  if (!(event.currentTarget instanceof Element)) return false
  if (!(event.target instanceof Element)) return false

  return detectNestedClickableElement(event.currentTarget, event.target)
}

function detectNestedClickableElement(currentTarget: Element, target: Element): boolean {
  if (currentTarget === target) return false

  if (isClickable(target)) return true

  // 原因不明の不具合の対策のための分岐。
  // 例えばrowHref付きのDataTableの行の中のIconButtonを押した場合、どういうわけかtarget.parentElementがnullになる。
  // （IconButtonの実装を確認したが、DOM構造上targetの親が無くなることは考えられない）
  // なのでこの分岐ではparentElementがnullの場合はその不具合だと判断してtrueを返す。
  if (target.parentElement === null) return true

  return detectNestedClickableElement(currentTarget, target.parentElement!)
}

function isClickable(element: Element): boolean {
  const contenteditable = element.getAttribute('contenteditable')
  if (contenteditable && contenteditable !== 'false') return true

  return (
    new Set(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'SUMMARY']).has(element.tagName) ||
    new Set([
      'link',
      'menuitem',
      'button',
      'spinbutton',
      'slider',
      'scrollbar',
      'textbox',
      'option',
      'radio',
      'menuitemradio',
      'checkbox',
      'menuitemcheckbox',
      'treeitem',
      'switch',
      'tab',
    ]).has(element.getAttribute('role') ?? '')
  )
}

export function lockBodyScroll(element: HTMLElement) {
  disableBodyScroll(element)

  return {
    destroy() {
      enableBodyScroll(element)
    },
  }
}
