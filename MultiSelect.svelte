<script lang="ts">
  import Checkbox from './Checkbox.svelte'
  import chevronBottom from './chevron-bottom.svg'
  import CommonCss from './CommonCss.svelte'
  import Divider from './Divider.svelte'
  import Icon from './Icon.svelte'
  import Portal from './Portal.svelte'
  import { lockBodyScroll, objectFromEntries } from './utils'

  type T = $$Generic<string>
  export let values: readonly T[]
  export let titles: Partial<Record<string, string>> = {}
  export let selected: Partial<Record<T, boolean>> = objectFromEntries(values.map((value) => [value, false]))
  export let placeholder: string = ''
  export let name: string | undefined = undefined
  export let disabled: boolean = false
  export let fullWidth = false
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }

  function getText(value: string): string {
    return titles?.[value] ?? value
  }

  $: followingCount = Object.entries(selected).filter(([, value]) => value).length - 1

  type DropdownInfo = { leftPx: number; topPx: number; widthPx: number; maxHeightPx: number }
  let dropdownInfo: DropdownInfo | undefined = undefined

  function onClickLauncher(event: MouseEvent) {
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

  $: primarySelectedValue = (() => {
    for (const key in selected) {
      if (selected[key]) return key
    }
    return undefined
  })()
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
    {#if primarySelectedValue !== undefined}
      <div class="preview">
        <div class="primary-selected-value">{getText(primarySelectedValue)}</div>
        {#if followingCount > 0}
          <div class="following-count">+{followingCount}</div>
        {/if}
      </div>
    {/if}
    <div class="text-text-lightGray" class:render-only-width={primarySelectedValue !== undefined}>
      {placeholder}
    </div>
    <div class="render-only-width">
      <div class="preview">
        <div>
          {#each values as value}
            <div class="primary-selected-value">{getText(value)}</div>
          {/each}
        </div>
        <div>
          {#each { length: values.length - 2 } as _, i}
            <div class="following-count">+{i + 1}</div>
          {/each}
        </div>
      </div>
    </div>
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
          <Checkbox class="px-4 py-3" name={`${name}.${value}`} fullWidth bind:checked={selected[value]}>
            {getText(value)}
          </Checkbox>
        {/each}
      </div>
    </div>
  </Portal>
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
    display: inline-grid;
    vertical-align: top;
    grid-template-columns: auto auto;
    align-items: center;
    gap: 0.5em;
  }

  .render-only-width {
    visibility: hidden;
    height: 0;
    overflow: hidden;
  }

  .following-count {
    border-radius: 99999px;
    padding: 0.2em 0.5em;
    background-color: hsl(0 0% 94%);
    color: hsl(0 0 30%);
    font-size: 80%;
  }

  .icon {
    transform-origin: center;
    transition: all 140ms ease-out;
    transform: rotate(0deg);

    margin-left: 0.5em;

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
    padding: 0 0.8em;
    height: 2.5em;

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
