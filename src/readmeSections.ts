export class ReadmeSection {
    readonly element: JQuery = $(`<section>`).append(
        $(`<h2>`).text("【STEP.0】 お読みください"),
        $(`<div>`).append(
            $(`<ul>`).append(
                $(`<li>`).text(`青空の画像を計算で生成します。`),
                $(`<li>`).text(`生成された画像の著作権は利用者に帰属します。商用利用可能です（クレジット表記などは歓迎いたします）。`),
                $(`<li>`).html(`現在のバージョンはWebGLを使用していますが、動作が不安定な場合は<a href="./old/1.0.3/">Ver.1.0.3をお試しください</a>。1.0.3はCPUによるレンダリングです。`),
                $(`<li>`).html(`ソースコードはこちら：<a href="https://github.com/takabosoft/blue-sky-gen" target="_blank">https://github.com/takabosoft/blue-sky-gen</a>`),
            )
        )
    )
}