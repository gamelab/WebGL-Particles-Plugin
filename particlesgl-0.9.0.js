
/**

 * @module Kiwi
 * @submodule GameObjects
 * @main StatelessParticles
 */


/**
 * Creates a particle game object
 * @class StatelessParticles
 * @extends Kiwi.Entity
 * @constructor
 * @param {Kiwi.State} state : the state to which the game object belongs
 * @param {Kiwi.Textures.TextureAtlas} atlas : the texture for the particle object
 * @param {number} x : the x position of the game object
 * @param {number} y : the y position of the game object
 * @param {object} config : the particle configuration object
 * @public
 * @return {Kiwi.GameObjects.StatelessParticles}
 */

Kiwi.GameObjects.StatelessParticles = function(state, atlas, x, y, config){
    Kiwi.Entity.call(this,state, x, y);

    return this.constructor(state, atlas, x, y, config);

};
Kiwi.extend(Kiwi.GameObjects.StatelessParticles,Kiwi.Entity);




            
        

(function (){
    var protoProps = {

        constructor : function (state, atlas, x, y, config){
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof config === "undefined") { config = this.defaultConfig; }
         
            this.config = config;
            
            this.randoms = function() {
                var arr = []
                for (var i =0;i < 5000;i++) {
                    arr.push(Math.random())
                }
                return arr
            }();

            if (this.game.renderOption === Kiwi.RENDERER_WEBGL) {
                this.glRenderer = this.game.renderer.requestRendererInstance("StatelessParticleRenderer", { config: this.config });
            }

            if (typeof atlas == "undefined") {
                console.error('A Texture Atlas was not passed when instantiating a new StatelessParticles.');
                this.willRender = false;
                this.active = false;
                return;
            }

            //Set coordinates and texture
            this.atlas = atlas;
            this.cellIndex = this.atlas.cellIndex;
            this.width = atlas.cells[0].w;
            this.height = atlas.cells[0].h;
            this.transform.rotPointX = this.width / 2;
            this.transform.rotPointY = this.height / 2;
            this.box = this.components.add(new Kiwi.Components.Box(this, x, y, this.width, this.height));

        },

        /**
        * The default configuration object.
        * @property defaultConfig
        * @type object
        */
        defaultConfig : {
            "numParts": 20,
            "posOffsetX": 0,
            "posOffsetY": 0,
            "posRadius": 50,
            "posRadialStart": 4.363323129985823,
            "posRadialEnd": 5.061454830783556,
            "posWidth": 100,
            "posHeight": 100,
            "posAngle": 0,
            "posLength": 100,
            "posConstrainRect": true,
            "posConstrainRadial": true,
            "posShape": "radial",
            "maxVel": 100,
            "minVel": 70,
            "velConstrainRect": false,
            "velConstrainRadial": false,
            "velShape": "line",
            "velOffsetX": 0,
            "velOffsetY": 0,
            "velAngMin": -2,
            "velAngMax": +2,
            "velRadius": 100,
            "velRadialStart": 0,
            "velRadialEnd": 6.283185307179586,
            "velWidth": 100,
            "velHeight": 100,
            "velAngle": 0,
            "velLength": 30,
            "minStartTime": 1,
            "maxStartTime": 6,
            "minLifespan": 3,
            "maxLifespan": 5,
            "gravityX": -20,
            "gravityY": 30,
            "startSize": 4,
            "endSize": 150,
            "loop": true,
            "colEnvKeyframes": [
                0.5,
                0.6
            ],
            "alpha": "1",
            "colEnv0": [
                1,
                0,
                0
            ],
            "colEnv1": [
                1,
                1,
                0
            ],
            "colEnv2": [
                1,
                1,
                1
            ],
            "colEnv3": [
                0,
                0,
                0
            ],
            "alphaGradient": [
                1,
                1,
                1,
                0
            ],
            "alphaStops": [
                0.3,
                0.7
            ]
        },

        /**
        * Returns the state of the particle effect. Either "stopped","started" or "stopping" 
        * @property state
        * @type boolean
        * @readonly
        * @public
        */
        effectState : "stopped",
        
        
        /**
         * The type of object that this is.
         * @method objType
         * @return string
         * @public
         */
        objType : function () {
            return "StatelessParticles";
        },

        /**
        * An array of vectors that conatains generated velocities if useDrawingVectors is true. Used by the particle editor.
        * @property drawingVectors
        * @type array
        * @private
        */
        drawingVectors : [],

        /**
        * If true, velocity vectors will be stored on particle generation. Used by the particle editor.
        * @property useDrawingVectors
        * @type boolean
        * @private
        */
        useDrawingVectors : false,

        /**
        * A function delegated to return a random number. Used by the particle editor.
        * @property rnd
        * @type function
        * @private
        */
        rnd : null,

        /**
        * If useRandoms is true, This array will contain pregenerate random numbers which will be used every new generation refresh. Used by the particle editor.
        * @property randoms
        * @type array
        * @private
        */
        randoms : [],

        /**
        * If true, pregenerate random numbers. Used by the particle editor.
        * @property useRandoms
        * @type boolean
        * @private
        */
        useRandoms : false,

        /**
        * The number of random numbers to generate if useRandoms is true.
        * @property numRandoms
        * @type number
        * @private
        */
        numRandoms: 5000,
        
        /**
        * The index of the next random number in useRandoms. Used by the particle editor.
        * @property nextRandomIndex
        * @type number
        * @private
        */
        nextRandomIndex : -1,
    
        /**
        * The maximum loop length of the system. Used for calculating the timeout when stopping emission. This is calculated when the particles are generated. It can be overridden once the emission has started.
        * @property timeoutLength
        * @type number
        * @public
        */
        timeoutLength:0,

        /**
         * Get the next random number from the randoms list. Used by the particle editor.
         * @method nextRandom
         * @return number
         * @private
         */
        nextRandom : function () {
            this.nextRandomIndex++;
            if (this.nextRandomIndex >= this.numRandoms) this.nextRandomIndex =-1;
            return this.randoms[this.nextRandomIndex];
        },

        /**
         * Starts the system emitting particles. Particles will be regenerated each time.
         * @method startEmitting
         * @param {boolean} loop : Set to true for continuous looping. Overrides and updates the config loop setting. 
         * @param {boolean} removeOnComplete : if not looping, then the gameobject will destroy itself after one full emission cycle.
         * @param {number} numParts : the number of particles to generate, set on the config object - if not provided the current config value will be used 
         * @public
         */
        startEmitting : function (loop,removeOnComplete,numParts) {
            console.log('startEmitting')
            if (typeof loop === "undefined") { loop = true; }
            if (typeof removeOnComplete === "undefined") { removeOnComplete = false }
            if (typeof numParts === "undefined") { numParts = this.config.numParts; }

            this.config.numParts = numParts;
            this.config.loop = loop;
            
            this.glRenderer.resetTime();
            this.glRenderer.resetPauseTime();
            
            this.setConfig(this.config,true,true);
                      
            if (!loop && removeOnComplete) {
                this.scheduleRemoval(this.timeoutLength * 1000);
            }

            this.effectState = "started";
            clearTimeout(this._timer);
            console.log ("started")
        
        },
        
        /**
         * Stops the system from emitting particles.
         * @method stopEmitting
         * @param {boolean} immediate : stops the emitter and removes any existing particles.
         * @param {boolean} remove : if true the gameobject will mark itself for removal either immediately, or after a completed cycle.  
         * @public
         */
        stopEmitting : function(immediate,remove) {
            console.log('stopEmitting')
            if (typeof immediate === "undefined") { immediate = false; }
            if (typeof remove === "undefined") { remove = false; }

            if (this.effectState === "started" ) {
                if (immediate && remove) {
                  this.remove();
                } else if (immediate && !remove) {
                  this.effectState = "stopped";
                  console.log ("stopped")
                } else if (!immediate && !remove) {
                  this.glRenderer.pause();
                  this.effectState = "stopping";
                  console.log ("stopping")
                  this.scheduleStop (this.timeoutLength * 1000,false);
                } else if (!immediate && remove) {
                  this.config.loop = false;
                  this.scheduleStop(this.timeoutLength * 1000,true);
                }          
            }
        

        },

        /**
         * Schedules the particle effect to stop (discontinue rendering), and optionally marks the gameobject for removal.
         * @method scheduleStop
         * @param {number} milliseconds : the delay time in milliseconds before being marked for removal.
         * @param {boolean} remove : mark the gameobject for removal.
         * @public
         */
        scheduleStop: function (milliseconds,remove) {
            var that = this;
            clearTimeout(this._timer);
            this._timer = setTimeout(function(milliseconds) {
                that.effectState = "stopped";
                console.log ("stopped")
                if (remove) that.remove.call(that);
            },milliseconds)
        },


        _timer: null,

        /**
         * Immediately marks the gameobject for removal.
         * @method remove
         * @public
         */
        remove : function() {
            this.glRenderer.destroy();  
            this.exists = false;
        },


        /**
        * Sets the configuration object and optionally regenerates particles and sets runtime properties.
        * @method setConfig
        * @param {object} config : the new configuration object
        * @param {boolean} doGenerate : immediately regenerate particles
        * @param {boolean} doUniforms : apply runtime properties
        * @public
        */
        setConfig : function (config,doGenerate,doUniforms) {
            this.config = config;
            this.glRenderer.setConfig(config);
            if (doGenerate) this._generateParticles();
            if (doUniforms) this.glRenderer._setConfigUniforms();
        },


        /**
        * Generates particles based on configuration object.
        * @method _generateParticles
        * @private
        */
        _generateParticles : function () {
            if (this.useRandoms)
                this.rnd = this.nextRandom;
            else
                this.rnd = Math.random;

            this.nextRandomIndex = -1;
            var vertexItems = [];
            
            var cfg = this.config;

            this.drawingVectors = [];


            for (var i =0; i < cfg.numParts;i++) {
                //calculate pos
                var posSeed = {x:0,y:0};
                var pos = {x:0,y:0};
                var vel = {x:cfg.velOffsetX,y:cfg.velOffsetY};
                var velSeed = {x:0,y:0};


                switch (cfg.posShape) {
                    case "radial":
                        if (cfg.posRandomRadial)
                            posSeed = (cfg.posConstrainRadial) ? this.randomPointCirclePerimeter( cfg.posRadialStart,cfg.posRadialEnd): this.randomPointCircle( cfg.posRadialStart,cfg.posRadialEnd);
                        else
                            posSeed = (cfg.posConstrainRadial) ? this.regularPointCirclePerimeter( cfg.posRadialStart,cfg.posRadialEnd,i,cfg.numParts-1): this.randomPointCircle( cfg.posRadialStart,cfg.posRadialEnd);
                        pos.x  = posSeed.x * cfg.posRadius;
                        pos.y  = posSeed.y * cfg.posRadius;

                        break;

                    case "rectangle":
                        posSeed = (cfg.posConstrainRect) ? this.randomPointRectPerimeter() : this.randomPointRect();
                        pos.x += posSeed.x * cfg.posWidth;
                        pos.y += posSeed.y * cfg.posHeight;
                        break;

                    case "line":
                        if (cfg.posRandomLine)
                            posSeed = this.randomPointLine(cfg.posAngle);
                        else
                            posSeed = this.regularPointLine(cfg.posAngle,i,cfg.numParts-1);
                        pos.x += posSeed.x * cfg.posLength;
                        pos.y += posSeed.y * cfg.posLength;
                        break;

                    case "point" :

                        break;
                }

                switch (cfg.velShape) {
                    case "center":
                        var direction = posSeed;
                        var magnitude = cfg.minVel + this.rnd() * (cfg.maxVel - cfg.minVel)
                        vel.x = direction.x * magnitude ;
                        vel.y = direction.y * magnitude ;
                        break;

                    case "radial":
                        if (cfg.velRandomRadial)
                            velSeed = (cfg.velConstrainRadial) ? this.randomPointCirclePerimeter( cfg.velRadialStart,cfg.velRadialEnd): this.randomPointCircle( cfg.velRadialStart,cfg.velRadialEnd);
                        else
                            velSeed = (cfg.velConstrainRadial) ? this.regularPointCirclePerimeter( cfg.velRadialStart,cfg.velRadialEnd,i,cfg.numParts-1): this.randomPointCircle( cfg.velRadialStart,cfg.velRadialEnd);

                        vel.x += velSeed.x * cfg.velRadius;
                        vel.y += velSeed.y * cfg.velRadius;

                        break;

                    case "rectangle":
                        velSeed = (cfg.velConstrainRect) ? this.randomPointRectPerimeter() : this.randomPointRect();

                        vel.x += velSeed.x * cfg.velWidth;
                        vel.y += velSeed.y * cfg.velHeight;
                        break;

                    case "line":
                        if (cfg.velRandomLine)
                            velSeed = this.randomPointLine(cfg.velAngle);
                        else
                            velSeed = this.regularPointLine(cfg.velAngle,i,cfg.numParts -1);
                        vel.x += velSeed.x * cfg.velLength;
                        vel.y += velSeed.y * cfg.velLength;
                        break;

                    case "point" :

                        break;
                }

                //angular velocity
                var velAng;
                var diff = Math.max(cfg.velAngMax,cfg.velAngMin) - Math.min (cfg.velAngMax,cfg.velAngMin);
                velAng = cfg.velAngMin +this.rnd() * diff;

                pos.x += cfg.posOffsetX;
                pos.y += cfg.posOffsetY;

                vertexItems.push(pos.x,pos.y,vel.x,vel.y);
                this.drawingVectors.push( {x:pos.x,y:pos.y,vx:vel.x,vy:vel.y})

                var startTime,lifespan;

                startTime = cfg.minStartTime + this.rnd() * (cfg.maxStartTime - cfg.minStartTime);
                lifespan = cfg.minLifespan + this.rnd() * (cfg.maxLifespan - cfg.minLifespan);

                this.timeoutLength = Math.max(this.timeoutLength,startTime+lifespan);
                var cellIndex = 0;

                if (cfg.cells) {
                    var numCells = cfg.cells.length;
                    if (numCells > 1) {
                        cellIndex = cfg.cells[Math.floor(this.rnd() * numCells)];
                    } else {
                        cellIndex = cfg.cells[0]
                    }
                }

                vertexItems.push(startTime,lifespan,velAng);
                var cell = this.atlas.cells[cellIndex];
                vertexItems.push(cell.x,cell.y,cell.w,cell.h);
            }

            this.glRenderer.initBatch(vertexItems);

        },
       
        
        /**
        * Instructs the renderer to draw the particles.
        * @method renderGL
        * @private
        */
        renderGL : function (gl, camera, params) {
            if (this.effectState !== "stopped")
                this.glRenderer.draw(gl,this.transform);
        },

        

        /**
        * Returns a point on a unit arc based on a total number of points and an index
        * @method regularPointCirclePerimeter
        * @param {number} a : the start angle of the arc
        * @param {number} b : the end angle of the ard
        * @param {number} index : the point index
        * @param {number} total : the total number of points
        * @private
        */
        regularPointCirclePerimeter : function (a,b,index,total) {
            var t = ((b - a ) / total) * index + a;
            return {x:Math.cos(t),y:Math.sin(t)};
        },

        /**
        * Returns a point on a unit arc
        * @method randomPointCirclePerimeter
        * @param {number} a : the start angle of the arc
        * @param {number} b : the end angle of the ard
        * @private
        */
        randomPointCirclePerimeter : function (a,b) {
            var t = a + ((b - a )* this.rnd());
            return {x:Math.cos(t),y:Math.sin(t)};
        },

        /**
        * Returns a point within the sector of a circle
        * @method randomPointCirclePerimeter
        * @param {number} a : the start angle of the sector
        * @param {number} b : the end angle of the sector
        * @private
        */
        randomPointCircle : function(a,b) {
            var t = a + ((b - a )* this.rnd());
            var u = this.rnd() + this.rnd();
            var r = (u >1) ? 2 - u : u;
            return {x:r * Math.cos(t),y:r* Math.sin(t) };
        },

        /**
        * Returns a point within the unit square
        * @method randomPointRect
        * @private
        */
        randomPointRect : function() {
            return {x:this.rnd() -0.5 ,y:this.rnd() -0.5}
        },

        /**
        * Returns a point on the perimeter of the unit square
        * @method randomPointRectPerimeter
        * @private
        */
        randomPointRectPerimeter : function () {
            var t = this.rnd() * 4;

            if (t < 1) return {x:t - 0.5,y:-0.5};
            if (t < 2) return {x:0.5,y: t -1.5};
            if (t < 3) return {x:t - 2.5,y:0.5};

            return {x:-0.5,y:t -3.5};
        },

        /**
        * Returns a point on a unit line based on a total number of points and an index.
        * @method regularPointLine
        * @param {number} radians : the angle of the line
        * @param {number} index : the point index
        * @param {number} total : the total number of points
        * @private
        */
        regularPointLine : function(radians,index,total) {
            var len = 1 / total * index - 0.5;
            var x = len * Math.cos(radians);
            var y = len * Math.sin(radians);
            return {x:x,y:y};
        },

        /**
        * Returns a point on a unit line.
        * @method regularPointLine
        * @param {number} radians : the angle of the line
        * @private
        */
        randomPointLine : function(radians) {
            var r = this.rnd() -0.5;
            var x = r * Math.cos(radians);
            var y = r * Math.sin(radians);
            return {x:x,y:y};
        },



};

for (var prop in protoProps) {
    Kiwi.GameObjects.StatelessParticles.prototype[prop] = protoProps[prop];

}
}());









/**
* The particles plugin creates a new gameobject "StatelessParticles" to the Kiwi.GameObject object 
*
* @module Kiwi
* @submodule Plugins
* @namespace Kiwi.Plugins
* @class ParticlesGL
*/
Kiwi.Plugins.ParticlesGL = {
  
  /**
  * The name of this plugin.
  * @property name
  * @type String
  * @default 'MyPlugin'
  * @public
  */
  name:'ParticlesGL',

  /**
  * The version of this plugin.
  * @property version
  * @type String
  * @default '1.0.0'
  * @public
  */
  version:'0.9.0',

  minimumKiwiVersion:'0.7.0',

  pluginDependencies: [
    
  ]

};

/**
* Registers this plugin with the Global Kiwi Plugins Manager if it is avaiable.
* 
*/
Kiwi.PluginManager.register(Kiwi.Plugins.ParticlesGL);


 

 

Kiwi.Renderers.StatelessParticleRenderer = function (gl,shaderManager,params){
    Kiwi.Renderers.Renderer.call(this,gl,shaderManager,false,params);
    
    this._maxItems = 2000;
    
    this.gl = gl;
    
    this._config = params.config;
    
    if (!this._config) {
        console.log("no particle configuration supplied");
    }
   
    this.vertexBuffer = new Kiwi.Renderers.GLArrayBuffer(gl, 11);

    this.shaderPair = this.shaderManager.requestShader(gl, "StatelessParticleShaderLite");
    this.resetTime();

};
Kiwi.extend(Kiwi.Renderers.StatelessParticleRenderer,Kiwi.Renderers.Renderer);


Kiwi.Renderers.StatelessParticleRenderer.prototype.RENDERER_ID = "StatelessParticleRenderer";

Kiwi.Renderers.StatelessParticleRenderer.prototype.setConfig = function (config) {
    this._config = config;
    this._setConfigUniforms(this.gl)
}

Kiwi.Renderers.StatelessParticleRenderer.prototype.resetTime = function () {
    this.startTime = Date.now();
}

Kiwi.Renderers.StatelessParticleRenderer.prototype.resetPauseTime = function () {
    this.pauseTime = 999999999;
}



Kiwi.Renderers.StatelessParticleRenderer.prototype.enable = function (gl, params) {
    
    this.shaderPair = this.shaderManager.requestShader(gl, "StatelessParticleShaderLite");
    var cfg = this._config;
    this._setStandardUniforms(gl,params.stageResolution,params.textureAtlas,params.camMatrix)
    this._setConfigUniforms(gl);
}

Kiwi.Renderers.StatelessParticleRenderer.prototype._setStandardUniforms = function (gl,stageResolution,textureAtlas,camMatrix){

    //Texture
    gl.uniform1i(this.shaderPair.uniforms.uSampler.location, 0);

    //Standard uniforms
    gl.uniform2fv(this.shaderPair.uniforms.uResolution.location, stageResolution);
    gl.uniform2fv(this.shaderPair.uniforms.uTextureSize.location, new Float32Array([textureAtlas.image.width,textureAtlas.image.height]));
   
    gl.uniformMatrix3fv(this.shaderPair.uniforms.uCamMatrix.location, false, camMatrix);
   
    this.camMatrix = new Float32Array(camMatrix.buffer);
}

Kiwi.Renderers.StatelessParticleRenderer.prototype._setConfigUniforms = function (gl){
    var cfg = this._config;
    gl = gl || this.gl;
    //Particle uniforms
    gl.uniform1f(this.shaderPair.uniforms.uT.location, 0);
    gl.uniform1f(this.shaderPair.uniforms.uPauseTime.location, this.pauseTime);
    gl.uniform2fv(this.shaderPair.uniforms.uGravity.location, new Float32Array([cfg.gravityX,cfg.gravityY]));
    gl.uniform2fv(this.shaderPair.uniforms.uPointSizeRange.location, new Float32Array([cfg.startSize, cfg.endSize]));
    gl.uniform3fv(this.shaderPair.uniforms.uColEnv0.location, new Float32Array(cfg.colEnv0));
    gl.uniform3fv(this.shaderPair.uniforms.uColEnv1.location, new Float32Array(cfg.colEnv1));
    gl.uniform3fv(this.shaderPair.uniforms.uColEnv2.location, new Float32Array(cfg.colEnv2));
    gl.uniform3fv(this.shaderPair.uniforms.uColEnv3.location, new Float32Array(cfg.colEnv3));
    gl.uniform2fv(this.shaderPair.uniforms.uColEnvKeyframes.location, new Float32Array(cfg.colEnvKeyframes));
   
    gl.uniform1f(this.shaderPair.uniforms.uAlpha.location, cfg.alpha);
    gl.uniform4fv(this.shaderPair.uniforms.uAlphaGradient.location, new Float32Array(cfg.alphaGradient));
    gl.uniform2fv(this.shaderPair.uniforms.uAlphaStops.location, new Float32Array(cfg.alphaStops));
    
    gl.uniform1i(this.shaderPair.uniforms.uLoop.location, (cfg.loop) ? 1 : 0);
};

Kiwi.Renderers.StatelessParticleRenderer.prototype.disable = function (gl) {
    gl.disableVertexAttribArray(this.shaderPair.attributes.aXYVxVy);
    gl.disableVertexAttribArray(this.shaderPair.attributes.aBirthLifespanAngle);
    gl.disableVertexAttribArray(this.shaderPair.attributes.aCellXYWH);
};

Kiwi.Renderers.StatelessParticleRenderer.prototype.clear = function (gl, params) {
    this.vertexBuffer.clear();
    
};

Kiwi.Renderers.StatelessParticleRenderer.prototype.time = 0;
Kiwi.Renderers.StatelessParticleRenderer.prototype.pauseTime = 999999999;

Kiwi.Renderers.StatelessParticleRenderer.prototype.pause = function (gl) {
    gl = gl || this.gl;
    this.pauseTime = this.time / 1000;
    gl.uniform1f(this.shaderPair.uniforms.uPauseTime.location, this.pauseTime);
}

Kiwi.Renderers.StatelessParticleRenderer.prototype.draw = function (gl,transform) {

    var m = transform.getConcatenatedMatrix();

    var modelMatrix = new Float32Array([
        m.a,m.b,0,
        m.c,m.d,0,
        m.tx,m.ty,1
    ]);

    var modelViewMatrix = mat3.create();
    mat3.mul(modelViewMatrix,this.camMatrix,modelMatrix);
    gl.uniformMatrix3fv(this.shaderPair.uniforms.uCamMatrix.location, false, modelViewMatrix);

    // calculate time
    this.time = Date.now() - this.startTime;

    gl.uniform1f(this.shaderPair.uniforms.uT.location, this.time / 1000);


    gl.blendEquationSeparate(gl.FUNC_ADD,gl.FUNC_ADD)

    if (this._config.additive )
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE,gl.ONE);
    else
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE,gl.ONE);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.buffer);

    gl.enableVertexAttribArray(this.shaderPair.attributes.aXYVxVy);
    gl.vertexAttribPointer(this.shaderPair.attributes.aXYVxVy, 4, gl.FLOAT, false, 44, 0);

    gl.enableVertexAttribArray(this.shaderPair.attributes.aBirthLifespanAngle);
    gl.vertexAttribPointer(this.shaderPair.attributes.aBirthLifespanAngle, 3, gl.FLOAT, false, 44, 16);

    gl.enableVertexAttribArray(this.shaderPair.attributes.aCellXYWH);
    gl.vertexAttribPointer(this.shaderPair.attributes.aCellXYWH, 4, gl.FLOAT, false, 44, 28);

    gl.drawArrays(gl.POINTS, 0,this._config.numParts);
    //return to standard blendfunc
    gl.blendFunc( gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
};

Kiwi.Renderers.StatelessParticleRenderer.prototype.updateStageResolution = function (gl, res) {
    gl.uniform2fv(this.shaderPair.uniforms.uResolution.location, res);
};

Kiwi.Renderers.StatelessParticleRenderer.prototype.updateTextureSize = function (gl, size) {
    gl.uniform2fv(this.shaderPair.uniforms.uTextureSize.location, size);
};

Kiwi.Renderers.StatelessParticleRenderer.prototype.initBatch = function (vertexItems) {
    this.vertexBuffer.items = vertexItems;
    this.vertexBuffer.uploadBuffer(this.gl,this.vertexBuffer.items);
};

Kiwi.Renderers.StatelessParticleRenderer.prototype.destroy = function (gl) {
    gl = gl || this.gl;
    gl. deleteBuffer(this.vertexBuffer.buffer);

};







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
        uPauseTime: {
            type: "1f"
        },
        uGravity: {
            type: "2fv"
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
            type: "1i"
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
    "uniform float uPauseTime;",
    "uniform vec2 uGravity;",
    
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
        "float deathTime = birthTime + lifespan;",
        "float age = mod(uT-birthTime,lifespan);",
        "float pauseTimeAge = mod(uPauseTime-birthTime,lifespan);",

      
        "lerp =  age / lifespan;",
        "gl_PointSize = mix(uPointSizeRange.x,uPointSizeRange.y,lerp);",
        
        "float loopBirthTime = (uT - birthTime) / lifespan;",
        "if (uT < birthTime || (uT >= deathTime && !uLoop ) || (uT >= uPauseTime - pauseTimeAge + lifespan)) {",
            "gl_Position = vec4(9999.0,0,0,0);",
        "} else {", 
            "vec2 pos = aXYVxVy.xy; ",
            "vec2 vel = aXYVxVy.zw;",
            "pos += age * vel;",
            "pos += 0.5 * uGravity * age * age;",
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


Kiwi.Shaders.StatelessParticleShaderLite = function (){
    
    Kiwi.Shaders.ShaderPair.call(this);
   
};
Kiwi.extend(Kiwi.Shaders.StatelessParticleShaderLite,Kiwi.Shaders.ShaderPair);


Kiwi.Shaders.StatelessParticleShaderLite.prototype.init = function(gl) {
    Kiwi.Shaders.ShaderPair.prototype.init.call(this,gl);
    //attributes
    this.attributes.aXYVxVy = gl.getAttribLocation(this.shaderProgram, "aXYVxVy");
    this.attributes.aBirthLifespanAngle = gl.getAttribLocation(this.shaderProgram, "aBirthLifespanAngle");
    this.attributes.aCellXYWH = gl.getAttribLocation(this.shaderProgram, "aCellXYWH");


    this.initUniforms(gl);


}



Kiwi.Shaders.StatelessParticleShaderLite.prototype.attributes = {
    aXYVxVy: null,
    aBirthLifespan: null,
    aCellXYWH: null
};

                 
Kiwi.Shaders.StatelessParticleShaderLite.prototype.uniforms = {
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
        uPauseTime: {
            type: "1f"
        },
        uGravity: {
            type: "2fv"
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
            type: "1i"
        }    
    }

/**
 *
 * @property texture2DFrag
 * @type Array
 * @public
 */
Kiwi.Shaders.StatelessParticleShaderLite.prototype.fragSource = [
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

Kiwi.Shaders.StatelessParticleShaderLite.prototype.vertSource = [
    "precision mediump float;",
    "attribute vec4 aXYVxVy;",
    "attribute vec3 aBirthLifespanAngle;",
    "attribute vec4 aCellXYWH;",

    "uniform mat3 uCamMatrix;",
    "uniform vec2 uTextureSize;",
    "uniform vec2 uResolution;",
    "uniform float uT;",
    "uniform float uPauseTime;",
    "uniform vec2 uGravity;",
    
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
        "float deathTime = birthTime + lifespan;",
        "float age = mod(uT-birthTime,lifespan);",
        "float pauseTimeAge = mod(uPauseTime-birthTime,lifespan);",

      
        "lerp =  age / lifespan;",
        "gl_PointSize = mix(uPointSizeRange.x,uPointSizeRange.y,lerp);",
        
        "float loopBirthTime = (uT - birthTime) / lifespan;",
        "if (uT < birthTime || (uT >= deathTime && !uLoop ) || (uT >= uPauseTime - pauseTimeAge + lifespan)) {",
            "gl_Position = vec4(9999.0,0,0,0);",
        "} else {", 
            "vec2 pos = aXYVxVy.xy; ",
            "vec2 vel = aXYVxVy.zw;",
            "pos += age * vel;",
            "pos += 0.5 * uGravity * age * age;",
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
            //"vCol.a *= 1.0;",
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
