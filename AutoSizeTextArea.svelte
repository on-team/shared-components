<script lang="ts">
  import { Readable } from 'svelte/store'
  import CommonCss from './CommonCss.svelte'

  export let text = ''
  export let name: string = ''
  export let placeholder = ''
  export let disabled = false
  export let minHeight: string | undefined = undefined
  /** Felteのerrorsオブジェクト。正しい型を書くのが難しい割にメリットが乏しいのでanyを使っている */
  export let errors: Readable<any> | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  const ZERO_WIDTH_SPACE = '\u200b'
</script>

<div class="root {klass}" class:disabled {style} style:min-height={minHeight}>
  <div class="dummy" aria-hidden="true">
    {text ? text : placeholder}{ZERO_WIDTH_SPACE}
  </div>
  <textarea class="text-area" bind:value={text} {name} {placeholder} {disabled} />
</div>

{#if $errors?.[name]?.[0]}
  <div class="text-sm text-attention mt-2">
    {$errors[name][0]}
  </div>
{/if}

<CommonCss />

<style lang="postcss">
  .root {
    position: relative;
    min-height: 5.2em;
  }

  .dummy,
  .text-area {
    box-sizing: border-box;

    padding: 0.7em;
    border: var(--tt_color_light-gray) 1px solid;
    border-radius: 0.3em;

    overflow-x: hidden;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;

    color: inherit;
    font: inherit;
    line-height: 1.8em;
    letter-spacing: inherit;
  }

  .dummy {
    visibility: hidden;
  }

  .text-area {
    position: absolute;
    top: 0;
    left: 0;

    display: block;
    width: 100%;
    height: 100%;

    resize: none;

    .disabled & {
      background-color: hsla(0, 0%, 0%, 4%);
    }
  }

  .text-area:focus {
    @apply border-main outline-none;
  }
</style>
