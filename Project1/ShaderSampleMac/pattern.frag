// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent


// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float   uAd, uBd, uTol;

// in variables from the vertex shader and interpolated in the rasterizer:

varying  vec3  vN;		   // normal vector
varying  vec3  vL;		   // vector from point to light
varying  vec3  vE;		   // vector from point to eye
varying  vec2  vST;		   // (s,t) texture coordinates



void
main( )
{
	float s = vST.s;
	float t = vST.t;

	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int(vST.s / uAd);
	int numint = int(vST.t / uBd);
	float sc = float(numins) * uAd + Ar;
	float tc = float(numint) * uBd + Br;
	vec3 orangeColor = vec3(1.0, 0.5, 0.0); // 橘色
	vec3 whiteColor = vec3(1.0, 1.0, 1.0); // 白色
	// determine the color using the square-boundary equations:

	vec3 myColor = uColor;
	float ellipseValue = (((s - sc) * (s - sc)) / (Ar * Ar)) + (((t - tc) * (t - tc)) / (Br * Br));
	if (ellipseValue <= 1.0) {
    	myColor = vec3(1.0, 1.0, 1.0); 
	}
	float d = smoothstep( 1.0 - uTol, 1.0 + uTol, ellipseValue);
	myColor = mix( orangeColor, whiteColor, d);
	// apply the per-fragmewnt lighting to myColor:
	

	vec3 Normal = normalize(vN);
	vec3 Light  = normalize(vL);
	vec3 Eye    = normalize(vE);

	vec3 ambient = uKa * myColor;

	float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * dd * myColor;

	float ss = 0.;
	if( dot(Normal,Light) > 0. )	      // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		ss = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * ss * uSpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}

