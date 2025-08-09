// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent
uniform sampler2D Asteroid;
uniform float   uTime;


varying  vec3  vN;		   // normal vector
varying  vec3  vL;		   // vector from point to light
varying  vec3  vE;		   // vector from point to eye
varying  vec2  vST;		   // (s,t) texture coordinates



void main() {
    float t = uTime; 
    vec3 brightness = vec3(1.0);

    
    float angle = t * 0.5 + 1.0 * 0.1; 
    vec2 dir = vec2(cos(angle), sin(angle));
    float d = distance(vST - dir * t, vec2(0.5));

    vec4 texColor = texture2D(Asteroid, vST);
    float explosionSize = smoothstep(0.0, 2.0, t); 
    vec3 explosionColor = vec3(1.0, 0.0, 0.0); 

    vec3 explosionEffect = explosionColor * explosionSize;
    vec3 fireworkColor = brightness / vec3(d);
    vec3 finalColor = fireworkColor + explosionEffect;

    gl_FragColor = vec4(finalColor * texColor.rgb, 1.0);
}


