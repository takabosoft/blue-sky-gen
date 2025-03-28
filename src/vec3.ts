export class Vec3 {
    constructor(
        readonly x: number,
        readonly y: number,
        readonly z: number,
    ) {

    }

    static readonly zero = new Vec3(0, 0, 0);

    get r() { return this.x; }
    get g() { return this.y; }
    get b() { return this.z; }
    get length() { return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2); }
    get normal() {
        const len = this.length;
        return len > 0 ? new Vec3(this.x / len, this.y / len, this.z / len) : Vec3.zero;
    }

    add(o: Vec3): Vec3 {
        return new Vec3(this.x + o.x, this.y + o.y, this.z + o.z);
    }

    sub(o: Vec3): Vec3 {
        return new Vec3(this.x - o.x, this.y - o.y, this.z - o.z);
    }

    mul(v: number): Vec3 {
        return new Vec3(this.x * v, this.y * v, this.z * v);
    }

    /** 外積 */
    cross(v: Vec3): Vec3 {
        return new Vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    static mix(v1: Vec3, v2: Vec3, a: number): Vec3 {
        return v1.mul(1 - a).add(v2.mul(a));
    }


}