// Vertex Shader

varying vec3 vN;
varying vec3 vL;
varying vec3 vE;
varying vec2 vST;
varying vec3 vMCposition;

uniform float uA;
uniform float uB;
uniform float uC;
uniform float uD;
uniform float uTime; // 时间变量

const vec3 LightPosition = vec3(0., 5., 5.);

// 一个简单的伪随机噪声函数
float explosion(vec3 p) {
    return fract(sin(dot(p, vec3(6.9898, 7.233, 8.435))) * 43758.5453);
}

void main() {
    vMCposition = gl_Vertex.xyz;
    float r = length(vMCposition);

    if (vMCposition.z > 0.0) {
        float displacement = uA * cos(2.0 * 3.14159 * uB * r + uC) * exp(-uD * r);
        vec3 normalizedPosition = normalize(vMCposition);
        vMCposition += normalizedPosition * displacement;
    }

    // 使用噪声函数模拟爆炸效果
    float explosionIntensity = explosion(vMCposition );
    vMCposition += normalize(vMCposition) * explosionIntensity * uTime; // 0.2 为爆炸强度系数

    vN = normalize(vMCposition);
    vST = gl_MultiTexCoord0.st;
    vec4 ECposition = gl_ModelViewMatrix * vec4(vMCposition, 1.);
    vL = LightPosition - ECposition.xyz;
    vE = -ECposition.xyz;
    gl_Position = gl_ModelViewProjectionMatrix * vec4(vMCposition, 1.);
}
