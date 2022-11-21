<script lang="ts">
  import CommonCss from './CommonCss.svelte'

  /** 各円形の下に表示されるテキスト */
  export let titles: string[]
  /** 何番目のステップまで進んだか。0オリジンなので要注意 */
  export let currentStep: number
  export let style: string | undefined = undefined
  let klass = ''
  export { klass as class }
</script>

<div class={klass} {style} style:--circle-size="2.5rem">
  <!-- 横線の上に円形を重ねて表示するためのrelativeレイアウト -->
  <div class="relative">
    <!-- 各円形の間を結ぶ線を表示するレイヤー -->
    <div class="line-layer" style:grid-template-columns={`1fr repeat(${titles.length - 1}, 2fr) 1fr`}>
      <div />
      {#each { length: titles.length - 1 } as _, i}
        <div class="line" class:reached={i < currentStep} />
      {/each}
      <div />
    </div>
    <!-- 各円形を表示するレイヤー -->
    <div class="absolute w-full top-0 grid" style:grid-template-columns={`repeat(${titles.length}, 1fr)`}>
      {#each titles as _, i}
        <div class="flex justify-center">
          <div class="circle" class:reached={i <= currentStep}>{i + 1}</div>
        </div>
      {/each}
    </div>
  </div>
  <!-- 各円形の下に表示されるテキストの領域 -->
  <div class="grid mt-2" style:grid-template-columns={`repeat(${titles.length}, 1fr)`}>
    {#each titles as title, i}
      <div class="title" class:reached={i <= currentStep}>{title}</div>
    {/each}
  </div>
</div>

<CommonCss />

<style lang="postcss">
  .line-layer {
    @apply grid items-center;
    height: var(--circle-size);
  }

  .line {
    height: 1px;

    background-image: linear-gradient(
      to right,
      var(--line_color_black),
      var(--line_color_black) 6px,
      transparent 6px,
      transparent 12px
    );
    background-size: 12px 1px;
    background-repeat: repeat-x;

    &.reached {
      height: 3px;
      background-color: var(--main_color);
    }
  }

  .circle {
    @apply rounded-full bg-text-lightGray text-white flex items-center justify-center text-lg font-bold;
    width: var(--circle-size);
    height: var(--circle-size);

    &.reached {
      background-color: var(--main_color);
    }
  }

  .title {
    @apply flex justify-center text-text-lightGray text-sm font-bold;

    &.reached {
      color: var(--main_color);
    }
  }
</style>
