

// square-equation uniform variables -- these should be set every time Display( ) is called:
uniform float uS0, uT0;
uniform float uPower;
uniform sampler2D TexUnitA;


// in variables from the vertex shader and interpolated in the rasterizer:

varying  vec3  vN;		   // normal vector
varying  vec3  vL;		   // vector from point to light
varying  vec3  vE;		   // vector from point to eye
varying  vec2  vST;		   // (s,t) texture coordinates

const vec4 BLACK = vec4( 0., 0., 0., 1. );

	

void
main( )
{	
	
	vec2 delta = vST - vec2(uS0, uT0);
    vec2 st = vec2(uS0, uT0) + sign(delta) * pow(abs(delta), vec2(uPower));
    vec4 distortedColor = texture2D(TexUnitA, st);

    
    vec3 negativeColor = vec3(1.0, 1.0, 1.0) - distortedColor.rgb;

    
    gl_FragColor = vec4(negativeColor, 1.0);
	// determine the color using the square-boundary equations:

	
	// apply the per-fragmewnt lighting to myColor:
	

	//vec3 Normal = normalize(vN);
	//vec3 Light  = normalize(vL);
	//vec3 Eye    = normalize(vE);
	

	
}

