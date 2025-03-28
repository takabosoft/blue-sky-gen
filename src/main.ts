/**
 * Build: npx webpack -w
 * Server: npx live-server docs
 */

import { Canvas } from "./canvas";
import { Ray } from "./ray";
import { Vec3 } from "./vec3";

$(() => {
    console.log("OK");

    const canvas = new Canvas(640, 480);
    $(document.body).append(canvas.canvas);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imageData = canvas.ctx.createImageData(canvasWidth, canvasHeight);
    const data = imageData.data;

    const aspectRatio = canvasWidth / canvasHeight;
    /** カメラからビューポートまでの距離 */
    const focalLength = 1;
    const viewportHeight = 2.0;
    const viewportWidth = viewportHeight * aspectRatio;
    console.log(viewportWidth, viewportHeight);
    const cameraCenter = Vec3.zero;

    for (let j = 0, idx = 0; j < canvasHeight; j++) {
        for (let i = 0; i < canvasWidth; i++, idx += 4) {
            const u = i / (canvasWidth - 1);
            const v = (1 - j / (canvasHeight - 1)); // Y軸反転
            const pixelCenter = new Vec3(u * viewportWidth - viewportWidth / 2, v * viewportHeight - viewportHeight / 2, -focalLength); // 右手座標系なので負のzが奥
            const ray = new Ray(cameraCenter, pixelCenter.sub(cameraCenter).normal);
            const col = getColor(ray);
            data[idx + 0] = col.r * 255;
            data[idx + 1] = col.g * 255;
            data[idx + 2] = col.b * 255;
            data[idx + 3] = 255;
        }
    }
    canvas.ctx.putImageData(imageData, 0, 0);
});

function getColor(r: Ray): Vec3 {
    const a = r.direction.y / 2 + 0.5;
    return Vec3.mix(new Vec3(1, 1, 1), new Vec3(0.5, 0.7, 1.0), a);
}