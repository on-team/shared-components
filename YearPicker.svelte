<script lang="ts">
  import Button from './Button.svelte'
  import CommonCss from './CommonCss.svelte'
  import Foldable from './Foldable.svelte'
  import { range } from './utils'

  /** 年の選択肢のうち最大のもの */
  export let maxYear = new Date().getFullYear()
  /** 年の選択肢のうち最小のもの */
  export let minYear = maxYear - 120
  /** 年の選択肢はこのサイズごとに区切られ、アコーディオン形式で表示される */
  export let periodSize = 30
  /**
   * 特の選択肢の区間分割の基準（開始地点）となる年。
   * @example
   * もしbaseYearが1900でperiodSizeが30の場合、
   * 各区間の開始年は例えば1900 ~ 1930 ~ 1960 ~ 1990のような感じになる。
   * もしbaseYearが2000でperiodSizeが30の場合、
   * 各区間の開始年は例えば1910 ~ 1940 ~ 1970 ~ 2000のような感じになる。
   */
  export let baseYear = 2000
  /**
   * この年を含む区間がアコーディオンで開かれた状態で表示される。
   * undefinedを指定した場合はアコーディオンの全区間が折りたたみ状態で表示される。
   */
  export let defaultUnfoldedYear: number | undefined = undefined
  export let onSelect: ((year: number) => unknown) | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  let unfoldedPeriod = defaultUnfoldedYear ? toPeriodYear(defaultUnfoldedYear, periodSize) : undefined

  function toPeriodYear(year: number, periodSize: number): number {
    return year - ((year - (baseYear % periodSize)) % periodSize)
  }
</script>

<div class="root {klass}" {style}>
  {#each range(toPeriodYear(minYear, periodSize), toPeriodYear(maxYear, periodSize), periodSize) as periodYear}
    {@const periodMinYear = Math.max(periodYear, toPeriodYear(minYear, 5))}
    {@const periodMaxYear = Math.min(periodYear + periodSize - 1, maxYear)}
    <Foldable class="foldable" unfolded={periodYear === unfoldedPeriod} onUnfold={() => (unfoldedPeriod = periodYear)}>
      <div slot="title" class="foldable-title">
        {periodMinYear} ~ {periodMaxYear}年
      </div>
      <div class="button-list">
        {#each range(periodMinYear, periodMaxYear) as year}
          <Button color="achromatic" variant="ghost" disabled={year < minYear} onClick={() => onSelect?.(year)}>
            {String(year % 100).padStart(2, '0')}
          </Button>
        {/each}
      </div>
    </Foldable>
  {/each}
</div>

<CommonCss />

<style lang="postcss">
  .root {
    width: max-content;

    & :global(.foldable) {
      border-radius: 0;
      background-color: hsl(0 0% 100%);
      border: var(--line_color_gray) 1px solid;

      &:not(:first-of-type) {
        border-top: none;
      }
    }
  }

  .foldable-title {
    @apply font-normal text-base;
  }

  .button-list {
    display: grid;
    grid-template-columns: repeat(5, auto);

    gap: 0.5em;
    padding: 1em 0.5em;

    background-color: hsl(0 0% 100%);
    font-size: 14px;
  }
</style>
