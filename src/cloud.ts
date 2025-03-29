import { NoiseFunction3D } from "simplex-noise";
import { Skybox } from "./skybox";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { clamp } from "./mathUtils";

export class Cloud {
    private readonly cloudCol = new Vec3(1, 1, 1);
    private readonly minY = 100;
    private readonly maxY = 200;
    private skybox = new Skybox();

    constructor(private readonly noise: NoiseFunction3D) {
    }

    private calcHitAtY(y: number, ray: Ray): number | undefined {
        if (ray.direction.y == 0) { return undefined; }
        const t = (y - ray.origin.y) / ray.direction.y;
        if (t <= 0) {
            return undefined;
        }
        return t;
    }

    private getNoise(pos: Vec3, scale: number, threshold: number): number {
        const noise = this.noise(pos.x * scale, pos.y * scale, pos.z * scale);
        const noise2 = (noise + 1) / 2; // 0-1
        return noise2 >= threshold ? ((noise2 - threshold) * (1 / (1 - threshold))) : 0;
    }

    private sampleCloudDensity(p: Vec3): number {
        //return this.getNoise(p, 0.01, 0.3) * this.getNoise(p, 0.001, 0) + this.getNoise(p, 0.5, 0.5) * this.getNoise(p, 0.002, 0.5);
        return this.getNoise(p, 0.001, 0.2) * this.getNoise(p, 0.01, 0.5) + this.getNoise(p, 0.005, 0.5) * this.getNoise(p, 0.002, 0.5) + this.getNoise(p, 0.0001, 0.2) * 0.1;
    }

    private march(r: Ray): number {
        let accumulatedDensity = 0.0; // 密度の累積
        let transmittance = 1.0; // 透過率
    
        const tMin = this.calcHitAtY(this.minY, r);
        const tMax = this.calcHitAtY(this.maxY, r);
        if (tMin == null || tMax == null ){ return 0; }
        const maxSteps = 40;
        const stepSize = (tMax - tMin) / maxSteps;

        let t = tMin;

        for (let i = 0; i < maxSteps; i++) {
            const p = r.at(t);
            if ((p.sub(r.origin)).length > 1000) { break; }
            const density = this.sampleCloudDensity(p);
            const alpha = clamp(density * stepSize * 0.030, 0, 1);
            
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
