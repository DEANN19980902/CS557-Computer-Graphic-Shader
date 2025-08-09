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

void
main( )
{	
	vMCposition = gl_Vertex.xyz;
	float r = sqrt(vMCposition.x * vMCposition.x + vMCposition.y * vMCposition.y);
    vMCposition.z = uA * cos(2.0 * 3.14159 * uB * r + uC) * exp(-uD * r);
	float dzdr = uA * (-sin(2.0 * 3.14159 * uB * r + uC) * 2.0 * 3.14159 * uB * exp(-uD * r) + cos(2.0 * 3.14159 * uB * r + uC) * -uD * exp(-uD * r));
    float dzdx = dzdr * (vMCposition.x / r);
    float dzdy = dzdr * (vMCposition.y / r);

    vec3 Tx = vec3(1.0, 0.0, dzdx);
    vec3 Ty = vec3(0.0, 1.0, dzdy);

    vN = normalize(cross(Tx, Ty));
	
	vST = gl_MultiTexCoord0.st;
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
	//vN = normalize( gl_NormalMatrix * Normal );  // normal vector
	vL = LightPosition - ECposition.xyz;	    // vector from the point
							// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;       // vector from the point
							// to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * vec4( vMCposition, 1. );
}
