<script lang="ts">
  import { onMount } from 'svelte'
  import { joinClasses } from '~/components/shared/utils'
  import chevronBottom from './chevron-bottom.svg'
  import CommonCss from './CommonCss.svelte'
  import Divider from './Divider.svelte'
  import IconButton from './IconButton.svelte'

  // TODO: 見た目の調整

  export let unfolded = false
  export let onUnfold: (() => unknown) | undefined = undefined
  export let style: string | undefined = undefined
  let klass: string = ''
  export { klass as class }
  export let classes: Record<string, unknown> | undefined = undefined

  const fold = () => (unfolded = false)
  const unfold = () => (unfolded = true)
  const toggle = () => (unfolded = !unfolded)

  // 値の変化を検出するためのミラー変数
  let _unfolded = unfolded
  $: if (_unfolded !== unfolded) {
    _unfolded = unfolded
    if (unfolded) {
      startUnfoldingAnimation()
      onUnfold?.()
    } else {
      startFoldingAnimation()
    }
  }

  // 開閉時のスライドアニメーションをJavaScriptで行うために必要な変数。
  // Svelte標準のslide transitionを使うと開閉の前後でFoldableの横幅が変わってしまうので独自実装した。
  let contentAreaElement: HTMLElement | null = null
  let contentHeight = 0

  onMount(() => {
    // 初回表示時はアニメーションを発動させずに見た目を設定する
    if (!unfolded && contentAreaElement !== null) {
      contentAreaElement.style.height = '0'
      contentAreaElement.style.visibility = 'hidden'
    }
  })

  const ANIMATION_OPTION = {
    duration: 140,
    easing: 'ease-out',
  }

  async function startFoldingAnimation() {
    if (contentAreaElement === null) return

    await contentAreaElement.animate({ height: [`${contentHeight}px`, '0'] }, ANIMATION_OPTION).finished
    contentAreaElement.style.height = '0'
    contentAreaElement.style.visibility = 'hidden'
  }

  async function startUnfoldingAnimation() {
    if (contentAreaElement === null) return

    contentAreaElement.style.visibility = 'visible'
    await contentAreaElement.animate({ height: ['0', `${contentHeight}px`] }, ANIMATION_OPTION).finished
    contentAreaElement.style.height = 'auto'
  }
</script>

<div class={`root ${klass} ${joinClasses(classes)}`} {style}>
  <div class="flex items-center justify-between py-3 cursor-pointer" on:click={toggle}>
    <div class="px-8 font-bold">
      <slot name="title" {fold} {unfold} {toggle} />
    </div>
    <IconButton class="mx-3" src={chevronBottom} />
  </div>
  {#if unfolded}
    <Divider />
  {/if}
  <div class="content-area" bind:this={contentAreaElement} bind:clientHeight={contentHeight}>
    <slot {fold} {unfold} {toggle} />
  </div>
</div>

<CommonCss />

<style lang="postcss">
  .root {
    background-color: hsl(0 0% 96%);
    border-radius: 0.5rem;
  }

  .content-area {
    overflow: hidden;

    /* heightとvisibilityがJavaScriptで設定される */
  }
</style>
