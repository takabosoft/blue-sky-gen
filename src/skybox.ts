import { Ray } from "./ray";
import { Vec3 } from "./vec3";

export class Skybox {
    private readonly skyColor1 = new Vec3(94 / 255, 192 / 255, 249 / 255);
    private readonly skyColor2 = new Vec3(0, 35 / 255, 127 / 255);
    private readonly landColor = new Vec3(0, 0.5, 1);

    getColor(r: Ray): Vec3 {
        if (r.direction.y >= 0) {
            return Vec3.mix(this.skyColor1, this.skyColor2, r.direction.y);
        }
        return this.landColor;
    }
}