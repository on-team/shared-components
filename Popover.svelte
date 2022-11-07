<script lang="ts">
  import { fade } from 'svelte/transition'
  import CommonCss from './CommonCss.svelte'
  import Portal from './Portal.svelte'

  export let opened = false
  export let on: EnneaPosition = 'bottom'
  export let joint: EnneaPosition | undefined = undefined
  export let persistent = false
  /** trueならlauncherラッパー要素にデフォルトのwidth: max-contentを設定しなくなる */
  export let fullWidthLauncher = false
  export let onClose: (() => unknown) | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  let launcher: HTMLElement | null = null
  let launcherRect: DOMRect | undefined

  function open() {
    opened = true

    launcherRect = launcher?.getBoundingClientRect()
  }

  function close() {
    opened = false
    onClose?.()
  }

  function toggle() {
    if (opened) {
      close()
    } else {
      open()
    }
  }

  function onOperateBackdrop(event: Event) {
    if (event.target !== event.currentTarget) return

    if (!persistent) {
      close()
    }
  }

  type EnneaPosition =
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'center'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'

  type HorizontalPosition = 'left' | 'center' | 'right'
  type VerticalPosition = 'top' | 'center' | 'bottom'

  function toOpposite(position: EnneaPosition): EnneaPosition {
    switch (position) {
      case 'top':
        return 'bottom'
      case 'bottom':
        return 'top'
      case 'left':
        return 'right'
      case 'right':
        return 'left'
      case 'center':
        return 'center'
      case 'top left':
        return 'bottom right'
      case 'top right':
        return 'bottom left'
      case 'bottom left':
        return 'top right'
      case 'bottom right':
        return 'top left'
    }
  }

  function toHorizontalPosition(position: EnneaPosition): HorizontalPosition {
    const mapping = {
      'top left': 'left',
      left: 'left',
      'bottom left': 'left',
      top: 'center',
      center: 'center',
      bottom: 'center',
      'top right': 'right',
      right: 'right',
      'bottom right': 'right',
    } as const
    return mapping[position]
  }

  function toVerticalPosition(position: EnneaPosition): VerticalPosition {
    const mapping = {
      'top left': 'top',
      top: 'top',
      'top right': 'top',
      left: 'center',
      center: 'center',
      right: 'center',
      'bottom left': 'bottom',
      bottom: 'bottom',
      'bottom right': 'bottom',
    } as const
    return mapping[position]
  }

  function toXPercent(position: EnneaPosition): `${number}%` {
    const mapping = { left: '0%', center: '50%', right: '100%' } as const
    return mapping[toHorizontalPosition(position)]
  }

  function toYPercent(position: EnneaPosition): `${number}%` {
    const mapping = { top: '0%', center: '50%', bottom: '100%' } as const
    return mapping[toVerticalPosition(position)]
  }

  // なぜかon:mousewheelの型定義がなく、@ts-ignoreも使えないのでリスナーを手動で登録する
  function setupBackdrop(element: HTMLElement) {
    element.addEventListener('click', onOperateBackdrop)
    element.addEventListener('mousewheel', onOperateBackdrop)
    element.addEventListener('touchmove', onOperateBackdrop)

    return {
      destroy() {
        element.removeEventListener('click', onOperateBackdrop)
        element.removeEventListener('mousewheel', onOperateBackdrop)
        element.removeEventListener('touchmove', onOperateBackdrop)
      },
    }
  }
</script>

<div class:w-max={!fullWidthLauncher} bind:this={launcher}>
  <slot name="launcher" {open} {close} {toggle} />
</div>
{#if opened}
  <Portal>
    <div
      class="root"
      style:--left={launcherRect ? `${launcherRect.left}px` : '0'}
      style:--right={launcherRect ? `${launcherRect.right}px` : '0'}
      style:--top={launcherRect ? `${launcherRect.top}px` : '0'}
      style:--bottom={launcherRect ? `${launcherRect.bottom}px` : '0'}
      style:--transform="translate(-{toXPercent(joint ?? toOpposite(on))}, -{toYPercent(joint ?? toOpposite(on))})"
      data-horizontal-position={toHorizontalPosition(on)}
      data-vertical-position={toVerticalPosition(on)}
      transition:fade={{ duration: 150 }}
      use:setupBackdrop
      {...$$restProps}
    >
      <slot name="frame" {open} {close} {toggle}>
        <div class={`frame ${klass}`} {style}>
          <slot {open} {close} {toggle} />
        </div>
      </slot>
    </div>
  </Portal>
{/if}

<CommonCss />

<style lang="postcss">
  .root {
    @apply fixed top-0 left-0 bottom-0 right-0;
    z-index: var(--modal-backdrop-z-index);
  }

  .frame {
    @apply fixed grid bg-white rounded-lg;
    transform: var(--transform);
    box-shadow: 0 3px 14px hsla(0, 0%, 0%, 20%);

    .root[data-horizontal-position='left'] & {
      left: var(--left);
    }

    .root[data-horizontal-position='center'] & {
      left: calc((var(--left) + var(--right)) / 2);
    }

    .root[data-horizontal-position='right'] & {
      left: var(--right);
    }

    .root[data-vertical-position='top'] & {
      top: var(--top);
    }

    .root[data-vertical-position='center'] & {
      top: calc((var(--top) + var(--bottom)) / 2);
    }

    .root[data-vertical-position='bottom'] & {
      top: var(--bottom);
    }
  }
</style>
