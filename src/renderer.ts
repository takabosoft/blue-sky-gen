import { buildFragmentShader } from "./shader/build";
import { WebGLCanvas } from "./webGLCanvas";

export interface RendererParams {
    readonly targetY: number;
    readonly cameraZ: number;
    readonly cameraX: number;
    readonly cloudMinY: number;
    readonly cloudThickness: number;
    readonly cloudAlphaScale: number;
    readonly fbmScale: number;
    readonly fbmDepth: number;
    readonly fbmThreshold: number;
    readonly skyColorFader: number;
    readonly cloudMaxSteps: number;
    readonly fbmMaxSteps: number;
    readonly fbmMinSteps: number;
}

export class Renderer {
    readonly webGlCanvas: WebGLCanvas;
    private targetYUniformLocation!: WebGLUniformLocation | null;
    private cameraZUniformLocation!: WebGLUniformLocation | null;
    private cameraXUniformLocation!: WebGLUniformLocation | null;
    private cloudMinYUniformLocation!: WebGLUniformLocation | null;
    private cloudThicknessUniformLocation!: WebGLUniformLocation | null;
    private cloudAlphaScaleUniformLocation!: WebGLUniformLocation | null;
    private fbmScaleUniformLocation!: WebGLUniformLocation | null;
    private fbmDepthUniformLocation!: WebGLUniformLocation | null;
    private fbmThresholdUniformLocation!: WebGLUniformLocation | null;
    private skyColorFaderUniformLocation!: WebGLUniformLocation | null;
    private cloudMaxStepsUniformLocation!: WebGLUniformLocation | null;
    private fbmMaxStepsUniformLocation!: WebGLUniformLocation | null;
    private fbmMinStepsUniformLocation!: WebGLUniformLocation | null;
    private renderYOffsetUniformLocation!: WebGLUniformLocation | null;

    constructor(
        width: number, 
        height: number,
    ) {
        this.webGlCanvas = new WebGLCanvas(width, height, buildFragmentShader());
        this.setupUniformLocations();
    }

    private setupUniformLocations() {
        this.targetYUniformLocation = this.webGlCanvas.getUniformLocation("u_targetY");
        this.cameraZUniformLocation = this.webGlCanvas.getUniformLocation("u_cameraZ");
        this.cameraXUniformLocation = this.webGlCanvas.getUniformLocation("u_cameraX");
        this.cloudMinYUniformLocation = this.webGlCanvas.getUniformLocation("u_cloudMinY");
        this.cloudThicknessUniformLocation = this.webGlCanvas.getUniformLocation("u_cloudThickness");
        this.cloudAlphaScaleUniformLocation = this.webGlCanvas.getUniformLocation("u_cloudAlphaScale");
        this.fbmScaleUniformLocation = this.webGlCanvas.getUniformLocation("u_fbmScale");
        this.fbmDepthUniformLocation = this.webGlCanvas.getUniformLocation("u_fbmDepth");
        this.fbmThresholdUniformLocation = this.webGlCanvas.getUniformLocation("u_fbmThreshold");
        this.skyColorFaderUniformLocation = this.webGlCanvas.getUniformLocation("u_skyColorFader");
        this.cloudMaxStepsUniformLocation = this.webGlCanvas.getUniformLocation("u_cloudMaxSteps");
        this.fbmMaxStepsUniformLocation = this.webGlCanvas.getUniformLocation("u_fbmMaxSteps");
        this.fbmMinStepsUniformLocation = this.webGlCanvas.getUniformLocation("u_fbmMinSteps");
        this.renderYOffsetUniformLocation = this.webGlCanvas.getUniformLocation("u_renderYOffset");
    }

    render(params: RendererParams, renderYOffset = 0): void {
        if (this.webGlCanvas.isContextLost) {
            this.webGlCanvas.setupWebGL();
            this.setupUniformLocations();
        }

        this.webGlCanvas.uniform1f(this.targetYUniformLocation, params.targetY);
        this.webGlCanvas.uniform1f(this.cameraZUniformLocation, params.cameraZ);
        this.webGlCanvas.uniform1f(this.cameraXUniformLocation, params.cameraX);
        this.webGlCanvas.uniform1f(this.cloudMinYUniformLocation, params.cloudMinY);
        this.webGlCanvas.uniform1f(this.cloudThicknessUniformLocation, params.cloudThickness);
        this.webGlCanvas.uniform1f(this.cloudAlphaScaleUniformLocation, params.cloudAlphaScale);
        this.webGlCanvas.uniform1f(this.fbmScaleUniformLocation, params.fbmScale);
        this.webGlCanvas.uniform1f(this.fbmDepthUniformLocation, params.fbmDepth);
        this.webGlCanvas.uniform1f(this.fbmThresholdUniformLocation, params.fbmThreshold);
        this.webGlCanvas.uniform1f(this.skyColorFaderUniformLocation, params.skyColorFader);
        this.webGlCanvas.uniform1i(this.cloudMaxStepsUniformLocation, params.cloudMaxSteps);
        this.webGlCanvas.uniform1i(this.fbmMaxStepsUniformLocation, params.fbmMaxSteps);
        this.webGlCanvas.uniform1i(this.fbmMinStepsUniformLocation, params.fbmMinSteps);
        this.webGlCanvas.uniform1i(this.renderYOffsetUniformLocation, renderYOffset);

        this.webGlCanvas.render();
    }
}