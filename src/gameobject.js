
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
 * @public
 * @return {Kiwi.GameObjects.StatelessParticles}
 */

Kiwi.GameObjects.StatelessParticles = function(state, atlas, x, y, config, start){
    Kiwi.Entity.call(this,state, x, y);
    console.log(this)
    return this.constructor(state, atlas, x, y, config, start);

};
Kiwi.extend(Kiwi.GameObjects.StatelessParticles,Kiwi.Entity);



(function (){
    var protoProps = {

        constructor : function (state, atlas, x, y, config, start){
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof start === "undefined") { start = true; }

            this.config = config || this.defaultConfig;

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

            if (start) this.start();
        },

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
            "gravity": "0",
            "startSize": "4",
            "endSize": "150",
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

        started : false,

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
         * The type of object that this is.
         * @method objType
         * @return string
         * @public
         */
        drawingVectors : [],

        useDrawingVectors : false,

        rnd : null,

        randoms : [],

        useRandoms : false,

        nextRandomIndex : -1,
        nextRandom : function () {
            this.nextRandomIndex++;
            if (this.nextRandomIndex >= 5000) this.nextRandomIndex =-1;
            return this.randoms[this.nextRandomIndex];

        },

        start : function () {
            this._generateParticles();
            this.started = true;
        },

        setConfig : function (config,doGenerate,doUniforms) {
            this.config = config;
            this.glRenderer.setConfig(config);
            if (doGenerate) this._generateParticles();
            if (doUniforms) this.glRenderer._setConfigUniforms();
        },

        _generateParticles : function (refresh) {
        if (this.useRandoms)
            this.rnd = this.nextRandom;
        else
            this.rnd = Math.random;

        this.nextRandomIndex = -1;
        var vertexItems = [];
        console.log('generate');
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

        render : function (camera) {
        },

        renderGL : function (gl, camera, params) {
            if (this.started) this.glRenderer.draw(gl,this.transform);
        },

        regularPointCirclePerimeter : function (a,b,index,total) {
            var t = ((b - a ) / total) * index + a;
            return {x:Math.cos(t),y:Math.sin(t)};
        },

        randomPointCirclePerimeter : function (a,b) {
            var t = a + ((b - a )* this.rnd());
            return {x:Math.cos(t),y:Math.sin(t)};
        },

        randomPointCircle : function(a,b) {
            var t = a + ((b - a )* this.rnd());
            var u = this.rnd() + this.rnd();
            var r = (u >1) ? 2 - u : u;
            return {x:r * Math.cos(t),y:r* Math.sin(t) };
        },

        randomPointRect : function() {
            return {x:this.rnd() -0.5 ,y:this.rnd() -0.5}
        },

        randomPointRectPerimeter : function () {
            var t = this.rnd() * 4;

            if (t < 1) return {x:t - 0.5,y:-0.5};
            if (t < 2) return {x:0.5,y: t -1.5};
            if (t < 3) return {x:t - 2.5,y:0.5};

            return {x:-0.5,y:t -3.5};
        },

        regularPointLine : function(radians,index,total) {
            var len = 1 / total * index - 0.5;
            var x = len * Math.cos(radians);
            var y = len * Math.sin(radians);
            return {x:x,y:y};
        },

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








