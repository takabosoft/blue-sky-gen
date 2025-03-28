/**
 * Build: npx webpack -w
 * Server: npx live-server docs
 */

import { Camera } from "./camera";
import { Canvas } from "./canvas";
import { Ray } from "./ray";
import { Vec3 } from "./vec3";

$(() => {
    new App();
});

class App {
    private readonly canvas = new Canvas(640, 480);
    private targetY = 0;

    constructor() {
        const slider = $(`<input type="range" min="0" max="3" step="0.001" value="0">`).on("input", () => {
            const f = parseFloat(slider.val() + "");
            //console.log(f);
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
        const imageData = this.canvas.ctx.createImageData(canvasWidth, canvasHeight);
        const data = imageData.data;

        const aspectRatio = canvasWidth / canvasHeight;
        const camera = new Camera(new Vec3(0, 0, 0), new Vec3(0, this.targetY, -1), new Vec3(0, 1, 0), 90, aspectRatio);

        for (let j = 0, idx = 0; j < canvasHeight; j++) {
            for (let i = 0; i < canvasWidth; i++, idx += 4) {
                const u = i / (canvasWidth - 1);
                const v = (1 - j / (canvasHeight - 1)); // Y軸反転
                const ray = camera.get_ray(u, v);
                const col = this.getColor(ray);
                data[idx + 0] = col.r * 255;
                data[idx + 1] = col.g * 255;
                data[idx + 2] = col.b * 255;
                data[idx + 3] = 255;
            }
        }
        this.canvas.ctx.putImageData(imageData, 0, 0);
    }

    private getColor(r: Ray): Vec3 {
        if (r.direction.y >= 0) {
            return Vec3.mix(new Vec3(94 / 255, 192 / 255, 249 / 255), new Vec3(0, 35 / 255, 127 / 255), r.direction.y);
        }
        const a = r.direction.y / 2 + 0.5;
        return Vec3.mix(new Vec3(1, 1, 1), new Vec3(0, 35 / 255, 127 / 255), a);
    }
}