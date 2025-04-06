export const skybox = `


vec3 getSkybox(Ray r) {
    vec3 skyTopColors[2];
    skyTopColors[0] = vec3(0.0, 35.0 / 255.0, 127.0 / 255.0);
    skyTopColors[1] = vec3(0.0, 129.0 / 189.0, 223.0 / 255.0);

    vec3 skyBottomColors[2];
    skyBottomColors[0] = vec3(94.0 / 255.0, 192.0 / 255.0, 249.0 / 255.0), 
    skyBottomColors[1] = vec3(159.0 / 255.0, 210.0 / 255.0, 214.0 / 255.0);
    vec3 landColor = vec3(0.0, 0.5, 1.0);

    //int colorIdx = int(u_skyColorFader);
    float alpha = clamp(u_skyColorFader, 0.0, 1.0);
    vec3 bottomColor = mix(skyBottomColors[0], skyBottomColors[1], alpha);
    vec3 topColor = mix(skyTopColors[0], skyTopColors[1], alpha);

    // >= 0.0だと丸め誤差の差異がフレームごとに出る？
    return r.direction.y > 0.0 ? mix(bottomColor, topColor, r.direction.y) : landColor;
}
`;