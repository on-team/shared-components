<script lang="ts">
  import { createFocusTrap } from 'focus-trap'
  import CommonCss from './CommonCss.svelte'

  /**
   * 以下の機能を持つコンポーネント。
   * (1) body要素の末尾にdiv要素を自動生成し、無名slotの内容をその中に移動する（PortalがDOMから消えるときはそのdiv要素も自動削除される）
   * (2) Portal表示中はそれ以外の要素（≒モーダル表示の裏の画面）へのフォーカス移動を防ぐ
   */

  function portal(element: HTMLElement) {
    document.body.appendChild(element)

    const focusTrap = createFocusTrap(element, {
      escapeDeactivates: false,
      // elementがフォーカス可能な要素を持っていない場合、createFocusTrapは例外を投げる。
      // それを防ぐために下記の2つのオプションを設定する。
      initialFocus: false,
      fallbackFocus: element,
    })
    focusTrap.activate()

    return {
      destroy() {
        if (element?.parentNode) {
          element.remove()
        }

        focusTrap.deactivate()
      },
    }
  }
</script>

<!-- 挙動的には無意味だがデバッグしやすくするためにclass名をつけておく -->
<div class="portal" use:portal>
  <slot />
</div>

<CommonCss />
