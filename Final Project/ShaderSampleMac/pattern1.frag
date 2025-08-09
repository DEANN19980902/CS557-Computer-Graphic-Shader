// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent
uniform float   uTime;

// square-equation uniform variables -- these should be set every time Display( ) is called:



uniform	sampler3D Noise3;
uniform	sampler2D World;



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
	vec3 textureColor = texture2D(World, vST).rgb;

    float redFactor = sin(uTime); // 这里可以根据需要调整时间因子
    vec3 redColor = vec3(1.0, 0.0, 0.0) * redFactor; // 红色，根据时间因子变化

    // 将时间控制的红色颜色与原始纹理颜色进行叠加
    vec3 finalColor = textureColor + redColor;

    float angx = 45.0 * 3.14159 / 180.0;  // 将角度从度转换为弧度
	float angy = 45.0 * 3.14159 / 180.0;
	vec3 Normal = normalize(RotateNormal(angx, angy, vN));
	
	// apply the per-fragmewnt lighting to myColor:
	

	
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
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );

}

