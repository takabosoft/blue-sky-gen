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

$(() => {
    new PageController();
});

class PageController {
    private readonly canvas = new Canvas(160, 120);
    private _noise?: NoiseFunction3D;
    private readonly seedInput = $(`<input type="text" value="seed">`).on("input", () => {
        this._noise = undefined;
        this.preview();
    });
    private readonly targetYSlider = $(`<input type="range" min="0" max="3" step="0.001" value="0.9">`).on("input", () => this.preview());
    private readonly cameraZSlider = $(`<input type="range" min="0" max="10000" step="0.001" value="0">`).on("input", () => this.preview());

    constructor() {
        $(document.body).append(
            $(`<div class="preview-container">`).append(
                this.canvas.canvas,
                $(`<div class="params">`).append(
                    $(`<div>`).text("シード値："),
                    this.seedInput,
                    $(`<div>`).text("カメラの向き："),
                    this.targetYSlider,
                    $(`<div>`).text("カメラ位置："),
                    this.cameraZSlider,
                )
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

    preview() {
        const cloud = new Cloud(this.noise);
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const imageData = this.canvas.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;

        const aspectRatio = canvasWidth / canvasHeight;

        const targetY = parseFloat(this.targetYSlider.val() + "");
        const cameraZ = -parseFloat(this.cameraZSlider.val() + "");
        const camera = new Camera(new Vec3(0, 0, cameraZ), new Vec3(0, targetY, cameraZ - 1), new Vec3(0, 1, 0), 70, aspectRatio);

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
}