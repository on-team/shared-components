<script lang="ts">
  import _ from 'lodash'
  import { Readable } from 'svelte/store'
  import Checkbox from './Checkbox.svelte'
  import CommonCss from './CommonCss.svelte'

  type T = $$Generic<string>
  export let values: readonly T[]
  export let titles: Partial<Record<string, string>> = {}
  export let selected: T[] | undefined = []
  export let name: string | undefined = undefined
  export let layout: 'horizontal' | 'vertical' = 'vertical'
  export let gap: string = '0.1em 1.6em'
  export let gridColumnsCount: number | undefined = undefined
  export let disabled: boolean = false
  /** Felteのerrorsオブジェクト。正しい型を書くのが難しい割にメリットが乏しいのでanyを使っている */
  export let errors: Readable<any> | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  $: errorMessage = _.get($errors, name, null)?.[0]
</script>

<div
  class={`root ${klass}`}
  class:hasGridColumnsCount={gridColumnsCount !== undefined}
  {style}
  style:--gap={gap}
  style:--grid-columns-count={gridColumnsCount}
  data-layout={layout}
>
  {#each values as value}
    <Checkbox fullWidth checked={selected?.includes(value)} {disabled}>{titles?.[value] ?? value}</Checkbox>
  {/each}
</div>

{#if errorMessage}
  <div class="error-message">
    {errorMessage}
  </div>
{/if}

<CommonCss />

<style lang="postcss">
  .root {
    display: grid;
    gap: var(--gap);

    &[data-layout='vertical'] {
      grid-template-columns: auto;
    }

    &[data-layout='horizontal'] {
      grid-auto-flow: column;
      grid-auto-columns: max-content;
    }

    &.hasGridColumnsCount {
      grid-template-columns: repeat(var(--grid-columns-count), max-content);
      grid-auto-flow: initial;
    }
  }

  .error-message {
    @apply text-sm mt-2;
    color: var(--attention_color);
  }
</style>
