/**
 * Build: npx webpack -w
 * Server: npx live-server docs
 */

import { createNoise2D, createNoise3D } from "simplex-noise";
import { Camera } from "./camera";
import { Canvas } from "./canvas";
import { Ray } from "./ray";
import { Vec3 } from "./vec3";
import { clamp } from "./mathUtils";



$(() => {
    new App();
});

class FlatCloud {
    private readonly noise = createNoise2D();
    private readonly cloudCol = new Vec3(1, 1, 1);

    private getNoise(pos: Vec3, scale: number, threshold: number): number {
        const noise = this.noise(pos.x * scale, pos.z * scale);
        const noise2 = (noise + 1) / 2; // 0-1
        return noise2 >= threshold ? ((noise2 - threshold) * (1 / (1 - threshold))) : 0;
    }

    getColor(r: Ray, bg: Vec3): Vec3 {
        const y = 300; // 高度

        if (r.direction.y > 0) {
            const t = (y - r.origin.y) / r.direction.y;
            const pos = r.at(t); // 雲座標と当たった場所
            if (pos.z > -3000) {
                const n = this.getNoise(pos, 0.0005, 0.4) * this.getNoise(pos, 0.005, 0.0);

                return Vec3.mix(bg, this.cloudCol, n);
            }

        }
        return bg;
    }
}

class VolumeCloud {
    private readonly noise = createNoise3D();
    private readonly cloudCol = new Vec3(1, 1, 1);

    private getNoise(pos: Vec3, scale: number, threshold: number): number {
        const noise = this.noise(pos.x * scale, pos.y * scale, pos.z * scale);
        const noise2 = (noise + 1) / 2; // 0-1
        return noise2 >= threshold ? ((noise2 - threshold) * (1 / (1 - threshold))) : 0;
    }

    private sampleCloudDensity(p: Vec3): number {
        if (p.y > 100 && p.y < 200) {
            return this.getNoise(p, 0.01, 0.3);
        }
        return 0;
    }

    private march(r: Ray) {
        let accumulatedDensity = 0.0; // 密度の累積
        let transmittance = 1.0; // 透過率
    
        const maxSteps = 400;
        const stepSize = 1;
        let t = 80;
        for (let i = 0; i < maxSteps; i++) {
            const p = r.at(t);
            const density = this.sampleCloudDensity(p);
            if (p.y > 200) { break; }
    
            const alpha = clamp(density * stepSize * 0.008, 0, 1);
    
            accumulatedDensity += alpha * transmittance;
            transmittance *= (1.0 - alpha);
    
            if (transmittance < 0.01) break;
    
            t += stepSize;
        }
    
        return clamp(accumulatedDensity, 0, 1);
    }

    getColor(r: Ray, bg: Vec3): Vec3 {
        return Vec3.mix(bg, this.cloudCol, this.march(r));
    }
}

class App {
    private readonly canvas = new Canvas(640, 480);
    private targetY = 0.5;
    private cloud = new VolumeCloud();
    private imageData: ImageData;

    constructor() {
        const slider = $(`<input type="range" min="0" max="3" step="0.001" value="${this.targetY}">`).on("input", () => {
            const f = parseFloat(slider.val() + "");
            //console.log(f);
            this.targetY = f;
            this.render();
        });
        $(document.body).append(
            this.canvas.canvas,
            slider,
        );
        this.imageData = this.canvas.ctx.createImageData(this.canvas.width, this.canvas.height);
        this.render();
    }

    render() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const data = this.imageData.data;

        const aspectRatio = canvasWidth / canvasHeight;
        const camera = new Camera(new Vec3(0, 0, 0), new Vec3(0, this.targetY, -1), new Vec3(0, 1, 0), 70, aspectRatio);

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
        this.canvas.ctx.putImageData(this.imageData, 0, 0);
    }

    private getBackgroundColor(r: Ray): Vec3 {
        if (r.direction.y >= 0) {
            return Vec3.mix(new Vec3(94 / 255, 192 / 255, 249 / 255), new Vec3(0, 35 / 255, 127 / 255), r.direction.y);
        }
        const a = r.direction.y / 2 + 0.5;
        return Vec3.mix(new Vec3(1, 1, 1), new Vec3(0, 35 / 255, 127 / 255), a);
    }

    private getColor(r: Ray): Vec3 {
        let col = this.getBackgroundColor(r);
        col = this.cloud.getColor(r, col);
        return col;
    }
}