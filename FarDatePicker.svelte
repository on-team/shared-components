<script lang="ts">
  import dayjs, { Dayjs } from 'dayjs'
  import CommonCss from './CommonCss.svelte'
  import DatePicker from './DatePicker.svelte'
  import MonthPicker from './MonthPicker.svelte'
  import YearPicker from './YearPicker.svelte'

  export let date = dayjs()
  export let onSelect: ((date: Dayjs) => unknown) | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  let internalDate = dayjs(date)

  let step: 0 | 1 | 2 = 0

  function onSelectYear(year: number) {
    internalDate = internalDate.year(year)
    step++
  }

  function onSelectMonth(month: number) {
    internalDate = internalDate.month(month - 1)
    step++
  }

  function onSelectDate(selectedDate: Dayjs) {
    date = selectedDate
    onSelect?.(date)
  }
</script>

<div class="root {klass}" {style}>
  {#if step === 0}
    <h4 class="title">西暦を選択</h4>
    <YearPicker onSelect={onSelectYear} />
  {:else if step === 1}
    <h4 class="title">月を選択</h4>
    <MonthPicker onSelect={onSelectMonth} />
  {:else}
    <DatePicker selectedMonth={internalDate} onSelect={onSelectDate} />
  {/if}
</div>

<CommonCss />

<style lang="postcss">
  .root {
    width: max-content;
  }

  .title {
    text-align: center;
    color: hsl(0 0% 40%);
    font-size: 16px;
    margin: 0.7em;
  }
</style>
