// out variables to be interpolated in the rasterizer and sent to each fragment shader:

varying  vec3  vN;	  // normal vector
varying  vec3  vL;	  // vector from point to light
varying  vec3  vE;	  // vector from point to eye
varying  vec2  vST;	  // (s,t) texture coordinates
varying  vec3  vMCposition;


uniform float uA;
uniform float uB;
uniform float uC;
uniform float uD;

// where the light is:

const vec3 LightPosition = vec3(  0., 5., 5. );

void main() {
    vMCposition = gl_Vertex.xyz;
    float r = length(vMCposition);

     float xEffect = abs(vMCposition.z); // 根据X轴距离中心的距离计算影响因子
    xEffect = smoothstep(0.0, 1.0, xEffect); // 使用平滑步骤函数使效果更平滑

    if (vMCposition.z > 0.0) {
        float displacement = -uA * exp(-uD * r); // 使用负指数函数直接凹陷
        vec3 normalizedPosition = normalize(vMCposition);
        vMCposition += normalizedPosition * displacement * xEffect; // 应用X轴影响因子
    }

    
    vN = normalize(vMCposition);
    vST = gl_MultiTexCoord0.st;
    vec4 ECposition = gl_ModelViewMatrix * vec4(vMCposition, 1.);
    vL = LightPosition - ECposition.xyz;
    vE = -ECposition.xyz;
    gl_Position = gl_ModelViewProjectionMatrix * vec4(vMCposition, 1.);
}