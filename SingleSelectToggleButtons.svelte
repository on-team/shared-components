<script lang="ts">
  import _ from 'lodash'
  import { Readable } from 'svelte/store'
  import CommonCss from './CommonCss.svelte'

  type Value = $$Generic<string>

  export let values: Value[]
  export let selected: Value | undefined = undefined
  export let titles: Record<string, string> = {}
  export let name: string | undefined = undefined
  /** Felteのerrorsオブジェクト。正しい型を書くのが難しい割にメリットが乏しいのでanyを使っている */
  export let errors: Readable<any> | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  $: errorMessage = _.get($errors, name, null)?.[0]
</script>

<div class={`root ${klass}`} {style} {...$$restProps}>
  {#each values as value (value)}
    <button class:selected={value === selected} type="button" on:click={() => (selected = value)}>
      {titles[value] ?? value}
    </button>
  {/each}
</div>
<!-- Felte用の不可視input要素 -->
<input type="hidden" {name} value={selected} />

{#if errorMessage}
  <div class="text-sm text-attention mt-2">
    {errorMessage}
  </div>
{/if}

<CommonCss />

<style lang="postcss">
  .root {
    @apply grid grid-flow-col gap-2;
    grid-auto-columns: 1fr;
  }

  button {
    @apply h-9 rounded;
    border: 1px solid var(--liff_line_color);

    &.selected {
      @apply border-none bg-text-gray text-white;
    }
  }
</style>
