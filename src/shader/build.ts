import { camera } from "./camera";
import { cloud } from "./cloud";
import { defines } from "./defines";
import { ray } from "./ray";
import { simplexNoise } from "./simplexNoise";
import { skybox } from "./skybox";

/** 
 * フラグメントシェーダーを組み立てます。
 * - 1ソースで全部やるのがしんどいので可能な範囲で分割します。
 * - 固定値を引数から変更出来るようにもできます。
 */
export function buildFragmentShader(): string {
    return `${defines}
${simplexNoise}
${ray}
${camera}
${skybox}
${cloud}

void main() {
    vec3 lookFrom = vec3(u_cameraX, 0.0, -u_cameraZ);
    cameraOrigin = lookFrom;
    vec3 lookAt = vec3(lookFrom.x, u_targetY, lookFrom.z - 1.0);
    vec3 vUp = vec3(0.0, 1.0, 0.0);
    Ray ray = cameraGetRay(lookFrom, lookAt, vUp, 70.0);
    
    vec3 sky = getSkybox(ray);
    vec4 cloud = getCloudColor(ray);
    vec3 col = mix(sky, cloud.rgb, cloud.a);
    gl_FragColor = vec4(col, 1.0);
}
`;
}