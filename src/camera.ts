import { degToRad } from "./mathUtils";
import { Ray } from "./ray";
import { Vec3 } from "./vec3";

export class Camera {
    private readonly origin: Vec3;
    private readonly lowerLeftCorner: Vec3;
    private readonly horizontal: Vec3;
    private readonly vertical: Vec3;

    constructor(
        lookFrom: Vec3,
        lookAt: Vec3,
        vup: Vec3,
        vFov: number,
        aspectRatio: number,
    ) {
        const theta = degToRad(vFov);
        const h = Math.tan(theta / 2);
        const viewportHeight = 2.0 * h;
        const viewportWidth = aspectRatio * viewportHeight;


        const w = lookFrom.sub(lookAt).normal;
        const u = vup.cross(w).normal;
        const v = w.cross(u);

        this.origin = lookFrom;
        this.horizontal = u.mul(viewportWidth);
        this.vertical = v.mul(viewportHeight);
        this.lowerLeftCorner = this.origin.sub(this.horizontal.mul(0.5)).sub(this.vertical.mul(0.5)).sub(w);
    }

    getRay(u: number, v: number): Ray {
        return new Ray(this.origin, this.lowerLeftCorner.add(this.horizontal.mul(u)).add(this.vertical.mul(v)).sub(this.origin).normal);
    }
}
