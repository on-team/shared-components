<script lang="ts">
  import _ from 'lodash'
  import { Readable } from 'svelte/store'
  import CommonCss from './CommonCss.svelte'

  export let name: string = ''
  export let id: string = ''
  export let placeholder: string = ''
  export let value: string | number = ''
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
  <input
    {id}
    class="root {klass}"
    class:disabled
    type="email"
    {style}
    {name}
    {placeholder}
    bind:value
    {disabled}
    on:input
  />
{:else if type === 'number'}
  <input
    {id}
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
    {id}
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
    {id}
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
    {id}
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
    {id}
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
    {id}
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
    {id}
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
    border: var(--gray_color2) 1px solid;

    &:focus {
      @apply outline-none;
      border-color: var(--main_color);
    }

    &::placeholder {
      color: var(--gray_color2);
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
