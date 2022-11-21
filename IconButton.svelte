<script lang="ts">
  import { goto } from '@roxi/routify'
  import CommonCss from './CommonCss.svelte'
  import Icon from './Icon.svelte'
  import Spinner from './Spinner.svelte'
  import { isExternalUrl, joinClasses } from './utils'

  /** img要素のsrc属性に転送されるProps */
  export let src: string
  /** ボタン全体のサイズ */
  export let size: string = '2rem'
  /**
   * アイコンimg要素のサイズ。
   * アイコンの画像データ自体が持っている余白の量によっては見た目が不自然になるので、このパラメータで調整する。
   */
  export let iconSize: string = '80%'
  /**
   * アイコンの色。
   * undefinedの場合、画像の元々の色をそのまま表示する。
   * svg形式の画像に対してのみ有効。
   */
  export let tint: string | undefined = undefined
  export let href: string | undefined = undefined
  export let type: string = 'button'
  export let disabled: boolean = false
  export let openNewTab: boolean = false
  /*
   * （hrefが設定されていたとしても）クリック時に呼ばれる関数。
   * Promiseが返された場合はそれが終了するまでローディングインジケーターを表示する。
   */
  export let onClick: ((event: MouseEvent) => unknown) | undefined = undefined
  export let ariaLabel: string | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }
  export let classes: Record<string, unknown> | undefined = undefined

  let isInProgress = false

  function clickHandler(event: MouseEvent) {
    // DataTableの行がrowHrefとボタンを両方持っている場合、ボタンへのclickイベントがa要素に伝わって画面遷移が起こってしまうのでその対策
    if (onClick || href !== undefined) event.preventDefault()

    const promise = onClick?.(event)
    if (promise instanceof Promise) {
      isInProgress = true
      promise.finally(() => (isInProgress = false))
    }

    if (href !== undefined) {
      if (openNewTab) return window.open(href, '_blank')
      if (isExternalUrl(href)) return (location.href = href)
      $goto(href)
    }
  }
</script>

<button
  class={`root ${klass} ${joinClasses(classes)}`}
  {type}
  disabled={disabled || isInProgress}
  {style}
  style:--size={size}
  aria-label={ariaLabel}
  on:click={clickHandler}
>
  {#if isInProgress}
    <div class="spinner-wrapper absolute-center">
      <Spinner size="100%" />
    </div>
  {:else}
    <Icon class="absolute-center" size={iconSize} {src} tint={disabled ? 'hsl(0 0% 75%)' : tint} />
  {/if}
</button>

<CommonCss />

<style lang="postcss">
  .root {
    @apply relative inline-flex items-center justify-center rounded-full overflow-hidden align-top;
    width: var(--size);
    height: var(--size);

    transition: all 0.2s ease-out;

    &:not(:disabled) {
      @media (hover: hover) {
        &:hover {
          background-color: hsla(0, 0%, 50%, 10%);
          transition-duration: 0s;
        }
      }

      &:active {
        background-color: hsla(0, 0%, 50%, 20%);
        transition-duration: 0s;
      }
    }
  }

  .spinner-wrapper {
    width: 65%;
    height: 65%;
  }

  .absolute-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
