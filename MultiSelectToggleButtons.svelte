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
    <label class="button" class:selected={selected[value]}>
      <input type="checkbox" class="checkbox" bind:checked={selected[value]} />
      {titles[value] ?? value}
    </label>
  {/each}
</div>

<CommonCss />

<style lang="postcss">
  .root {
    @apply grid grid-flow-col gap-2;
    grid-auto-columns: 1fr;
  }

  .button {
    @apply flex items-center justify-center px-2 py-1 rounded;
    min-height: var(--one-line-input-height);
    border: 1px solid var(--liff_line_color);

    &.selected {
      @apply border-none bg-text-gray text-white;
    }
  }

  .checkbox {
    appearance: none;
  }
</style>
