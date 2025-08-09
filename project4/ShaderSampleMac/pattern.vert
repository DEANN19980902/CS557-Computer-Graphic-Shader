#version 120

uniform float uA; // 振幅
uniform float uB; // 周期
uniform float uC; // 相位
uniform float uD; // 衰减

varying vec3 vMC;
varying vec3 vNs; 
varying vec3 vEs; // vector from point to eye

void main()
{
    vec4 newVertex = gl_Vertex;
    vMC = newVertex.xyz;
	vec3 vECposition = ( gl_ModelViewMatrix * newVertex).xyz; // eye coordinate position
    
    float r = sqrt(vMC.x * vMC.x + vMC.y * vMC.y);
    float dzdr = uA * ( -sin(2. * 3.1415926 * uB * r + uC) * 2. * 3.1415926 * uB * exp(-uD * r) + cos(2. * 3.1415926 * uB * r + uC) * -uD * exp(-uD * r) );

	vec3 vert = gl_Vertex.xyz; 
	vMC.z = uA * cos(2.0 * 3.1415926 * uB * r + uC) * exp(-uD * r);

    float drdx = vMC.x / r;
    float drdy = vMC.y / r;

	float dzdx = dzdr * drdx;
	float dzdy = dzdr * drdy;

    vec3 Tx = vec3(1.0, 0.0, dzdx);
    vec3 Ty = vec3(0.0, 1.0, dzdy);

    vec3 newnormal = normalize( cross( Tx, Ty ) );
	
	vEs = vECposition - vec3(0.,0.,0.);
    vNs = newnormal;

	newVertex = vec4(vMC, 1.0);
    newVertex.y = -newVertex.y;
	gl_Position = gl_ModelViewProjectionMatrix * newVertex; 
}