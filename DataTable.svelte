<script context="module" lang="ts">
  export type Column =
    | string
    | { id: string; title?: string; sortable?: boolean; width?: string; align?: 'left' | 'center' | 'right' }

  export type SortingState = { columnId: string; reversed: boolean }
</script>

<script lang="ts">
  import _ from 'lodash'
  import CommonCss from './CommonCss.svelte'
  import DataTableCell from './DataTableCell.svelte'
  import Divider from './Divider.svelte'
  import IconButton from './IconButton.svelte'
  import SortButton from './SortButton.svelte'
  import chevronLeftIcon from './chevron-left.svg'
  import chevronRightIcon from './chevron-right.svg'
  import pageFirstIcon from './page-first.svg'
  import pageLastIcon from './page-last.svg'
  import { isNestedClickEvent, objectEntries } from './utils'

  // TODO: slotのlet変数の型を処理系が認識できるようにする

  type Row = $$Generic<Record<string, unknown>>

  export let rows: readonly Row[] = []
  export let columns: readonly Column[] = []
  /**
   * 全ページの合計のデータ件数。
   * バックエンドでページネーションする場合はこのPropsに数値を設定しなければならない。
   * 値がundefinedの場合はフロントエンドでページネーションを行う。
   */
  export let totalRowsCount: number | undefined = undefined
  export let sortingState: SortingState | undefined = undefined
  /** ページネーションで1ページに表示する項目の数。undefinedの場合はページネーションが無効化される */
  export let pageSize: number | undefined = undefined
  export let rowHref: ((row: Row) => string) | undefined = undefined
  export let onClickRow: ((row: Row) => unknown) | undefined = undefined
  /**
   * ページ移動ボタンが押下された際に呼ばれるコールバック関数。
   * バックエンドでページネーションする場合はこの関数内でAPIを呼び直してDataTableを再描画する設計を想定。
   */
  export let onChangeCurrentPageIndex: ((pageIndex: number) => unknown) | undefined = undefined
  /**
   * カラムのソートボタンが押下された際に呼ばれるコールバック関数。
   * バックエンドでページネーションする場合はこの関数内でAPIを呼び直してDataTableを再描画する設計を想定。
   */
  export let onChangeSortingState: ((sortingState: SortingState) => unknown) | undefined = undefined
  export let style: string | undefined = undefined
  /** rowsの内容が変わった時（例えば検索機能でフィルタリングされた時）にページ番号をリセットする必要がある*/
  export let currentPageIndex: number = 0

  let klass = ''
  export { klass as class }

  /**
   * ページネーションをバックエンドで行う場合はtrue。
   * この変数がtrueの場合、ページ移動ボタンやカラムのソートボタンを押下してもDataTable内の状態は変化せず、
   * onChangeCurrentPageIndexやonChangeSortingStateが呼ばれるのみになる。
   */
  $: isBackendPagination = totalRowsCount !== undefined
  $: rowsCount = totalRowsCount ?? rows.length
  $: isRowClickable = onClickRow || rowHref
  $: sortedRows = isBackendPagination ? rows : sort(rows, sortingState)
  // 最後のページのindex。つまりページ数 - 1
  $: lastPageIndex = rowsCount === 0 ? 0 : Math.ceil(rowsCount / pageSize) - 1

  $: if (lastPageIndex < currentPageIndex) currentPageIndex = lastPageIndex

  $: currentPageRows = (() => {
    if (pageSize === undefined || isBackendPagination) return sortedRows

    return sortedRows.slice(currentPageIndex * pageSize, currentPageIndex * pageSize + pageSize)
  })()

  $: templateColumns = `max-content ${columns.map(getColumnWidth).join(' max-content ')} max-content`

  function sort(rows: readonly Row[], sorted: { columnId: string; reversed: boolean } | undefined): readonly Row[] {
    const result = rows.slice()
    if (sorted === undefined) return result

    const targetColumn = columns.find((column) => getColumnId(column) === sorted.columnId)
    if (targetColumn === undefined) return result
    const targetColumnId = getColumnId(targetColumn)

    result.sort((row1, row2) => {
      const value1 = row1[targetColumnId]
      const value2 = row2[targetColumnId]

      if (typeof value1 === 'number' && typeof value2 === 'number') {
        return value1 - value2
      }
      if (typeof value1 === 'bigint' && typeof value2 === 'bigint') {
        return Number(value1 - value2)
      }
      if (typeof value1 === 'boolean' && typeof value2 === 'boolean') {
        // trueが上、falseが下に並ぶ
        return (value1 ? 0 : 1) - (value2 ? 0 : 1)
      }

      return String(value1).localeCompare(String(value2))
    })

    if (sorted.reversed) {
      result.reverse()
    }

    return result
  }

  function getColumnId(column: Column): string {
    if (typeof column === 'string') return column

    return column.id
  }

  function getColumnTitle(column: Column): string {
    if (typeof column === 'string') return column

    return column.title ?? column.id
  }

  function getColumnSortable(column: Column): boolean {
    if (typeof column === 'string') return false

    return column.sortable ?? false
  }

  function getColumnWidth(column: Column): string {
    if (typeof column === 'string') return 'auto'

    return column.width ?? 'auto'
  }

  function getColumnAlign(column: Column, rows: readonly Row[]): 'left' | 'center' | 'right' {
    if (typeof column !== 'string' && column.align) return column.align

    const aligns = rows.map((row) => {
      switch (typeof row[getColumnId(column)]) {
        case 'bigint':
        case 'number':
          return 'right'
        case 'boolean':
          return 'center'
        default:
          return 'left'
      }
    })
    const counts: Record<'left' | 'center' | 'right', number> = _.countBy(aligns) as any
    return _.maxBy(objectEntries(counts), ([, value]) => value)?.[0] ?? 'left'
  }

  async function onClickSortButton(columnId: string) {
    if (sortingState?.columnId === columnId) {
      await onChangeSortingState?.({ columnId, reversed: !sortingState.reversed })
      if (!isBackendPagination) {
        sortingState.reversed = !sortingState.reversed
      }
    } else {
      await onChangeSortingState?.({ columnId, reversed: false })
      if (!isBackendPagination) {
        sortingState = { columnId, reversed: false }
      }
    }
  }

  async function toFirstPage() {
    await onChangeCurrentPageIndex?.(0)
    if (!isBackendPagination) {
      currentPageIndex = 0
    }
  }

  async function toPrevPage() {
    await onChangeCurrentPageIndex?.(currentPageIndex - 1)
    if (!isBackendPagination) {
      currentPageIndex--
    }
  }

  async function toNextPage() {
    await onChangeCurrentPageIndex?.(currentPageIndex + 1)
    if (!isBackendPagination) {
      currentPageIndex++
    }
  }

  async function toLastPage() {
    await onChangeCurrentPageIndex?.(lastPageIndex)
    if (!isBackendPagination) {
      currentPageIndex = lastPageIndex
    }
  }
</script>

<div
  class="root {klass}"
  class:row-clickable={isRowClickable}
  {style}
  style:--template-columns={templateColumns}
  style:--column-count={columns.length}
>
  <div class="table">
    <div class="horizontal-ruled-line">
      <slot name="horizontal-ruled-line" rowIndex={0} />
    </div>

    <div class="header-row">
      {#each columns as column, columnIndex}
        <div class="vertical-ruled-line">
          <slot name="vertical-ruled-line" rowIndex={0} {columnIndex} />
        </div>

        {@const columnId = getColumnId(column)}
        {@const columnTitle = getColumnTitle(column)}
        <div class="cell" data-column-id={columnId} data-align={getColumnAlign(column, currentPageRows)}>
          <slot name="header-cell" {columnId} {columnTitle} {columnIndex}>
            {columnTitle}
          </slot>
          {#if getColumnSortable(column)}
            <SortButton
              sorted={sortingState?.columnId === columnId}
              reversed={sortingState?.columnId === columnId && sortingState.reversed}
              onClick={() => onClickSortButton(columnId)}
            />
          {/if}
        </div>
      {/each}

      <div class="vertical-ruled-line">
        <slot name="vertical-ruled-line" rowIndex={0} columnIndex={columns.length} />
      </div>
    </div>

    {#each currentPageRows as row, index}
      {@const rowIndex = index + 1}
      <div class="horizontal-ruled-line">
        <slot name="horizontal-ruled-line" {rowIndex}>
          <Divider color={rowIndex === 1 ? 'var(--line_color_black)' : '  var(--line_color_gray)'} />
        </slot>
      </div>

      <a
        class="body-row"
        href={rowHref?.(row)}
        on:click={(event) => {
          if (rowHref && isNestedClickEvent(event)) {
            // 例えば行内のボタン押下時に画面遷移を暴発させないために必要
            event.preventDefault()
            return
          }

          return onClickRow?.(row)
        }}
      >
        {#each columns as column, columnIndex}
          <div class="vertical-ruled-line">
            <slot name="vertical-ruled-line" {rowIndex} {columnIndex} />
          </div>

          {@const columnId = getColumnId(column)}
          {@const value = row[columnId]}
          <div class="cell" data-column-id={columnId} data-align={getColumnAlign(column, currentPageRows)}>
            <slot name="cell" {row} {columnId} {value} {rowIndex} {columnIndex}>
              <DataTableCell {value} />
            </slot>
          </div>
        {/each}

        <div class="vertical-ruled-line">
          <slot name="vertical-ruled-line" {rowIndex} columnIndex={columns.length} />
        </div>
      </a>
    {:else}
      <div class="horizontal-ruled-line">
        <slot name="horizontal-ruled-line" rowIndex={1}>
          <Divider color="var(--line_color_black)" />
        </slot>
      </div>
      <div class="empty-state">データがありません</div>
    {/each}

    <div class="horizontal-ruled-line">
      <slot name="horizontal-ruled-line" rowIndex={currentPageRows.length + 1}>
        <Divider color="var(--line_color_gray)" />
      </slot>
    </div>
  </div>

  {#if pageSize !== undefined}
    <div class="mt-4 grid grid-flow-col items-center justify-end gap-4">
      {#if rowsCount > 0}
        {rowsCount}件中、{1 + currentPageIndex * pageSize}~{currentPageIndex * pageSize + currentPageRows.length}件表示
      {/if}
      <IconButton src={pageFirstIcon} disabled={currentPageIndex === 0} onClick={toFirstPage} />
      <IconButton src={chevronLeftIcon} disabled={currentPageIndex === 0} onClick={toPrevPage} />
      <IconButton src={chevronRightIcon} disabled={currentPageIndex === lastPageIndex} onClick={toNextPage} />
      <IconButton src={pageLastIcon} disabled={currentPageIndex === lastPageIndex} onClick={toLastPage} />
    </div>
  {/if}
</div>

<CommonCss />

<style lang="postcss">
  .table {
    display: grid;
    grid-template-columns: var(--template-columns);
  }

  .header-row {
    display: contents;
  }

  .body-row {
    display: contents;
    /* a要素なので何も指定しないと青色とかになってしまう */
    color: inherit;

    .row-clickable & {
      cursor: pointer;
    }
  }

  .cell {
    display: flex;
    align-items: center;
    padding: 0.4em 0.7em;
    min-height: 3.5em;

    .header-row & {
      font-weight: bold;
    }

    &[data-align='center'] {
      justify-content: center;
    }

    &[data-align='right'] {
      justify-content: end;
    }

    @media (hover: hover) {
      .row-clickable .body-row:hover & {
        background-color: hsl(0 0% 97%);
      }
    }

    .row-clickable .body-row:active & {
      background-color: hsl(0 0% 95%);
    }
  }

  .horizontal-ruled-line {
    grid-column: 1 / calc(2 * var(--column-count) + 2);
  }

  .empty-state {
    @apply flex justify-center p-8 text-base;
    grid-column: 1 / calc(2 * var(--column-count) + 2);
  }
</style>
