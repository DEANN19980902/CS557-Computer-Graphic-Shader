uniform float   uOffsetS, uOffsetT, uBlend; 
varying vec2 		vST;
varying float		vLightIntensity;
varying vec3		vColor;
const float TWOPI = 2.*3.14159265;
const vec3 LIGHTPOS = vec3( 5., 10., 10. );


void
main( )
{	
	// original model coords (sphere):
	
	vec4 vertex0 = gl_Vertex;
	vec3 norm0 = gl_Normal;
	// circle coords:
	vST = gl_MultiTexCoord0.st;
	float radius = 1.- vST.t;
	float theta = TWOPI * vST.s;
	vec4 circle = vec4( radius*cos(theta), radius*sin(theta), 0., 1. ); vec3 circlenorm = vec3( 0., 0., 1. );
	vST += vec2( uOffsetS, uOffsetT );
	// blend:
	vec4 theVertex = mix( vertex0, circle, uBlend );
	vec3 theNormal = normalize( mix( norm0, circlenorm, uBlend ) );
	// do the lighting:
	vec3 tnorm = normalize( vec3( gl_NormalMatrix * theNormal ) );
	vec3 ECposition = vec3( gl_ModelViewMatrix * theVertex ); vLightIntensity = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	vColor = gl_Color.rgb;
	gl_Position = gl_ModelViewProjectionMatrix * theVertex;
}