export class Vec3 {
    constructor(
        readonly x: number,
        readonly y: number,
        readonly z: number,
    ) {

    }

    get r() { return this.x; }
    get g() { return this.y; }
    get b() { return this.z; }

    add(o: Vec3): Vec3 {
        return new Vec3(this.x + o.x, this.y + o.y, this.z + o.z);
    }

    mul(v: number): Vec3 {
        return new Vec3(this.x * v, this.y * v, this.z * v);
    }
}