import { Camera } from "./camera";
import { Canvas } from "./canvas";
import { Cloud } from "./cloud";

export class ExportRenderer {
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
                const ray = this.camera.getRay(u, v);
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
            } else {
                // <img>に置き換えます。スマホ対応
                const img = new Image();
                img.src = this.canvas.canvas.toDataURL("image/png");
                $(this.canvas.canvas).replaceWith(img);
            }
        }
        requestAnimationFrame(frame);
    }

    destroy() {
        this.enable = false;
    }
}