/**
 * Build: npx webpack -w
 * Server: npx live-server docs
 */

import { Camera } from "./camera";
import { Canvas } from "./canvas";
import { Vec3 } from "./vec3";
import { Cloud } from "./cloud";
import { createNoise3D, NoiseFunction3D } from "simplex-noise";
import alea from "alea";

$(() => new PageController());

class PageController {
    private readonly canvas = new Canvas(160, 120);
    private _noise?: NoiseFunction3D;
    private readonly seedInput = $(`<input type="text" value="seed">`).on("input", () => {
        this._noise = undefined;
        this.preview();
    });
    private readonly targetYSlider = $(`<input type="range" min="0" max="3" step="0.001" value="0.9">`).on("input", () => this.preview());
    private readonly cameraZSlider = $(`<input type="range" min="0" max="10000" step="0.001" value="0">`).on("input", () => this.preview());
    private readonly alphaScaleSlider = $(`<input type="range" min="0" max="0.05" step="0.001" value="0.03">`).on("input", () => this.preview());
    private readonly maxYSlider = $(`<input type="range" min="150" max="400" step="0.001" value="200">`).on("input", () => this.preview());

    private readonly widthInput = $(`<input type="number" min="1" value="800">`);
    private readonly heightInput = $(`<input type="number" min="1" value="600">`);
    private readonly resultDiv = $(`<div>`);

    private render?: Render;

    constructor() {
        $(document.body).append(
            $(`<h2>`).text("1. 各種設定を行ってください。"),
            $(`<div class="preview-container">`).append(
                this.canvas.canvas,
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
                $(`<button>`).text("高画質画像生成").on("click", () => this.startRender()),
                $(`<div>`).text("※生成には時間が掛かります。終わったら画像を右クリックしてコピーや保存を行ってください。"),
            ),
            this.resultDiv,

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

    preview() {
        const cloud = new Cloud(this.noise, 40, this.alphaScale, this.maxY);
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const imageData = this.canvas.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const camera = this.createCamera(canvasWidth, canvasHeight);

        for (let j = 0, idx = 0; j < canvasHeight; j++) {
            for (let i = 0; i < canvasWidth; i++, idx += 4) {
                const u = i / (canvasWidth - 1);
                const v = (1 - j / (canvasHeight - 1)); // Y軸反転
                const ray = camera.get_ray(u, v);
                const col = cloud.getColor(ray);
                data[idx + 0] = col.r * 255;
                data[idx + 1] = col.g * 255;
                data[idx + 2] = col.b * 255;
                data[idx + 3] = 255;
            }
        }
        this.canvas.ctx.putImageData(imageData, 0, 0);
    }

    private startRender() {
        const width = Math.max(Math.floor(parseInt(this.widthInput.val() + "")), 1);
        const height = Math.max(Math.floor(parseInt(this.heightInput.val() + "")), 1);
        this.render?.destroy();
        const camera = this.createCamera(width, height);
        this.render = new Render(width, height, new Cloud(this.noise, 100, this.alphaScale, this.maxY), camera);
        this.resultDiv.empty().append(
            $(this.render!.canvas.canvas).addClass("render-canvas"),
        );
        this.render.start();
    }
}

class Render {
    readonly canvas: Canvas;
    private enable = true;

    constructor(
        width: number, 
        height: number,
        private readonly cloud: Cloud,
        private readonly camera: Camera,
    ) {
        this.canvas = new Canvas(width, height);
    }

    start() {

        const imageData = this.canvas.ctx.createImageData(this.canvas.width, 1);
        const data = imageData.data;
        let j = 0;

        const frame = () => {
            if (!this.enable) {
                return;
            }

            const canvasWidth = this.canvas.width;
            const canvasHeight = this.canvas.height;

            for (let i = 0, idx = 0; i < canvasWidth; i++, idx += 4) {
                const u = i / (canvasWidth - 1);
                const v = (1 - j / (canvasHeight - 1)); // Y軸反転
                const ray = this.camera.get_ray(u, v);
                const col = this.cloud.getColor(ray);
                data[idx + 0] = col.r * 255;
                data[idx + 1] = col.g * 255;
                data[idx + 2] = col.b * 255;
                data[idx + 3] = 255;
            }
            this.canvas.ctx.putImageData(imageData, 0, j);

            j++;
            if (j < this.canvas.height) {
                requestAnimationFrame(frame);
            }    
        }
        requestAnimationFrame(frame);
    }

    destroy() {
        this.enable = false;
    }
}