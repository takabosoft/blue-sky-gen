/**
 * Build: npx webpack -w
 * Release Build: npx webpack --mode=production
 * Server: npx live-server docs
 */

import { Camera } from "./camera";
import { Vec3 } from "./vec3";
import { Cloud } from "./cloud";
import { createNoise3D, NoiseFunction3D } from "simplex-noise";
import alea from "alea";
import { ExportRenderer } from "./exportRenderer";
import { PreviewRenderer } from "./previewRenderer";

$(() => new PageController());

class PageController {
    private readonly previewRenderer = new PreviewRenderer();
    private _noise?: NoiseFunction3D;
    private readonly seedInput = $(`<input type="text" value="seed">`).on("input", () => {
        this._noise = undefined;
        this.preview();
    });
    private readonly targetYSlider = $(`<input type="range" min="0.6" max="3" step="0.001" value="0.9">`).on("input", () => this.preview());
    private readonly cameraZSlider = $(`<input type="range" min="0" max="10000" step="0.001" value="0">`).on("input", () => this.preview());
    private readonly alphaScaleSlider = $(`<input type="range" min="0" max="0.05" step="0.001" value="0.03">`).on("input", () => this.preview());
    private readonly maxYSlider = $(`<input type="range" min="110" max="800" step="0.001" value="200">`).on("input", () => this.preview());

    private readonly widthInput = $(`<input type="number" min="1" value="800">`);
    private readonly heightInput = $(`<input type="number" min="1" value="600">`);
    private readonly resultDiv = $(`<div class="render-result">`);

    private render?: ExportRenderer;

    constructor() {
        $(document.body).append(
            $(`<h2>`).text("1. 各種設定を行ってください。"),
            $(`<div class="preview-container">`).append(
                this.previewRenderer.canvas.canvas,
                $(`<div class="preview-params">`).append(
                    $(`<div>`).text("シード値："),
                    this.seedInput,
                    $(`<div>`).text("カメラの向き："),
                    this.targetYSlider,
                    $(`<div>`).text("カメラ位置："),
                    this.cameraZSlider,
                    $(`<div>`).text("雲の濃さ："),
                    this.alphaScaleSlider,
                    $(`<div>`).text("雲の厚み："),
                    this.maxYSlider,
                )
            ),
            $(`<h2>`).text("2. 問題無ければ生成ボタンを押してください。"),
            $(`<div class="render-params">`).append(
                this.widthInput,
                $(`<div>`).text("×"),
                this.heightInput,
                $(`<button>`).text("高画質画像生成").on("click", () => this.renderForExport()),
                $(`<div>`).text("※生成には時間が掛かります。終わったら画像を右クリックしてコピーや保存を行ってください。"),
            ),
            this.resultDiv,
            $(`<h2>`).text("その他"),
            $(`<ul>`).append(
                [
                    "単純な青空を計算で生成します。",
                    "生成した画像の著作権は利用者に帰属します。商用利用可能です（クレジット表記などは歓迎いたします）。",
                    "3Dシンプレックスノイズとレイマーチングを使って雲を3次元風にレンダリングしていますが、ライティング処理が無いためかリアリティにはやや欠けます。",
                ].map(p => $(`<li>`).text(p)),
            )

        );
        this.preview();
    }

    private get seed() { return this.seedInput.val() + ""; }
    private get noise() {
        if (this._noise == null) {
            this._noise = createNoise3D(alea(this.seed));
        }
        return this._noise;
    }
    private get alphaScale() { return parseFloat(this.alphaScaleSlider.val() + ""); }
    private get maxY() { return parseFloat(this.maxYSlider.val() + ""); }

    private createCamera(width: number, height: number): Camera {
        const aspectRatio = width / height;
        const targetY = parseFloat(this.targetYSlider.val() + "");
        const cameraZ = -parseFloat(this.cameraZSlider.val() + "");
        return new Camera(new Vec3(0, 0, cameraZ), new Vec3(0, targetY, cameraZ - 1), new Vec3(0, 1, 0), 70, aspectRatio);
    }

    private createCloud(preview: boolean): Cloud {
        return new Cloud(this.noise, preview ? 20 : 100, this.alphaScale, this.maxY, preview ? 4 : 10);
    }

    private preview() {
        const cloud = this.createCloud(true);
        const camera = this.createCamera(this.previewRenderer.canvas.width, this.previewRenderer.canvas.height);
        this.previewRenderer.update(cloud, camera);
    }

    private renderForExport() {
        const width = Math.max(Math.floor(parseInt(this.widthInput.val() + "")), 1);
        const height = Math.max(Math.floor(parseInt(this.heightInput.val() + "")), 1);
        this.render?.destroy();
        const camera = this.createCamera(width, height);
        this.render = new ExportRenderer(width, height, this.createCloud(false), camera);
        this.resultDiv.empty().append(
            $(this.render!.canvas.canvas),
        );
        this.render.start();
    }
}
