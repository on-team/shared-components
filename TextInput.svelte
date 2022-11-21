<script lang="ts">
  import _ from 'lodash'
  import { Readable } from 'svelte/store'
  import CommonCss from './CommonCss.svelte'

  export let name: string = ''
  export let placeholder: string = ''
  export let value: string = ''
  export let type: string = 'text'
  export let autocomplete: string = ''
  export let disabled = false
  /** Felteのerrorsオブジェクト。正しい型を書くのが難しい割にメリットが乏しいのでanyを使っている */
  export let errors: Readable<any> | undefined = undefined
  export let style: string | undefined = undefined
  let klass: string = ''
  export { klass as class }

  $: errorMessage = _.get($errors, name, null)?.[0]
</script>

{#if type === 'email'}
  <input class="root {klass}" class:disabled type="email" {style} {name} {placeholder} bind:value {disabled} on:input />
{:else if type === 'number'}
  <input
    class="root {klass}"
    class:disabled
    type="number"
    {style}
    {name}
    {placeholder}
    bind:value
    {autocomplete}
    {disabled}
    on:input
  />
{:else if type === 'password'}
  <input
    class="root {klass}"
    class:disabled
    type="password"
    {style}
    {name}
    {placeholder}
    bind:value
    {autocomplete}
    {disabled}
    on:input
  />
{:else if type === 'search'}
  <input
    class="root {klass}"
    class:disabled
    type="search"
    {style}
    {name}
    {placeholder}
    bind:value
    {autocomplete}
    {disabled}
    on:input
  />
{:else if type === 'tel'}
  <input
    class="root {klass}"
    class:disabled
    type="tel"
    {style}
    {name}
    {placeholder}
    bind:value
    {autocomplete}
    {disabled}
    on:input
  />
{:else if type === 'text'}
  <input
    class="root {klass}"
    class:disabled
    type="text"
    {style}
    {name}
    {placeholder}
    bind:value
    {autocomplete}
    {disabled}
    on:input
  />
{:else if type === 'url'}
  <input
    class="root {klass}"
    class:disabled
    type="url"
    {style}
    {name}
    {placeholder}
    bind:value
    {autocomplete}
    {disabled}
    on:input
  />
{:else}
  <input
    class="root {klass}"
    class:disabled
    {style}
    {name}
    {placeholder}
    bind:value
    {autocomplete}
    {disabled}
    on:input
  />
{/if}

{#if errorMessage}
  <div class="error-message">
    {errorMessage}
  </div>
{/if}

<CommonCss />

<style lang="postcss">
  .root {
    @apply w-full block rounded-md bg-white;
    height: var(--one-line-input-height);
    padding: 0 0.7em;
    border: var(--tt_color_light-gray) 1px solid;

    &:focus {
      @apply border-main outline-none;
    }

    &.disabled {
      background-color: hsla(0, 0%, 0%, 4%);
    }
  }

  .error-message {
    @apply text-sm mt-2;
    color: var(--attention_color);
  }
</style>
