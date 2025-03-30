import { Camera } from "./camera";
import { Canvas } from "./canvas";
import { Cloud } from "./cloud";

export class PreviewRenderer {
    readonly canvas = new Canvas(160, 120);
    private readonly imageData = this.canvas.ctx.createImageData(this.canvas.width, this.canvas.height);

    constructor() { }

    update(cloud: Cloud, camera: Camera): void {
        const data = this.imageData.data;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        for (let j = 0, idx = 0; j < canvasHeight; j++) {
            for (let i = 0; i < canvasWidth; i++, idx += 4) {
                const u = i / (canvasWidth - 1);
                const v = (1 - j / (canvasHeight - 1)); // Y軸反転
                const ray = camera.getRay(u, v);
                const col = cloud.getColor(ray);
                data[idx + 0] = col.r * 255;
                data[idx + 1] = col.g * 255;
                data[idx + 2] = col.b * 255;
                data[idx + 3] = 255;
            }
        }
        this.canvas.ctx.putImageData(this.imageData, 0, 0);
    }
}