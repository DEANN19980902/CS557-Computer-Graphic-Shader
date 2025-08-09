// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent


// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float   uAd, uBd, uTol;
uniform float	uNoiseAmp, uNoiseFreq;
uniform int	uUseXYZforNoise;
uniform	sampler3D Noise3;



// in variables from the vertex shader and interpolated in the rasterizer:

varying  vec3  vN;		   // normal vector
varying  vec3  vL;		   // vector from point to light
varying  vec3  vE;		   // vector from point to eye
varying  vec2  vST;		   // (s,t) texture coordinates
varying vec3 vMCposition;


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
	
	vec4 nv;
	if( uUseXYZforNoise != 0 )
        nv  = texture3D( Noise3, uNoiseFreq*vMCposition );
	else
		nv  = texture3D( Noise3, uNoiseFreq*vec3(vST,0.0) );
	float n = nv.r + nv.g + nv.b + nv.a; // range is 1. -> 3.
	n = n - 2.; // range is now -1. -> 1.
	n *= uNoiseAmp;

	float ds = s - sc; // wrt ellipse center
	float dt = t - tc; // wrt ellipse center
	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + n;
	float scale = newDist / oldDist; // this could be < 1., = 1., or > 1.
	ds *= scale; // scale by noise factor
	ds /= Ar; // ellipse equation
	dt *= scale; // scale by noise factor
	dt /= Br; // ellipse equation
	float ddd = ds*ds + dt*dt;
	float d = smoothstep( 1.0 - uTol, 1.0 + uTol, ddd);
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

