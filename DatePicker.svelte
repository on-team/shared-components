<script lang="ts">
  import dayjs, { Dayjs } from 'dayjs'
  import chevronLeftIcon from './chevron-left.svg'
  import chevronRightIcon from './chevron-right.svg'
  import CommonCss from './CommonCss.svelte'
  import IconButton from './IconButton.svelte'

  export let selectedDate: Dayjs | undefined = undefined
  export let selectedMonth: Dayjs = dayjs()
  /** 特定の日付を選択不能(disabled状態)にする述語。関数がtrueを返す日付のセルはdisabled状態になる */
  export let disable: ((date: Dayjs) => boolean) | undefined = undefined
  export let onSelect: ((date: Dayjs) => unknown) | undefined = undefined
  export let style: string | undefined = undefined
  let klass: string = ''
  export { klass as class }

  const dayNames = ['日', '月', '火', '水', '木', '金', '土']

  $: firstDateOfSelectedMonth = selectedMonth.date(1)
  $: firstDateOfSelectedMonthCal = firstDateOfSelectedMonth.subtract(firstDateOfSelectedMonth.day(), 'day')

  function onClickDate(date: Dayjs) {
    selectedDate = date
    onSelect?.(date)
  }
</script>

<div class="root {klass}" {style}>
  <div class="year-month-area">
    <IconButton
      src={chevronLeftIcon}
      onClick={() => (selectedMonth = selectedMonth.subtract(1, 'month'))}
      size="1.9em"
    />
    <div class="year-month">
      <span class="year">
        {selectedMonth.format('YYYY')}年
      </span>
      <span class="month">
        {selectedMonth.format('M')}月
      </span>
    </div>
    <IconButton src={chevronRightIcon} onClick={() => (selectedMonth = selectedMonth.add(1, 'month'))} size="1.9em" />
  </div>

  <div class="grid">
    <div class="day-row">
      {#each dayNames as dayName, day}
        <div class="cell" data-day={day}>
          {dayName}
        </div>
      {/each}
    </div>

    {#each Array(6) as _, weakIndex}
      <div class="date-row">
        {#each dayNames as _, day}
          {@const date = firstDateOfSelectedMonthCal.add(weakIndex, 'week').add(day, 'day')}
          <button
            class="cell"
            class:selected={selectedDate?.isSame(date, 'date')}
            class:next-month={date.isAfter(selectedMonth, 'month')}
            class:prev-month={date.isBefore(selectedMonth, 'month')}
            type="button"
            disabled={Boolean(disable?.(date))}
            data-day={day}
            on:click={() => onClickDate(date)}
          >
            {date.date()}
          </button>
        {/each}
      </div>
    {/each}
  </div>
</div>

<CommonCss />

<style lang="postcss">
  .root {
    width: max-content;
  }

  .year-month-area {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin: 0 1em;
  }

  .year-month {
    @apply text-lg font-bold;
    color: var(--tt_color_black);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, auto);
    width: max-content;
  }

  .day-row,
  .date-row {
    display: contents;
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    --cell-size: 2.1em;
    width: var(--cell-size);
    height: var(--cell-size);

    font-size: 18px;

    .day-row & {
      color: hsl(0 0% 50%);

      &[data-day='0'] {
        color: hsl(5 35% 50%);
      }

      &[data-day='6'] {
        color: hsl(220 35% 50%);
      }
    }

    .date-row & {
      @media (hover: hover) {
        &:hover {
          background-color: hsl(0 0% 96%);
        }
      }

      &:active {
        background-color: hsl(0 0% 92%);
      }

      &.next-month,
      &.prev-month {
        color: hsl(0 0% 60%);
      }

      &.selected {
        @apply text-white;
        background-color: var(--main_color);
      }

      &:disabled {
        color: hsl(0 0% 85%);
      }
    }
  }
</style>
