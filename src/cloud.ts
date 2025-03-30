import { NoiseFunction3D } from "simplex-noise";
import { Skybox } from "./skybox";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { clamp } from "./mathUtils";

const fbmTable: { scale: number, depth: number }[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({
    scale: 0.0006 * 4 ** i,
    depth: (0.5 ** i),
}))

export class Cloud {
    private readonly cloudCol = new Vec3(1, 1, 1);
    private readonly minY = 100;

    private skybox = new Skybox();

    constructor(
        private readonly noise: NoiseFunction3D,
        private readonly maxSteps: number,
        private readonly alphaScale: number,
        private readonly maxY: number,
        private readonly fbmSteps: number,
    ) {
    }

    private calcHitAtY(y: number, ray: Ray): number | undefined {
        if (ray.direction.y == 0) { return undefined; }
        const t = (y - ray.origin.y) / ray.direction.y;
        if (t <= 0) {
            return undefined;
        }
        return t;
    }

    private getNoise(pos: Vec3, scale: number): number {
        return this.noise(pos.x * scale, pos.y * scale, pos.z * scale);
    }

    private sampleCloudDensity(p: Vec3): number {
        // FBM
        let res = 0;
        for (let i = 0; i < this.fbmSteps; i++) {
            res += this.getNoise(p, fbmTable[i].scale) * fbmTable[i].depth;
        }
        return res;
    }

    private march(r: Ray): number {
        let accumulatedDensity = 0.0; // 密度の累積
        let transmittance = 1.0; // 透過率

        const tMin = this.calcHitAtY(this.minY, r);
        const tMax = this.calcHitAtY(this.maxY, r);
        if (tMin == null || tMax == null) { return 0; }
        const maxSteps = this.maxSteps;
        const stepSize = (tMax - tMin) / maxSteps;
        const alphaScale = this.alphaScale;

        let t = tMin;

        for (let i = 0; i < maxSteps; i++) {
            const p = r.at(t);
            const density = this.sampleCloudDensity(p);
            const alpha = clamp(density * stepSize * alphaScale, 0, 1);

            accumulatedDensity += alpha * transmittance;
            transmittance *= (1.0 - alpha);
            if (transmittance < 0.01) break;
            t += stepSize;
        }

        return clamp(accumulatedDensity, 0, 1);
    }

    getColor(r: Ray): Vec3 {
        const bg = this.skybox.getColor(r);
        return Vec3.mix(bg, this.cloudCol, this.march(r));
    }
}
