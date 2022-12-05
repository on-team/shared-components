<script lang="ts">
  import arrowDownIcon from './arrow-down.svg'
  import CommonCss from './CommonCss.svelte'
  import IconButton from './IconButton.svelte'

  export let sorted = false
  export let reversed = false
  export let onClick: ((event: MouseEvent) => unknown) | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }
</script>

<div class="root {klass}" class:sorted class:reversed {style}>
  <IconButton src={arrowDownIcon} size="1.5em" tint="currentColor" {onClick} />
</div>

<CommonCss />

<style lang="postcss">
  .root {
    transform-origin: center;
    transition: all 140ms ease-out;
    transform: rotate(0deg);
    color: hsl(0 0% 50%);

    &.reversed {
      transform: rotate(-180deg);
    }

    &.sorted {
      color: hsl(0 0% 0%);
    }
  }
</style>
