<script lang="ts">
  import CommonCss from './CommonCss.svelte'
  import { objectFromEntries } from './utils'

  type T = $$Generic<string>
  export let values: readonly T[]
  export let titles: Partial<Record<string, string>> = {}
  export let selected: Partial<Record<T, boolean>> = objectFromEntries(values.map((value) => [value, false]))
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }
</script>

<div class={`root ${klass}`} {style} {...$$restProps}>
  {#each values as value (value)}
    <button class:selected={selected[value]} type="button" on:click={() => (selected[value] = !selected[value])}>
      {titles[value] ?? value}
    </button>
  {/each}
</div>

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
