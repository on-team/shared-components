<script lang="ts">
  import CommonCss from './CommonCss.svelte'
  import { joinClasses } from './utils'

  export let direction: 'horizontal' | 'vertical' = 'horizontal'
  export let thickness = '1px'
  export let color = 'var(--line_color_gray)'
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }
  export let classes: Record<string, unknown> | undefined = undefined
</script>

<div
  class={`root ${klass} ${joinClasses(classes)}`}
  {style}
  style:--thickness={thickness}
  style:--color={color}
  data-direction={direction}
/>

<CommonCss />

<style lang="postcss">
  .root {
    background-color: var(--color);

    &[data-direction='horizontal'] {
      height: var(--thickness);
    }

    &[data-direction='vertical'] {
      width: var(--thickness);
      height: 100%;
    }
  }
</style>
