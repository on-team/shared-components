<script lang="ts">
  import CommonCss from './CommonCss.svelte'

  type T = $$Generic<string>
  export let values: readonly T[]
  export let titles: Partial<Record<string, string>> = {}
  /**
   * 選択中の選択肢をvalues内の値で表す配列。
   * 新しく選択された選択肢が配列の末尾に追加される。
   */
  export let selected: T[] | undefined = []
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  function onChange(event: Event, value: T) {
    if (event.target instanceof HTMLInputElement) {
      if (event.target.checked) {
        selected = [...(selected ?? []), value]
      } else {
        selected = selected?.filter((x) => x !== value)
      }
    }
  }
</script>

<div class={`root ${klass}`} {style} {...$$restProps}>
  {#each values as value (value)}
    <label class="button" class:selected={selected?.includes(value)}>
      <input
        type="checkbox"
        class="checkbox"
        checked={selected?.includes(value)}
        on:change={(event) => onChange(event, value)}
      />
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
      @apply border-none text-white;
      background-color: var(--tt_color_gray);
    }
  }

  .checkbox {
    appearance: none;
  }
</style>
