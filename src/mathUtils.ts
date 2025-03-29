export function degToRad(deg: number): number {
    return deg * Math.PI / 180;
}

export function clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(v, max));
}