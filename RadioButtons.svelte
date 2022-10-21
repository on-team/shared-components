<script lang="ts">
  import { Readable } from 'svelte/store'
  import CommonCss from './CommonCss.svelte'

  type T = $$Generic<string>
  export let values: readonly T[]
  export let titles: Partial<Record<string, string>> = {}
  export let selected: T | undefined = undefined
  export let name: string | undefined = undefined
  export let disabled: boolean = false
  /** Felteのerrorsオブジェクト。正しい型を書くのが難しい割にメリットが乏しいのでanyを使っている */
  export let errors: Readable<any> | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }
</script>

<div class={klass}>
  {#each values as value}
    <label class="label" class:disabled {style}>
      <input
        type="radio"
        class="radio"
        {value}
        {name}
        checked={selected === value}
        {disabled}
        on:click={() => (selected = value)}
      />
      <slot {value} title={titles?.[value]}>
        {titles?.[value] ?? value}
      </slot>
    </label>
  {/each}
</div>

{#if $errors?.[name]?.[0]}
  <div class="text-sm text-attention mt-2">
    {$errors[name][0]}
  </div>
{/if}

<CommonCss />

<style lang="postcss">
  .label {
    display: inline-grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.3em;
    vertical-align: top;

    cursor: pointer;

    &.disabled {
      cursor: default;

      /* TODO: disabled状態でのテキスト色を設定する */
    }
  }

  .radio {
    appearance: none;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    /* 本当はpxではなくemで指定した方がいいと思うが、小数pxや偶数奇数によって2つの円の中心軸がずれるので難易度が高い */
    --size: 18px;
    width: var(--size);
    height: var(--size);
    border-radius: 100%;
    margin: 0;

    border: hsl(0 0% 60%) 1px solid;
    background-color: white;

    cursor: pointer;

    transition: all 0.1s ease-out;

    &:checked {
      @apply border-main;
      transition: all 0.1s ease-out;
    }

    .disabled & {
      cursor: default;

      /* TODO: disabled状態での見た目を設定する */
    }

    &::before {
      content: '';
      display: inline-block;
      width: 0;
      height: 0;
      border-radius: 100%;

      transition: all 0.1s ease-out;
    }

    &:checked::before {
      @apply bg-main;

      --size: 10px;
      width: var(--size);
      height: var(--size);

      transition: all 0.1s ease-out;
    }
  }
</style>
