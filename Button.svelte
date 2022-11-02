<script lang="ts">
  import { goto } from '@roxi/routify'
  import { isExternalUrl } from '~/utils/string'
  import CommonCss from './CommonCss.svelte'
  import Spinner from './Spinner.svelte'

  export let color: 'primary' | 'achromatic' | 'attention' = 'primary'
  export let ghost: boolean = false
  export let fullWidth: boolean = false
  export let type: 'submit' | 'button' | 'reset' = 'button'
  export let disabled: boolean = false
  export let href: string | undefined = undefined
  export let openNewTab: boolean = false
  /*
   * （hrefが設定されていたとしても）クリック時に呼ばれる関数。
   * Promiseが返された場合はそれが終了するまでローディングインジケーターを表示する。
   */
  export let onClick: ((event: MouseEvent) => unknown) | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

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
  class="root {klass}"
  class:ghost
  class:fullWidth
  class:disabled
  {style}
  data-color={color}
  {type}
  disabled={disabled || isInProgress}
  on:click={clickHandler}
>
  {#if isInProgress}
    <div class="relative">
      <!-- 元々のサイズを維持しつつ非表示にする -->
      <div class="invisible">
        <slot />
      </div>
      <!-- ↑に重ねて表示 -->
      <div class="spinner-wrapper">
        <Spinner size="1.5em" color="currentColor" />
      </div>
    </div>
  {:else}
    <slot />
  {/if}
</button>

<CommonCss />

<style lang="postcss">
  .root {
    @apply inline-flex items-center justify-center rounded font-bold whitespace-nowrap;
    height: 2.5em;
    padding: 0 1em;

    transition: all 0.2s ease-out;

    &.disabled {
      pointer-events: none;
    }

    &:not(.ghost) {
      &[data-color='primary'] {
        background-color: var(--main_color);
        color: white;

        @media (hover: hover) {
          &:hover {
            background-color: hsl(187, 60%, 41%);
            transition-duration: 0s;
          }
        }

        &:active {
          background-color: hsl(187, 60%, 38%);
          transition-duration: 0s;
        }

        &.disabled {
          background-color: hsl(187, 45%, 79%);
        }
      }

      &[data-color='achromatic'] {
        @apply text-text-gray;
        background-color: hsl(0, 0%, 93%);

        @media (hover: hover) {
          &:hover {
            background-color: hsl(0, 0%, 89%);
            transition-duration: 0s;
          }
        }

        &:active {
          background-color: hsl(0, 0%, 85%);
          transition-duration: 0s;
        }

        &.disabled {
          background-color: hsl(0, 0%, 96%);
          color: hsl(0, 0%, 75%);
        }
      }

      &[data-color='attention'] {
        @apply bg-attention text-white;

        @media (hover: hover) {
          &:hover {
            background-color: hsl(349, 60%, 40%);
            transition-duration: 0s;
          }
        }

        &:active {
          background-color: hsl(349, 100%, 30%);
          transition-duration: 0s;
        }

        &.disabled {
          background-color: hsl(349, 50%, 85%);
        }
      }
    }

    &.ghost {
      &[data-color='primary'] {
        border: var(--main_color) 1px solid;
        color: var(--main_color);

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

        &.disabled {
          border: none;
          background-color: hsl(0, 0%, 96%);
          color: hsl(0, 0%, 75%);
        }
      }

      &[data-color='achromatic'] {
        @apply text-text-gray;
        border: var(--tt_color_gray) 1px solid;

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

        &.disabled {
          border: none;
          background-color: hsl(0, 0%, 96%);
          color: hsl(0, 0%, 75%);
        }
      }

      &[data-color='attention'] {
        @apply text-attention;
        border: var(--attention_color) 1px solid;

        @media (hover: hover) {
          &:hover {
            background-color: hsla(0, 0%, 50%, 10%);
            transition-duration: 0s;
          }
        }

        &:active {
          background-color: hsl(349, 100%, 98%);
          transition-duration: 0s;
        }

        &.disabled {
          border: none;
          background-color: hsl(0, 0%, 96%);
          color: hsl(0, 0%, 75%);
        }
      }
    }
  }

  .fullWidth {
    @apply flex w-full;
  }

  .spinner-wrapper {
    /* 中央寄せ */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
