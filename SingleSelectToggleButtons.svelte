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
  export let onChangeSelected: (selected: Value | undefined) => void = () => {}
  let klass = ''
  export { klass as class }

  $: errorMessage = _.get($errors, name, null)?.[0]

  // 選択肢に含まれていない値がselectedに指定された場合はundefined扱いにする
  $: if (selected !== undefined && !values.includes(selected)) {
    selected = undefined
  }
</script>

<div class={`root ${klass}`} {style} {...$$restProps}>
  {#each values as value (value)}
    <button
      class:selected={value === selected}
      type="button"
      on:click={() => {
        selected = value
        onChangeSelected(selected)
      }}
    >
      {titles[value] ?? value}
    </button>
  {/each}
</div>
<!-- Felte用の不可視input要素 -->
<input type="hidden" {name} value={selected} />

{#if errorMessage}
  <div class="error-message">
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
      @apply border-none text-white;
      background-color: var(--tt_color_gray);
    }
  }

  .error-message {
    @apply text-sm mt-2;
    color: var(--attention_color);
  }
</style>
