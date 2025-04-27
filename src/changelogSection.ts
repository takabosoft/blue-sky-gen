export class ChangelogSection {
    readonly element: JQuery = $(`<section>`).append(
        $(`<h2>`).text("更新履歴"),
        $(`<div>`).append(
            $(`<ul>`).append(
                $(`<li>`).html(`2025/04/27 Ver.1.0.5 雲のfBMのスケールを微調整`),
                $(`<li>`).html(`2025/04/06 <a href="./old/1.0.4/">Ver.1.0.4</a> WebGLのシェーダーで書き直した`),
                $(`<li>`).html(`2025/03/29 <a href="./old/1.0.3/">Ver.1.0.3</a> 「雲の細かさ」「雲の細部強調」パラメータ追加`),
                $(`<li>`).html(`2025/03/30 Ver.1.0.2 UIスマホ対応`),
                $(`<li>`).html(`2025/03/29 Ver.1.0.1 雲生成部分にfBM（非整数ブラウン運動）を採用`),
                $(`<li>`).html(`2025/03/29 <a href="./old/1.0/">Ver.1.0</a> 初期リリース`),
            )
        )
    )
}