
Kiwi.Shaders.StatelessParticleShader = function (){
    
    Kiwi.Shaders.ShaderPair.call(this);
   
};
Kiwi.extend(Kiwi.Shaders.StatelessParticleShader,Kiwi.Shaders.ShaderPair);


Kiwi.Shaders.StatelessParticleShader.prototype.init = function(gl) {
    Kiwi.Shaders.ShaderPair.prototype.init.call(this,gl);
    //attributes
    this.attributes.aXYVxVy = gl.getAttribLocation(this.shaderProgram, "aXYVxVy");
    this.attributes.aBirthLifespanAngle = gl.getAttribLocation(this.shaderProgram, "aBirthLifespanAngle");
    this.attributes.aCellXYWH = gl.getAttribLocation(this.shaderProgram, "aCellXYWH");


    this.initUniforms(gl);


}



Kiwi.Shaders.StatelessParticleShader.prototype.attributes = {
    aXYVxVy: null,
    aBirthLifespan: null,
    aCellXYWH: null
};

                 
Kiwi.Shaders.StatelessParticleShader.prototype.uniforms = {
   	    uCamMatrix: {
            type: "mat3"
        },
        uTextureSize: {
        	type: "2fv"
        },
        uResolution: {
            type: "2fv"
        },
        uTextureSize: {
            type: "2fv"
        },
        uSampler: {
            type: "1i",
        },
        uT: {
            type: "1f"
        },
        uGravity: {
            type: "1f"
        },
        uPointSizeRange: {
            type: "2fv"
        },
        uColEnv0: {
            type: "3fv"
        },
        uColEnv1: {
            type: "3fv"
        },
        uColEnv2: {
            type: "3fv"
        },
        uColEnv3: {
            type: "3fv"
        },
        uColEnvKeyframes: {
            type: "2fv"
        },
        uAlpha: {
            type: "1f"
        },
        uAlphaGradient: {
            type: "4fv"
        },
        uAlphaStops: {
            type: "2fv"
        },
        uLoop: {
            type: "1f"
        }    
    }

/**
 *
 * @property texture2DFrag
 * @type Array
 * @public
 */
Kiwi.Shaders.StatelessParticleShader.prototype.fragSource = [
    "precision mediump float;",
    "uniform sampler2D uSampler;",
    "varying vec4 vCol;",
    "varying mat4 vRotationMatrix;",
    "varying vec4 vCell;",
    "void main(void) {",
       "vec2 cellCoord = vCell.xy + vCell.zw * gl_PointCoord;",
       "vec2 texCoord = (vRotationMatrix * vec4(cellCoord, 0, 1)).xy;",
       "vec4 sampleCol = texture2D(uSampler, texCoord);",
       "gl_FragColor.rgb = vCol.rgb * sampleCol.rgb;",
       "gl_FragColor.a = sampleCol.a * vCol.a;",
    "}"
];


/**
 *
 * @property texture2DVert
 * @type Array
 * @public
 */

Kiwi.Shaders.StatelessParticleShader.prototype.vertSource = [
    "precision mediump float;",
    "attribute vec4 aXYVxVy;",
    "attribute vec3 aBirthLifespanAngle;",
  	"attribute vec4 aCellXYWH;",

    "uniform mat3 uCamMatrix;",
    "uniform vec2 uTextureSize;",
    "uniform vec2 uResolution;",
    "uniform float uT;",
    "uniform float uGravity;",
    
    "uniform vec2 uPointSizeRange;",
    "uniform vec3 uColEnv0;",
    "uniform vec3 uColEnv1;",
    "uniform vec3 uColEnv2;",
    "uniform vec3 uColEnv3;",
    "uniform vec2 uColEnvKeyframes;",
    "uniform vec4 uAlphaGradient;",
    "uniform vec2 uAlphaStops;",
    
    "uniform float uAlpha;",
    "uniform bool uLoop;",

    "varying vec4 vCol;",
    "varying mat4 vRotationMatrix;",
    "varying vec4 vCell;",

   "void main(void) {",
   
  		
        "float lerp;",
        "float birthTime = aBirthLifespanAngle.x;",
        "float lifespan = aBirthLifespanAngle.y;",
        "float angularVelocity = aBirthLifespanAngle.z;",
        "float deathTime = birthTime+lifespan;",
        "float age = uT - birthTime;",
        "age = mod(uT-birthTime,lifespan);",
        
        "lerp =  age / lifespan;",
        "gl_PointSize = mix(uPointSizeRange.x,uPointSizeRange.y,lerp);",
        
        "if (uT < birthTime || (uT >= deathTime && !uLoop )) {",
            "gl_Position = vec4(9999.0,0,0,0);",
        "} else {", 
            "vec2 pos = aXYVxVy.xy; ",
            "vec2 vel = aXYVxVy.zw;",
            "pos += age * vel;",
            "pos.y += 0.5 * uGravity * age * age;",
            "pos = (uCamMatrix * vec3(pos,1.0)).xy;",
            "pos = (pos / uResolution) * 2.0 - 1.0;",
            "gl_Position = vec4(pos * vec2(1, -1), 0, 1);",
           
            "float colLerp = 1.0;",
            "if (lerp <= uColEnvKeyframes.x) {",
                "float cLerp = lerp / uColEnvKeyframes.x; ",
                "vCol = vec4(mix(uColEnv0,uColEnv1,cLerp),1.0);",
            "} else if (lerp > uColEnvKeyframes.x && lerp <= uColEnvKeyframes.y) {",
                "float cLerp = (lerp - uColEnvKeyframes.x) / (uColEnvKeyframes.y - uColEnvKeyframes.x); ",
                "vCol = vec4(mix(uColEnv1,uColEnv2,cLerp),1.0);",
            "} else {",
                "float cLerp = (lerp - uColEnvKeyframes.y) / (1.0 - uColEnvKeyframes.y); ",
                "vCol = vec4(mix(uColEnv2,uColEnv3,cLerp),1.0);",
             "}",
	        "if (lerp <= uAlphaStops.x) {",
	           "vCol.a = mix(uAlphaGradient.x,uAlphaGradient.y,lerp/uAlphaStops.x);", 
	        "} else if (lerp >uAlphaStops.x && lerp <= uAlphaStops.y) {",
	            "vCol.a = mix(uAlphaGradient.y,uAlphaGradient.z,(lerp - uAlphaStops.x) / (uAlphaStops.y - uAlphaStops.x));",
	        "} else {",
	            "vCol.a = mix(uAlphaGradient.z,uAlphaGradient.w,(lerp - uAlphaStops.y) / (1.0 - uAlphaStops.y));",
	        "}",   

	        "vCol.a *= uAlpha;",
	        "float ang = age * angularVelocity;",
	        "vec2 ratio = vec2(1.0 / uTextureSize.x,1.0 / uTextureSize.y);",
	        "vec4 normCell = aCellXYWH;",
	        "normCell.xz *= ratio;",
	        "normCell.yw *= ratio;",
	        "vec2 cellCenter = vec2(normCell.x + normCell.z / 2.0,normCell.y + normCell.w / 2.0);",
	        "float c = cos(ang);",
	        "float s = sin(ang);",
	        "mat4 transInMat = mat4(1.0, 0.0, 0.0, 0.0,",
	                   "0.0, 1.0, 0.0, 0.0,",
	                   "0.0, 0.0, 1.0, 0.0,",
	                   "cellCenter.x,cellCenter.y, 0.0, 1.0);",
	        "mat4 rotMat = mat4(c, -s, 0.0, 0.0,",
	               "s, c, 0.0, 0.0,",
	               "0.0, 0.0, 1.0, 0.0,",
	               "0.0, 0.0, 0.0, 1.0);",
	        "mat4 resultMat = transInMat * rotMat;",
	        "resultMat[3][0] = resultMat[3][0] + resultMat[0][0] * -cellCenter.x + resultMat[1][0] * -cellCenter.y;",
	        "resultMat[3][1] = resultMat[3][1] + resultMat[0][1] * -cellCenter.x + resultMat[1][1] * -cellCenter.y;",
	        "resultMat[3][2] = resultMat[3][2] + resultMat[0][2] * -cellCenter.x + resultMat[1][2] * -cellCenter.y;",
	     
	        "vRotationMatrix = resultMat;",
	        "vCell = normCell;",
        "} ",
        //"vCol = vec4(0.0,1.0,0.0,1.0);",
    "}"

];
