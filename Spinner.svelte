<script lang="ts">
  import CommonCss from './CommonCss.svelte'

  export let size = '1.2em'
  export let thickness = 30
  export let frequency = 1.4
  export let color = 'var(--main_color)'
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  $: svgUrl = `url('data:image/svg+xml;utf8,<svg width="200mm" height="200mm" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="${
    100 - thickness / 2
  }" fill="none" stroke="black" stroke-width="${thickness}" /></svg>')`
</script>

<div
  class={`root ${klass}`}
  {style}
  style:--size={size}
  style:--svg-url={svgUrl}
  style:--period={`${1 / frequency}s`}
  style:--color={color}
/>

<CommonCss />

<style lang="postcss">
  .root {
    display: inline-block;
    position: relative;
    width: var(--size);
    height: var(--size);

    vertical-align: top;

    background-image: conic-gradient(transparent, transparent, var(--color));
    mask: var(--svg-url) no-repeat center;
    mask-size: contain;

    transform-origin: center;
    animation: rotation var(--period) infinite linear;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
