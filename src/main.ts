/**
 * Build: npx webpack -w
 * Server: npx live-server docs
 */

import { Canvas } from "./canvas";
import { Vec3 } from "./vec3";

$(() => {
    console.log("OK");

    const canvas = new Canvas(640, 480);
    $(document.body).append(canvas.canvas);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imageData = canvas.ctx.createImageData(canvasWidth, canvasHeight);
    const data = imageData.data;

    for (let j = 0, idx = 0; j < canvasHeight; j++) {
        for (let i = 0; i < canvasWidth; i++, idx += 4) {
            const u = i / (canvasWidth - 1);
            const v = j / (canvasHeight - 1);

            const col = getColor(u, v);
            data[idx + 0] = col.r * 255;
            data[idx + 1] = col.g * 255;
            data[idx + 2] = col.b * 255;
            data[idx + 3] = 255;
        }
    }
    canvas.ctx.putImageData(imageData, 0, 0);
});

function getColor(u: number, v: number): Vec3 {
    return new Vec3(1, 0, 0);
}