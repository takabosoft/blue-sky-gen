export class Canvas {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.canvas = $(`<canvas>`)[0] as HTMLCanvasElement;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d")!;
    }

    get width() { return this.canvas.width; }
    get height() { return this.canvas.height; }
}