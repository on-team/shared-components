<script lang="ts">
  import { Dayjs } from 'dayjs'
  import _ from 'lodash'
  import { Readable } from 'svelte/store'
  import calendarIcon from './calendar.svg'
  import FarDatePicker from './FarDatePicker.svelte'
  import Icon from './Icon.svelte'
  import Modal from './Modal.svelte'

  export let name: string = ''
  export let placeholder: string = ''
  /** YYYY/MM/DD形式 */
  export let value: string | undefined = undefined
  export let disabled = false
  export let style: string | undefined = undefined
  /** Felteのerrorsオブジェクト。正しい型を書くのが難しい割にメリットが乏しいのでanyを使っている */
  export let errors: Readable<any> | undefined = undefined
  let klass: string = ''
  export { klass as class }

  $: errorMessage = _.get($errors, name, null)?.[0]

  let isDatePickerOpened = false

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
    <div class="placeholder">{placeholder}</div>
  {/if}
  <Icon src={calendarIcon} size="1.1em" />
  <input class="hidden" {name} {placeholder} value={value ?? null} {disabled} />
</div>

{#if errorMessage}
  <div class="error-message">
    {errorMessage}
  </div>
{/if}

<Modal class="p-4" bind:opened={isDatePickerOpened}>
  <FarDatePicker {onSelect} />
</Modal>

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

  .placeholder {
    color: var(--tt_color_light-gray);
  }

  .error-message {
    @apply text-sm mt-2;
    color: var(--attention_color);
  }
</style>
