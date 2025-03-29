/**
 * Build: npx webpack -w
 * Server: npx live-server docs
 */

import { Camera } from "./camera";
import { Canvas } from "./canvas";
import { Vec3 } from "./vec3";
import { Cloud } from "./cloud";

$(() => {
    new PageController();
});

class PageController {
    private readonly canvas = new Canvas(160, 120);
    private targetY = 0.9;
    private cloud = new Cloud("seed");

    constructor() {
        const slider = $(`<input type="range" min="0" max="3" step="0.001" value="${this.targetY}">`).on("input", () => {
            const f = parseFloat(slider.val() + "");
            this.targetY = f;
            this.render();
        });
        $(document.body).append(
            this.canvas.canvas,
            slider,
        );
        this.render();
    }

    render() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const imageData = this.canvas.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;

        const aspectRatio = canvasWidth / canvasHeight;
        const camera = new Camera(new Vec3(0, 0, 0), new Vec3(0, this.targetY, -1), new Vec3(0, 1, 0), 70, aspectRatio);

        for (let j = 0, idx = 0; j < canvasHeight; j++) {
            for (let i = 0; i < canvasWidth; i++, idx += 4) {
                const u = i / (canvasWidth - 1);
                const v = (1 - j / (canvasHeight - 1)); // Y軸反転
                const ray = camera.get_ray(u, v);
                const col = this.cloud.getColor(ray);
                data[idx + 0] = col.r * 255;
                data[idx + 1] = col.g * 255;
                data[idx + 2] = col.b * 255;
                data[idx + 3] = 255;
            }
        }
        this.canvas.ctx.putImageData(imageData, 0, 0);
    }
}