<script lang="ts">
  import CommonCss from './CommonCss.svelte'
  import { DiscriminatedUnion } from './utils'

  export let value: unknown = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  $: analysisResult = analyze(value)

  function analyze(value: unknown): AnalysisResult {
    if (typeof value === 'boolean') return { type: 'boolean', value }
    if (typeof value === 'number') return { type: 'number', value }
    if (typeof value === 'bigint') return { type: 'bigint', value }

    if (value instanceof Date) return { type: 'Date', value }

    if (typeof value === 'string') return { type: 'string', value }

    return { type: 'unknown', value }
  }

  type AnalysisResult = DiscriminatedUnion<{
    Date: { value: Date }
    boolean: { value: boolean }
    number: { value: number }
    bigint: { value: bigint }
    string: { value: string }
    unknown: { value: unknown }
  }>
</script>

<div class="root {klass}" {style} data-type={analysisResult.type}>
  {#if analysisResult.type === 'number'}
    <slot name="number" value={analysisResult.value}>
      {analysisResult.value.toLocaleString()}
    </slot>
  {:else if analysisResult.type === 'bigint'}
    <slot name="bigint" value={analysisResult.value}>
      {analysisResult.value.toLocaleString()}
    </slot>
  {:else if analysisResult.type === 'boolean'}
    <slot name="boolean" value={analysisResult.value}>
      {#if value}
        ✔
      {/if}
    </slot>
  {:else if analysisResult.type === 'Date'}
    <slot name="Date" value={analysisResult.value}>
      {analysisResult.value.toLocaleString()}
    </slot>
  {:else if analysisResult.type === 'string'}
    <slot name="string" value={analysisResult.value}>
      {value}
    </slot>
  {:else}
    <slot name="unknown" value={analysisResult.value}>
      {value ?? ''}
    </slot>
  {/if}
</div>

<CommonCss />

<style lang="postcss">
  .root {
    white-space: pre-wrap;

    &[data-type='number'] {
      display: flex;
      justify-content: end;
    }

    &[data-type='bigint'] {
      display: flex;
      justify-content: end;
    }

    &[data-type='boolean'] {
      display: flex;
      justify-content: center;
    }
  }
</style>
