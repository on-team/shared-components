<script lang="ts">
  import dayjs, { Dayjs } from 'dayjs'
  import _ from 'lodash'
  import { Readable } from 'svelte/store'
  import calendarIcon from './calendar.svg'
  import closeCircleIcon from './close-circle.svg'
  import CommonCss from './CommonCss.svelte'
  import DatePicker from './DatePicker.svelte'
  import Icon from './Icon.svelte'
  import IconButton from './IconButton.svelte'
  import Modal from './Modal.svelte'

  export let name: string = ''
  export let placeholder: string = ''
  /** YYYY/MM/DD形式 */
  export let value: string | undefined = undefined
  export let disabled = false
  /** 特定の日付を選択不能(disabled状態)にする述語。関数がtrueを返す日付のセルはdisabled状態になる */
  export let disable: ((date: Dayjs) => boolean) | undefined = undefined
  export let withClearButton = false
  /** Felteのerrorsオブジェクト。正しい型を書くのが難しい割にメリットが乏しいのでanyを使っている */
  export let errors: Readable<any> | undefined = undefined
  export let style: string | undefined = undefined
  let klass: string = ''
  export { klass as class }

  $: errorMessage = _.get($errors, name, null)?.[0]

  let isDatePickerOpened = false
  $: selectedDate = value !== undefined ? dayjs(value) : undefined

  function onSelect(date: Dayjs) {
    value = date.format('YYYY/MM/DD')
    isDatePickerOpened = false
  }
</script>

<button
  class="root {klass}"
  {style}
  type="button"
  {disabled}
  on:click={(event) => {
    if (event.defaultPrevented) return

    isDatePickerOpened = true
  }}
>
  {#if value}
    <div class="preview">
      <slot {value}>{value}</slot>
      {#if withClearButton && !disabled}
        <IconButton
          class="mx-1"
          src={closeCircleIcon}
          size="1.6em"
          iconSize="80%"
          tint="hsl(0 0% 80%)"
          onClick={() => (value = undefined)}
        />
      {:else}
        <div class="w-4" />
      {/if}
    </div>
  {:else}
    <div class="placeholder">{placeholder}</div>
  {/if}
  <Icon src={calendarIcon} size="1em" tint="hsl(0, 0%, 35%)" />
  <input class="hidden" {name} {placeholder} value={value ?? null} {disabled} />
</button>

{#if errorMessage}
  <div class="error-message">
    {errorMessage}
  </div>
{/if}

<Modal class="p-4" bind:opened={isDatePickerOpened}>
  <DatePicker bind:selectedDate {disable} {onSelect} />
</Modal>

<CommonCss />

<style lang="postcss">
  .root {
    @apply w-full rounded-md grid items-center bg-white text-start;
    grid-template-columns: 1fr auto;
    min-height: var(--one-line-input-height);
    padding: 0 0.7em;
    border: var(--tt_color_light-gray) 1px solid;
    cursor: pointer;

    &:disabled {
      @apply cursor-default;
      background-color: hsla(0, 0%, 0%, 4%);
    }
  }

  .preview {
    @apply flex items-center justify-between;
    grid-template-columns: 1fr auto;
  }

  .placeholder {
    color: var(--tt_color_light-gray);
  }

  .error-message {
    @apply text-sm mt-2;
    color: var(--attention_color);
  }
</style>
