<script lang="ts">
  import _ from 'lodash'
  import { Readable } from 'svelte/store'
  import chevronBottom from './chevron-bottom.svg'
  import closeIcon from './close.svg'
  import CommonCss from './CommonCss.svelte'
  import Divider from './Divider.svelte'
  import Icon from './Icon.svelte'
  import IconButton from './IconButton.svelte'
  import Portal from './Portal.svelte'
  import { lockBodyScroll } from './utils'

  type T = $$Generic<string>
  export let values: readonly T[]
  export let titles: Partial<Record<string, string>> = {}
  export let selected: T | undefined | null = undefined
  export let placeholder: string = ''
  export let name: string | undefined = undefined
  /** Felteのerrorsオブジェクト。正しい型を書くのが難しい割にメリットが乏しいのでanyを使っている */
  export let errors: Readable<any> | undefined = undefined
  export let disabled: boolean = false
  export let fullWidth = false
  export let withClearButton = false
  export let onChangeSelected: ((selected: T | undefined) => void) | undefined = undefined
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  $: errorMessage = _.get($errors, name, null)?.[0]

  function getText(value: string): string {
    return titles?.[value] ?? value
  }

  function changeSelected(newSelected: T | undefined) {
    selected = newSelected
    onChangeSelected?.(newSelected)
  }

  type DropdownInfo = { leftPx: number; topPx: number; widthPx: number; maxHeightPx: number }
  let dropdownInfo: DropdownInfo | undefined = undefined

  function onClickLauncher(event: MouseEvent) {
    if (event.defaultPrevented) return

    if (event.currentTarget instanceof HTMLElement) {
      const rect = event.currentTarget.getBoundingClientRect()
      dropdownInfo = {
        leftPx: rect.left,
        topPx: rect.bottom,
        widthPx: rect.width,
        maxHeightPx: window.innerHeight - rect.bottom,
      }
    }
  }

  function onOperateBackdrop(event: Event) {
    if (event.target !== event.currentTarget) return

    dropdownInfo = undefined
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

<button
  class={`launcher ${klass}`}
  class:disabled
  class:opened={dropdownInfo !== undefined}
  class:full-width={fullWidth}
  {style}
  type="button"
  {disabled}
  on:click={onClickLauncher}
  {...$$restProps}
>
  <div class="preview-area">
    {#if selected != null}
      <div class="preview">
        {getText(selected)}
        {#if withClearButton && !disabled}
          <IconButton
            class="ml-1"
            src={closeIcon}
            size="1.6em"
            iconSize="70%"
            onClick={() => changeSelected(undefined)}
          />
        {:else}
          <div class="w-4" />
        {/if}
      </div>
    {/if}
    <div class="text-text-lightGray" class:render-only-width={selected != null}>
      {placeholder}
    </div>
    <div class="render-only-width">
      {#each values as value}
        <div class="preview">
          {getText(value)}
          {#if withClearButton && !disabled}
            <IconButton class="ml-1" src={closeIcon} size="1.6em" iconSize="70%" />
          {:else}
            <div class="w-4" />
          {/if}
        </div>
      {/each}
    </div>
    <input type="hidden" {name} value={selected ?? null} />
  </div>
  <div class="icon">
    <Icon src={chevronBottom} />
  </div>
</button>
{#if dropdownInfo}
  <Portal>
    <div class="backdrop" use:setupBackdrop>
      <div
        class="dropdown"
        style:--dropdown-left={`${dropdownInfo.leftPx}px`}
        style:--dropdown-top={`${dropdownInfo.topPx}px`}
        style:--dropdown-width={`${dropdownInfo.widthPx}px`}
        style:--dropdown-man-height={`${dropdownInfo.maxHeightPx}px`}
        use:lockBodyScroll
      >
        {#each values as value, i}
          {#if i > 0}
            <Divider />
          {/if}
          <button
            class="option"
            class:selected={selected === value}
            on:click={() => {
              changeSelected(value)
              dropdownInfo = undefined
            }}
          >
            {getText(value)}
          </button>
        {/each}
      </div>
    </div>
  </Portal>
{/if}

{#if errorMessage}
  <div class="text-sm text-attention mt-2">
    {errorMessage}
  </div>
{/if}

<CommonCss />

<style lang="postcss">
  .launcher {
    display: inline-grid;
    vertical-align: top;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    text-align: start;

    border-radius: 0.3em;
    border: var(--tt_color_light-gray) 1px solid;
    padding: 0.4em 0.7em;
    box-sizing: border-box;
    min-height: var(--one-line-input-height);

    background-color: white;
    font: inherit;
    cursor: pointer;

    &.full-width {
      @apply grid w-full;
    }

    &.disabled {
      background-color: hsla(0, 0%, 0%, 4%);
      cursor: initial;
    }

    &:focus-visible {
      border-color: var(--main_color);
      outline: none;
    }
  }

  .preview {
    @apply flex items-center justify-between;
  }

  .render-only-width {
    visibility: hidden;
    height: 0;
    overflow: hidden;
  }

  .icon {
    transform-origin: center;
    transition: all 140ms ease-out;
    transform: rotate(0deg);

    .opened & {
      transform: rotate(-180deg);
    }
  }

  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: var(--modal-backdrop-z-index);
  }

  .dropdown {
    position: fixed;
    left: var(--dropdown-left);
    top: var(--dropdown-top);
    box-sizing: border-box;
    width: var(--dropdown-width);
    max-height: var(--dropdown-man-height);
    border-radius: 0.4em;
    background-color: white;
    box-shadow: 0 3px 14px hsla(0, 0%, 0%, 20%);

    overflow: auto;
  }

  .option {
    display: flex;
    align-items: center;
    text-align: start;

    border: none;
    padding: 0 0.8em;
    box-sizing: border-box;
    width: 100%;
    height: 2.5em;

    background-color: white;
    font: inherit;
    cursor: pointer;

    @media (hover: hover) {
      &:hover {
        background-color: hsl(0 0% 97%);
      }
    }

    &:active {
      background-color: hsl(0 0% 94%);
    }

    &.selected {
      background-color: hsl(187, 60%, 95%);
      color: var(--main_color);

      @media (hover: hover) {
        &:hover {
          background-color: hsl(187, 60%, 93%);
        }
      }

      &:active {
        background-color: hsl(187, 60%, 91%);
      }
    }
  }
</style>
