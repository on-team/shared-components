<script lang="ts">
  import _ from 'lodash'
  import { Readable } from 'svelte/store'
  import checkBoldIcon from './check-bold.svg'
  import CommonCss from './CommonCss.svelte'

  export let checked: boolean = false
  export let value: string | undefined = undefined
  export let name: string | undefined = undefined
  export let disabled: boolean = false
  export let fullWidth = false
  /** Felteのerrorsオブジェクト。正しい型を書くのが難しい割にメリットが乏しいのでanyを使っている */
  export let errors: Readable<any> | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  $: errorMessage = _.get($errors, name, null)?.[0]
</script>

<label class="root {klass}" class:disabled class:full-width={fullWidth} style:--url={`url('${checkBoldIcon}')`}>
  <input
    type="checkbox"
    class="checkbox"
    {style}
    {value}
    {name}
    {disabled}
    bind:checked
    data-felte-keep-on-remove="true"
  />
  <div>
    <slot />
  </div>
</label>

{#if errorMessage}
  <div class="error-message">
    {errorMessage}
  </div>
{/if}

<CommonCss />

<style lang="postcss">
  .root {
    display: inline-grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.5em;
    vertical-align: top;

    cursor: pointer;

    &.full-width {
      @apply grid w-full;
    }

    &.disabled {
      cursor: default;

      color: hsl(0 0% 70%);
    }
  }

  .checkbox {
    appearance: none;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    --size: 1em;
    width: var(--size);
    height: var(--size);
    border-radius: 0.25em;
    margin: 0;
    border: 1px solid hsl(0 0% 84%);
    background-color: white;

    cursor: pointer;

    transition: all 140ms ease-out;

    &:checked {
      background-color: var(--main_color);
      border: none;

      .disabled & {
        background-color: hsl(0 0% 90%);
      }
    }

    .disabled & {
      cursor: default;
    }

    &::before {
      content: '';
      display: inline-block;
      --size: 90%;
      width: var(--size);
      height: var(--size);

      background-color: white;
      mask: var(--url) no-repeat center;
      mask-size: contain;
    }
  }

  .error-message {
    @apply text-sm mt-2;
    color: var(--attention_color);
  }
</style>
