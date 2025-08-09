// lighting uniform variables -- these can be set once and left alone:
#version 120

uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent


// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float uA; 
uniform float uP;
uniform float uTol; 
uniform int uUseChromaDepth;
uniform float uRedDepth; // Depth at which the color should start as red
uniform float uBlueDepth; // Depth at which the color transitions to blue

//varying vec3 vColor;
varying float vX, vY, vZ;
varying float vLightIntensity;
// in variables from the vertex shader and interpolated in the rasterizer:

varying  vec3  vN;		   // normal vector
varying  vec3  vL;		   // vector from point to light
varying  vec3  vE;		   // vector from point to eye
varying  vec2  vST;		   // (s,t) texture coordinates
varying vec3 vMCposition;

const vec3 WHITE = vec3(1., 1., 1.);

float
SmoothPulse( float left, float right,   float value, float tol )
{
	float t =	smoothstep( left-tol,  left+tol,  value )  -
			smoothstep( right-tol, right+tol, value );
	return t;
}


vec3
Rainbow( float t )
{
        t = clamp( t, 0., 1. );         // 0.00 is red, 0.33 is green, 0.67 is blue

        float r = 1.;
        float g = 0.0;
        float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

        return vec3( r, g, b );
}



void
main( )
{
	
	float uA = 1.0;
	float uP = 0.05;
	float uTol = 0.01;
	float uRedDepth = 1.5f;  
	float uBlueDepth = 3.4f; 
	// determine the color using the square-boundary equations:

	float f = fract(uA * vX); 
    float t = smoothstep(0.5 - uP - uTol, 0.5 - uP + uTol, f) - smoothstep(0.5 + uP - uTol, 0.5 + uP + uTol, f);
    
    vec3 rgb = vLightIntensity * mix(WHITE, uColor, t); 

	vec3 finalColor = rgb;
	// apply the per-fragmewnt lighting to myColor:
	if(uUseChromaDepth != 0) {
        float chromaDepth = (2./3.) * ( abs(vZ) - uRedDepth ) / ( uBlueDepth - uRedDepth );
        chromaDepth = clamp( chromaDepth, 0., 2./3. );
        finalColor = Rainbow( chromaDepth );
    }

	vec3 Normal = normalize(vN);
	vec3 Light  = normalize(vL);
	vec3 Eye    = normalize(vE);

	vec3 ambient = uKa * finalColor;

	float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * dd * finalColor;

	float ss = 0.;
	if( dot(Normal,Light) > 0. )	      // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		ss = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * ss * uSpecularColor;
	 gl_FragColor = vec4(finalColor + ambient + diffuse + specular , 1.0);
}


