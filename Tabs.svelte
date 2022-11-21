<script lang="ts">
  import CommonCss from './CommonCss.svelte'

  type T = $$Generic<string>
  export let tabIds: readonly T[]
  export let selected: T = tabIds[0]

  let klass = ''
  export { klass as class }
</script>

<div class={klass}>
  <div class="tab-bar">
    {#each tabIds as tabId}
      <div class="tab" class:selected={tabId === selected} on:click={() => (selected = tabId)}>
        <slot name="title" {tabId} {selected}>{tabId}</slot>
      </div>
    {/each}
  </div>
  <!-- 
    selectedなタブには影が必要でありながら、タブとコンテンツ領域の境界線には影が表示されてはならない。これはbox-shadowでは実現困難。
    なので代わりにdrop-shadowを用いる。
    （selectedなタブとコンテンツ領域をグループ化する親要素を用意し、それにdrop-shadowを付けることで全体の外周部にのみ影を付けている）

    非selectedなタブを表示するためにタブバーを二重に描画している点に要注意。
    タブバーを描画した上から重ねてselectedなタブ用のタブバーを描画している。
    重ねるためにネガティブマージンを使っている。
  -->
  <div class="drop-shadow-area">
    <div class="tab-bar">
      {#each tabIds as tabId}
        <div class="tab" class:selected={tabId === selected} class:invisible={tabId !== selected}>
          <slot name="title" {tabId} {selected}>{tabId}</slot>
        </div>
      {/each}
    </div>
    <div class="content-area">
      <slot tabId={selected} />
    </div>
  </div>
</div>

<CommonCss />

<style lang="postcss">
  .tab-bar {
    @apply grid grid-flow-col gap-1 w-max;
  }

  .tab {
    @apply px-[30px] h-10 rounded-t-lg flex items-center bg-bg-sub2 text-sm cursor-pointer;
    border: 1px solid hsl(0, 0%, 90%);
    border-bottom: none;
    color: var(--tt_color_gray);

    &.selected {
      @apply bg-white text-text-black font-bold border-none;
    }
  }

  .drop-shadow-area {
    @apply -mt-10 pointer-events-none;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1));
  }

  .content-area {
    @apply bg-white pointer-events-auto;
    border-radius: 0 0.5rem 0.5rem 0.5rem;
  }
</style>
