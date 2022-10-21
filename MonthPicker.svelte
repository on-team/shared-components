<script lang="ts">
  import Button from './Button.svelte'
  import CommonCss from './CommonCss.svelte'
  import { range } from './utils'

  /**
   * 月が選択されたら呼ばれるコールバック関数。
   * 例えば1月が選択されたら引数は1。
   */
  export let onSelect: ((month: number) => unknown) | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }
</script>

<div class="root {klass}" {style}>
  <slot {onSelect}>
    {#each range(1, 12) as month}
      <Button color="achromatic" ghost onClick={() => onSelect?.(month)}>
        <slot name="button-text" {month} {onSelect}>{month}月</slot>
      </Button>
    {/each}
  </slot>
</div>

<CommonCss />

<style lang="postcss">
  .root {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 0.5em;
    width: max-content;
  }
</style>
