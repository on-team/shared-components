<script lang="ts">
  import { fade } from 'svelte/transition'
  import closeIcon from './close.svg'
  import CommonCss from './CommonCss.svelte'
  import Divider from './Divider.svelte'
  import IconButton from './IconButton.svelte'
  import Portal from './Portal.svelte'
  import { lockBodyScroll } from './utils'

  export let opened = false
  export let persistent = false
  export let showCloseButton = false
  export let centeringTitle = false
  export let onClose: (() => unknown) | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  const open = () => (opened = true)
  const close = () => {
    opened = false
    onClose?.()
  }
  const toggle = () => {
    opened ? close() : open()
  }

  function onClickBackdrop() {
    if (!persistent) {
      close()
    }
  }
</script>

<slot name="launcher" {open} {close} {toggle} />
{#if opened}
  <Portal>
    <div class="root" transition:fade={{ duration: 150 }} on:click|self={onClickBackdrop} {...$$restProps}>
      <slot name="frame" {open} {close} {toggle}>
        <div class={`frame ${klass}`} {style}>
          <div class="flex items-center justify-between p-1.5" class:hidden={!$$slots.title && !showCloseButton}>
            {#if centeringTitle}
              <!-- タイトルのきちんと中央寄せしつつ、長いテキストを適切に折り返すために左右に同サイズの要素を置く -->
              <IconButton class="invisible" src={closeIcon} />
            {/if}
            <span class="px-8 text-base font-bold" class:text-center={centeringTitle}>
              <slot name="title" />
            </span>
            <IconButton classes={{ invisible: !showCloseButton }} src={closeIcon} onClick={close} />
          </div>
          <Divider classes={{ hidden: !$$slots.title }} />

          <div class="overflow-auto" use:lockBodyScroll>
            <slot {open} {close} {toggle} />
          </div>

          <div class="footer">
            <slot name="footer" />
          </div>
        </div>
      </slot>
    </div>
  </Portal>
{/if}

<CommonCss />

<style lang="postcss">
  .root {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: var(--modal-backdrop-z-index);

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: hsla(0, 0%, 0%, 55%);
  }

  .frame {
    @apply grid bg-white;
    grid-template-rows: auto auto minmax(0, 1fr) auto auto;
    max-height: 90vh;
    max-width: 90vw;

    border-radius: 0.5rem;
    box-shadow: 0 3px 14px hsla(0, 0%, 0%, 20%);
  }

  .footer {
    @apply p-2 empty:hidden;
    box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.05);
  }
</style>
