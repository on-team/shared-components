<script lang="ts">
  import { fade } from 'svelte/transition'
  import Icon from '~/components/shared/Icon.svelte'
  import { toastModelsStore } from '~/components/toast'
  import alertOutlineIcon from './alert-outline.svg'
  import checkIcon from './check.svg'
</script>

<div class="root">
  {#each $toastModelsStore as toastModel}
    <div transition:fade class="toast" data-type={toastModel.type}>
      <div class="icon-area">
        {#if toastModel.type === 'success'}
          <Icon src={checkIcon} tint="white" size="1.4em" />
        {:else}
          <Icon src={alertOutlineIcon} tint="white" size="1.6em" />
        {/if}
      </div>
      <div class="py-2 px-4">
        {toastModel.message}
      </div>
    </div>
  {/each}
</div>

<style lang="postcss">
  .root {
    @apply fixed bottom-0 right-0 m-8 space-y-4;
    z-index: var(--modal-backdrop-z-index);
    pointer-events: none;
  }

  .toast {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;

    margin-left: auto;
    width: max-content;
    min-width: 15em;
    max-width: 80vw;

    color: white;
    transition: all 0.2s ease;

    &[data-type='success'] {
      background-color: hsl(132, 52%, 54%);
    }

    &[data-type='fail'] {
      background-color: var(--attention_color);
    }
  }

  .icon-area {
    width: 2.5em;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: hsla(0, 0%, 0%, 32%);
  }
</style>
