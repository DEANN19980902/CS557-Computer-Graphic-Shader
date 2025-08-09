#version 120

uniform sampler3D Noise3; 
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uEta;
uniform float uMix;
uniform float uWhiteMix;
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;

varying vec3 vMC; 
varying vec3 vNs; 
varying vec3 vEs;

const vec3 WHITE = vec3( 1., 1.,1. );

vec3 RotateNormal(float angx, float angy, vec3 n) {
    float cx = cos(angx);
    float sx = sin(angx);
    float cy = cos(angy);
    float sy = sin(angy);

    // Rotate about x-axis
    float yp = n.y*cx - n.z*sx;
    n.z = n.y*sx + n.z*cx;
    n.y = yp;

    // Rotate about y-axis
    float xp = n.x*cy + n.z*sy;
    n.z = -n.x*sy + n.z*cy;
    n.x = xp;

    return normalize(n);
}

void main() 
{
    // Normalize vectors
    vec3 Normal = normalize(vNs);
    vec3 EyeDirection = normalize(gl_NormalMatrix * vEs);

    vec4 noiseSample = texture3D(Noise3, uNoiseFreq * vMC);

    // Fetch noise values to rotate the normal vector
    vec4 nvx = texture3D(Noise3, uNoiseFreq * vMC);
    float angx = (nvx.r + nvx.g + nvx.b + nvx.a - 2.0); // -1 to +1 range
    angx *= uNoiseAmp;

    vec4 nvy = texture3D(Noise3, uNoiseFreq * vec3(vMC.xy, vMC.z + 0.5));
    float angy = (nvy.r + nvy.g + nvy.b + nvy.a - 2.0); // -1 to +1 range
    angy *= uNoiseAmp;

    // Rotate the normal with the retrieved angles
    Normal = RotateNormal(angx, angy, Normal);
    Normal = normalize(gl_NormalMatrix * Normal);

    vec3 reflectVector = reflect( EyeDirection, Normal );
	vec3 reflectColor = textureCube( uReflectUnit, reflectVector ).rgb;

	vec3 refractVector = refract( EyeDirection, Normal, uEta );

	vec3 refractColor;
	if( all( equal( refractVector, vec3(0.,0.,0.) ) ) )
	{
		refractColor = reflectColor;
	}
	else
	{
		refractColor = textureCube( uRefractUnit, refractVector ).rgb;
		refractColor = mix( refractColor, WHITE, uWhiteMix );
	}
	gl_FragColor = vec4(mix( refractColor, reflectColor, uMix ),1);
}

