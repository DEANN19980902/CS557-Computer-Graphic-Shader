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


vec3
RotateNormal( float angx, float angy, vec3 n )
{
		float cx = cos( angx );
		float sx = sin( angx );
		float cy = cos( angy );
		float sy = sin( angy );

		// rotate about x:
		float yp =  n.y*cx - n.z*sx;    // y'
		n.z      =  n.y*sx + n.z*cx;    // z'
		n.y      =  yp;
		// n.x      =  n.x;
		// rotate about y:
		float xp =  n.x*cy + n.z*sy;    // x'
		n.z      = -n.x*sy + n.z*cy;    // z'
		n.x      =  xp;
		// n.y      =  n.y;
		return normalize( n );
}



void
main( )
{
	// determine the color using the square-boundary equations:
	vec3 myColor = uColor;
	vec4 nvx = texture3D( Noise3, uNoiseFreq*vMCposition );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;	// -1. to +1.
	angx *= uNoiseAmp;

    vec4 nvy = texture3D( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;	// -1. to +1.
	angy *= uNoiseAmp;

	vec3 Normal = normalize(RotateNormal(angx, angy, vN));
	
	// apply the per-fragmewnt lighting to myColor:
	

	
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

