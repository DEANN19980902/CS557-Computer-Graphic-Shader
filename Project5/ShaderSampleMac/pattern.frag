

// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float uPower;
uniform float uRtheta;
uniform float uMosaic;
uniform float uBlend;
uniform sampler2D TexUnitA;
uniform sampler2D TexUnitB;

// in variables from the vertex shader and interpolated in the rasterizer:

varying  vec3  vN;		   // normal vector
varying  vec3  vL;		   // vector from point to light
varying  vec3  vE;		   // vector from point to eye
varying  vec2  vST;		   // (s,t) texture coordinates

const vec4 BLACK = vec4( 0., 0., 0., 1. );

	
	float atan2( float y, float x ){
		const float PI = 3.14159265358979323846;
			if( x == 0. )
			{
					if( y >= 0. )
							return  PI/2.;
					else
							return -PI/2.;
			}
			return atan(y,x);
	}

void
main( )
{	
	
	vec2 st = vST - vec2(0.5, 0.5); // Centering the texture coordinates
	float r = length(st); // Original radius
	float rPrime = pow((r * 2.0), uPower); // Adjusted radius for fisheye

	float theta = atan2(st.t, st.s); // Original angle
	float thetaPrime = theta - uRtheta * r; // Adjusted angle for whirl

	st = rPrime * vec2(cos(thetaPrime), sin(thetaPrime)); // Apply the effects
	st += vec2(1.0, 1.0);                       		        // change the range to 0. to +2.
	st *= 0.5;
	
	
	// Calculate which block of pixels this pixel will be in
	if (uMosaic > 0.0) {
		int numins = int(st.s / uMosaic);
		int numint = int(st.t / uMosaic);

		// 计算块的中心
		float sc = (float(numins) * uMosaic) + uMosaic / 2.;
		float tc = (float(numint) * uMosaic) + uMosaic / 2.;

	
		st.s = sc;
		st.t = tc;
	}

	
	// determine the color using the square-boundary equations:

	
	// apply the per-fragmewnt lighting to myColor:
	

	//vec3 Normal = normalize(vN);
	//vec3 Light  = normalize(vL);
	//vec3 Eye    = normalize(vE);
	if( any( lessThan(st, vec2(0.0, 0.0)) ) )
	{
		gl_FragColor = BLACK;
	}
	else
	{
		if( any( greaterThan(st, vec2(1.0, 1.0)) ) )
		{
			gl_FragColor = BLACK;
		}
		else
		{
			// sample both textures at (s,t) giving back two rgb vec3's:
			// mix the two rgb's using uBlend
			vec3 colorA = texture2D(TexUnitA, st).rgb;
			vec3 colorB = texture2D(TexUnitB, st).rgb;

			// mix the two colors using uBlend
			vec3 rgb = mix(colorA, colorB, uBlend);

			gl_FragColor = vec4(rgb, 1.0);
		}
	}

	
}

