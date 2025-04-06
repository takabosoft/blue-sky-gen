export const defines = `
precision highp float;
precision highp int;

uniform vec2 u_resolution;
uniform float u_targetY;
uniform float u_cameraZ;
uniform float u_cameraX;
uniform float u_cloudMinY;
uniform float u_cloudThickness;
uniform float u_cloudAlphaScale;
uniform float u_fbmScale;
uniform float u_fbmDepth;
uniform float u_fbmThreshold;
uniform float u_skyColorFader;
uniform float u_yOffset;

uniform int u_cloudMaxSteps;
uniform int u_fbmMaxSteps;
uniform int u_fbmMinSteps;

uniform int u_renderYOffset;

const float PI = 3.14159265359;
`;