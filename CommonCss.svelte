<style global lang="postcss">
  /**
   * もしプロジェクト側でCSS変数が定義されていなくてもshared-componentsを使えるようにするために、
   * 二重管理を承知の上でここに定義している。
   * whereを使って詳細度を下げることでプロジェクト側に上書きさせる。
   */
  :where(:root) {
    --main_color: hsl(187, 60%, 44%);
    --secondary_color: hsl(89, 43%, 55%);
    --tt_color_black: hsl(187, 11%, 18%);
    --tt_color_gray: hsl(186, 8%, 45%);
    --tt_color_light-gray: hsl(186, 11%, 66%);
    --line_color_black: hsl(183, 5%, 53%);
    --line_color_gray: hsl(180, 11%, 73%);
    --bg_color_main: hsl(0, 0%, 93.3%);
    --bg_color_sub1: hsl(0, 0%, 87%);
    --bg_color_sub2: hsl(0, 0%, 96%);
    --attention_color: hsl(349, 100%, 35%);

    --liff_secondary_color: hsl(36, 100%, 43%);
    --liff_text_black: hsl(0, 0%, 0%);
    --liff_text_gray: hsl(0, 0%, 38%);
    --liff_text_light-gray: hsl(0, 0%, 59%);
    --liff_line_color: hsl(0, 0%, 77%);
    --liff_bg_gray: hsl(0, 0%, 93%);
    --liff_bg_black: hsl(0, 0%, 81%);

    /* 複数のコンポーネントで共有する変数 */
    --one-line-input-height: 3em;
    --modal-backdrop-z-index: 1000;
  }
</style>
