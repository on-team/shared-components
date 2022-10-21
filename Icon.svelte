<script lang="ts">
  import CommonCss from './CommonCss.svelte'
  import { joinClasses } from './utils'

  /** 画像のURL */
  export let src: string
  export let size: string = '1.3em'
  /**
   * アイコンの色。
   * undefinedの場合、画像の元々の色をそのまま表示する。
   * svg形式の画像に対してのみ有効。
   */
  export let tint: string | undefined = undefined
  export let ariaLabel: string | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }
  export let classes: Record<string, unknown> | undefined = undefined
</script>

{#if tint === undefined}
  <img
    class={`root ${klass} ${joinClasses(classes)}`}
    {style}
    style:--size={size}
    {src}
    alt=""
    aria-label={ariaLabel}
  />
{:else}
  <div
    class={`root ${klass} ${joinClasses(classes)}`}
    {style}
    style:--size={size}
    style:--url="url('{src}')"
    style:--tint={tint}
    aria-label={ariaLabel}
  />
{/if}

<CommonCss />

<style lang="postcss">
  .root {
    @apply inline-block;
    width: var(--size);
    height: var(--size);

    vertical-align: top;
  }

  img {
    object-fit: contain;
  }

  div {
    background-color: var(--tint);
    mask: var(--url) no-repeat center;
    mask-size: contain;
  }
</style>
