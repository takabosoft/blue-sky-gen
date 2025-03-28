import { Vec3 } from "./vec3";

/** レイ */
export class Ray {
    /**
     * 
     * @param origin 原点
     * @param direction 方向　※今回は単位ベクトルにする
     */
    constructor(
        readonly origin: Vec3,
        readonly direction: Vec3,
    ) {

    }

    at(t: number): Vec3 {
        return this.origin.add(this.direction.mul(t));
    }
}