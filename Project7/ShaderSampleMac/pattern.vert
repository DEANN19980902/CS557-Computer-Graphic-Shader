// out variables to be interpolated in the rasterizer and sent to each fragment shader:
#version 120

varying  vec3  vN;	  // normal vector
varying  vec3  vL;	  // vector from point to light
varying  vec3  vE;	  // vector from point to eye
varying  vec2  vST;	  // (s,t) texture coordinates

uniform float uTwist;
varying vec3 vColor;
varying float vX, vY, vZ;
varying float vLightIntensity;
// where the light is:

const vec3 LightPosition = vec3(  0., 5., 5. );

vec3
RotateX( vec3 xyz, float radians )
{
	float c = cos(radians);
	float s = sin(radians);
	vec3 newxyz = xyz;
	newxyz.yz = vec2(
		dot( xyz.yz, vec2( c,-s) ),
		dot( xyz.yz, vec2( s, c) )
	);
	return newxyz;
}

vec3
RotateY( vec3 xyz, float radians )
{
	float c = cos(radians);
	float s = sin(radians);
	vec3 newxyz = xyz;
	newxyz.xz =vec2(
		dot( xyz.xz, vec2( c,s) ),
		dot( xyz.xz, vec2(-s,c) )
	);
	return newxyz;
}

vec3
RotateZ( vec3 xyz, float radians )
{
	float c = cos(radians);
	float s = sin(radians);
	vec3 newxyz = xyz;
	newxyz.xy = vec2(
		dot( xyz.xy, vec2( c,-s) ),
		dot( xyz.xy, vec2( s, c) )
	);
	return newxyz;
}

void
main( )
{
	vec3 position = gl_Vertex.xyz;
    float XNormalized = position.x;
    float YNormalized = position.y;
    float ZNormalized = position.z;

   
    float twist = uTwist * YNormalized;

        
    position = RotateY(position, twist);
    

    //vec3 position = gl_Vertex.xyz; // model coordinates
    vX = position.x;
    vY = position.y;

    vColor = gl_Color.rgb;
    vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal );
    vec3 ECposition = ( gl_ModelViewMatrix * vec4(position, 1.0) ).xyz;
    vZ = -ECposition.z;
	vE = -normalize(ECposition);
	vL = normalize(LightPosition - ECposition);
	vN = normalize(gl_NormalMatrix * gl_Normal);
    vLightIntensity = abs(dot(normalize(vec3(0., 0., 10.) - ECposition), tnorm));
    
    // vX = vX + uAmp * sin( uFreq * vY );
    gl_Position = gl_ModelViewProjectionMatrix * vec4(position, 1.0);
}
