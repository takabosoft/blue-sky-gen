import { Renderer, RendererParams } from "./renderer";

export const enum RenderQuality {
    Low = 0,
    Medium = 1,
    High = 2,
    Max = 3,
}

export class PreviewSection {
    readonly renderer = new Renderer(320, 240);
    private readonly targetYSlider = $(`<input type="range" min="0.6" max="3" step="0.00001" value="0.9">`).on("input", () => this.preview());
    private readonly cameraZSlider = $(`<input type="range" min="-10000" max="10000" step="0.00001" value="0">`).on("input", () => this.preview());
    private readonly cameraXSlider = $(`<input type="range" min="-10000" max="10000" step="0.00001" value="0">`).on("input", () => this.preview());
    private readonly minYSlider = $(`<input type="range" min="100" max="400" step="0.00001" value="100">`).on("input", () => this.preview());
    private readonly alphaScaleSlider = $(`<input type="range" min="0" max="0.05" step="0.00001" value="0.03">`).on("input", () => this.preview());
    private readonly thicknessSlider = $(`<input type="range" min="10" max="700" step="0.000011" value="330">`).on("input", () => this.preview());
    private readonly fbmScaleSlider = $(`<input type="range" min="0.00001" max="0.01" step="0.00001" value="0.0006">`).on("input", () => this.preview());
    private readonly fbmDepthSlider = $(`<input type="range" min="0.1" max="1" step="0.00001" value="0.5">`).on("input", () => this.preview());
    private readonly fbmThresholdSlider = $(`<input type="range" min="0.1" max="1" step="0.00001" value="1">`).on("input", () => this.preview());
    private readonly skyColorFaderSlider = $(`<input type="range" min="0.0" max="1" step="0.00001" value="0">`).on("input", () => this.preview());

    readonly element = $(`<section>`).append(
        $(`<h2>`).text("【STEP.1】 各種設定を行ってください"),
        $(`<div class="preview-container">`).append(
            $(this.renderer.webGlCanvas.canvas).on("click", () => {
                console.log(JSON.stringify(this.getRenderParams(RenderQuality.Low)));
            }),
            $(`<div class="params">`).append(
                $(`<div>`).text("カメラ上向き："), this.targetYSlider,
                $(`<div>`).text("カメラ前後："), this.cameraZSlider,
                $(`<div>`).text("カメラ左右："), this.cameraXSlider,
                $(`<div>`).text("雲の高度："), this.minYSlider,
                $(`<div>`).text("雲の濃さ："), this.alphaScaleSlider,
                $(`<div>`).text("雲の厚み："), this.thicknessSlider,
                $(`<div>`).text("雲の細かさ："), this.fbmScaleSlider,
                $(`<div>`).text("雲の細部強調："), this.fbmDepthSlider,
                $(`<div>`).text("雲の量："), this.fbmThresholdSlider,
                $(`<div>`).text("背景の色味："), this.skyColorFaderSlider,
            ),
        ),
    );

    constructor() {
        this.loadPreset(`{"targetY":1.24175,"cameraZ":-19.88072,"cameraX":2067.59443,"cloudMinY":100,"cloudThickness":329.999999,"cloudAlphaScale":0.03,"fbmScale":0.0006,"fbmDepth":0.65,"fbmThreshold":0.62247,"skyColorFader":0,"cloudMaxSteps":40,"fbmMaxSteps":10,"fbmMinSteps":2}`);
        this.preview();
    }

    getRenderParams(quality: RenderQuality): RendererParams {
        let cloudMaxSteps = 0;
        let fbmMaxSteps = 0;
        let fbmMinSteps = 0;

        switch (quality) {
            case RenderQuality.Low:
                cloudMaxSteps = 40;
                fbmMaxSteps = 10;
                fbmMinSteps = 2;
                break;
            default:
            case RenderQuality.Medium:
                cloudMaxSteps = 100;
                fbmMaxSteps = 10;
                fbmMinSteps = 2;
                break;
            case RenderQuality.High:
                cloudMaxSteps = 300;
                fbmMaxSteps = 12;
                fbmMinSteps = 6;
                break;
            case RenderQuality.Max:
                cloudMaxSteps = 500;
                fbmMaxSteps = 20;
                fbmMinSteps = 10;
                break;
        }

        return {
            targetY: parseFloat(this.targetYSlider.val() + ""),
            cameraZ: parseFloat(this.cameraZSlider.val() + ""),
            cameraX: parseFloat(this.cameraXSlider.val() + ""),
            cloudMinY: parseFloat(this.minYSlider.val() + ""),
            cloudThickness: parseFloat(this.thicknessSlider.val() + ""),
            cloudAlphaScale: parseFloat(this.alphaScaleSlider.val() + ""),
            fbmScale: parseFloat(this.fbmScaleSlider.val() + ""),
            fbmDepth: parseFloat(this.fbmDepthSlider.val() + ""),
            fbmThreshold: parseFloat(this.fbmThresholdSlider.val() + ""),
            skyColorFader: parseFloat(this.skyColorFaderSlider.val() + ""),

            cloudMaxSteps,
            fbmMaxSteps,
            fbmMinSteps,
        }
    }

    preview() {
        this.renderer.render(this.getRenderParams(RenderQuality.Low));
    }

    loadPreset(jsonStr: string) {
        const params = JSON.parse(jsonStr) as RendererParams;

        this.targetYSlider.val(params.targetY);
        this.cameraZSlider.val(params.cameraZ);
        this.cameraXSlider.val(params.cameraX);
        this.minYSlider.val(params.cloudMinY);
        this.alphaScaleSlider.val(params.cloudAlphaScale);
        this.thicknessSlider.val(params.cloudThickness);
        this.fbmScaleSlider.val(params.fbmScale);
        this.fbmDepthSlider.val(params.fbmDepth);
        this.fbmThresholdSlider.val(params.fbmThreshold);
        this.skyColorFaderSlider.val(params.skyColorFader);
    }
}