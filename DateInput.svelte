<script lang="ts">
  import dayjs, { Dayjs } from 'dayjs'
  import { Readable } from 'svelte/store'
  import calendarIcon from './calendar.svg'
  import CommonCss from './CommonCss.svelte'
  import DatePicker from './DatePicker.svelte'
  import Icon from './Icon.svelte'
  import Modal from './Modal.svelte'

  export let name: string = ''
  export let placeholder: string = ''
  /** YYYY/MM/DD形式 */
  export let value: string | undefined = undefined
  export let disabled = false
  /** 特定の日付を選択不能(disabled状態)にする述語。関数がtrueを返す日付のセルはdisabled状態になる */
  export let disable: ((date: Dayjs) => boolean) | undefined = undefined
  /** Felteのerrorsオブジェクト。正しい型を書くのが難しい割にメリットが乏しいのでanyを使っている */
  export let errors: Readable<any> | undefined = undefined
  export let style: string | undefined = undefined
  let klass: string = ''
  export { klass as class }

  let isDatePickerOpened = false
  $: selectedDate = value !== undefined ? dayjs(value) : undefined

  function onSelect(date: Dayjs) {
    value = date.format('YYYY/MM/DD')
    isDatePickerOpened = false
  }
</script>

<div class="root {klass}" class:disabled {style} on:click={() => disabled || (isDatePickerOpened = true)}>
  {#if value}
    <div>
      <slot {value}>{value}</slot>
    </div>
  {:else}
    <div class="text-text-lightGray">{placeholder}</div>
  {/if}
  <Icon src={calendarIcon} size="1.1em" />
  <input class="hidden" {name} {placeholder} {value} {disabled} />
</div>

{#if $errors?.[name]?.[0]}
  <div class="text-sm text-attention mt-2">
    {$errors[name][0]}
  </div>
{/if}

<Modal class="p-4" bind:opened={isDatePickerOpened}>
  <DatePicker bind:selectedDate {disable} {onSelect} />
</Modal>

<CommonCss />

<style lang="postcss">
  .root {
    @apply w-full rounded-md flex items-center justify-between bg-white;
    height: var(--one-line-input-height);
    padding: 0 0.7em;
    border: var(--tt_color_light-gray) 1px solid;
    cursor: pointer;

    &.disabled {
      @apply cursor-default;
      background-color: hsla(0, 0%, 0%, 4%);
    }
  }
</style>
