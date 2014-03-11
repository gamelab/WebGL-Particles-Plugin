Kiwi.GameObjects.StatelessParticles = function(state, atlas, x, y, config, start){
    Kiwi.Entity.call(this,state, x, y);
    return this.constructor(state, atlas, x, y, config, start);

};
Kiwi.extend(Kiwi.GameObjects.StatelessParticles,Kiwi.Entity);

Kiwi.GameObjects.StatelessParticles.prototype.constructor = function (state, atlas, x, y, config, start){
    if (typeof x === "undefined") { x = 0; }
    if (typeof y === "undefined") { y = 0; }
    if (typeof start === "undefined") { start = true; }

    this.config = config || Kiwi.GameObjects.StatelessParticles.defaultConfig;

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
}

Kiwi.GameObjects.StatelessParticles.prototype.started = false;

Kiwi.GameObjects.StatelessParticles.prototype.start = function () {
	this._generateParticles();
	this.started = true;
};
     
Kiwi.GameObjects.StatelessParticles.prototype.objType = function () {
    return "StatelessParticles";
};

Kiwi.GameObjects.StatelessParticles.prototype._generateParticles = function () {
    var cfg = this.config;
    var vertexItems = [];
       
    for (var i =0; i < cfg.numParts;i++) {
        //calculate pos
        var posSeed = {x:0,y:0};
        var pos = {x:0,y:0};
        var vel = {x:cfg.velOffsetX,y:cfg.velOffsetY};
        var velSeed = {x:0,y:0};
       

        switch (cfg.posShape) {
            case "Radial":
                posSeed = (cfg.posConstrain) ? this.randomPointCirclePerimeter( cfg.posRadialStart,cfg.posRadialEnd): this.randomPointCircle( cfg.posRadialStart,cfg.posRadialEnd);
                pos.x = posSeed.x * cfg.posRadius;
                pos.y = posSeed.y * cfg.posRadius;
            break;

            case "Rect":
                posSeed = (cfg.posConstrain) ? this.randomPointRectPerimeter() : this.randomPointRect();
                pos.x = posSeed.x * cfg.posWidth;
                pos.y = posSeed.y * cfg.posHeight;
            break;

            case "Line":
                posSeed = this.randomPointLine(cfg.posAngle);
                pos.x = posSeed.x * cfg.posLength;
                pos.y = posSeed.y * cfg.posLength;
            break;

            case "Constant" :

            break;
        }

        switch (cfg.velShape) {
            case "Center":
                var direction = posSeed;
                var magnitude = cfg.minVel + Math.random() * (cfg.maxVel - cfg.minVel)
                vel.x = direction.x * magnitude ;
                vel.y = direction.y * magnitude ;
            break;

            case "Radial":
                velSeed = (cfg.velConstrain) ? this.randomPointCirclePerimeter( cfg.velRadialStart,cfg.velRadialEnd): this.randomPointCircle( cfg.velRadialStart,cfg.velRadialEnd);

                vel.x += velSeed.x * cfg.velRadius; 
                vel.y += velSeed.y * cfg.velRadius;
                    
            break;

            case "Rect":
                velSeed = (cfg.velConstrain) ? this.randomPointRectPerimeter() : this.randomPointRect();

                vel.x += velSeed.x * cfg.velWidth;
                vel.y += velSeed.y * cfg.velHeight;
            break;

            case "Line":
                velSeed = this.randomPointLine(cfg.velAngle);
                vel.x += velSeed.x * cfg.velLength;
                vel.y += velSeed.y * cfg.velLength;
            break;

            case "Constant" :
                
            break;
        }
               
        //angular velocity
        var velAng;
        var diff = Math.max(cfg.velAngMax,cfg.velAngMin) - Math.min (cfg.velAngMax,cfg.velAngMin);
        velAng = cfg.velAngMin + Math.random() * diff;
        
        pos.x += cfg.posOffsetX;
        pos.y += cfg.posOffsetY;

        vertexItems.push(pos.x,pos.y,vel.x,vel.y);

        var startTime = cfg.minStartTime + Math.random() * (cfg.maxStartTime - cfg.minStartTime);
        var lifespan = cfg.minLifespan + Math.random() * (cfg.maxLifespan - cfg.minLifespan);
        
        var cellIndex = 0;

        if (cfg.cells) {
        	var numCells = cfg.cells.length;
        }
		
		if (numCells > 1) {
			cellIndex = Math.floor(Math.random() * numCells); 
		}

        vertexItems.push(startTime,lifespan,velAng);
        var cell = this.atlas.cells[cellIndex];
        vertexItems.push(cell.x,cell.y,cell.w,cell.h);
    }

  
    this.glRenderer.initBatch(vertexItems);

};

Kiwi.GameObjects.StatelessParticles.prototype.render = function (camera) {
};

Kiwi.GameObjects.StatelessParticles.prototype.renderGL = function (gl, camera, params) {
    if (this.started) this.glRenderer.draw(gl,this.transform);
};

Kiwi.GameObjects.StatelessParticles.defaultConfig = {
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
 "posConstrain": true,
 "posShape": "Radial",
 "maxVel": 100,
 "minVel": 70,
 "velConstrain": false,
 "velShape": "Line",
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
  "0.5",
  "0.6"
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
}

Kiwi.GameObjects.StatelessParticles.prototype.randomPointCirclePerimeter = function (a,b) {
    var t = a + ((b - a )* Math.random());
    return {x:Math.cos(t),y:Math.sin(t)};
}

Kiwi.GameObjects.StatelessParticles.prototype.randomPointCircle = function(a,b) {
    var t = a + ((b - a )* Math.random());
    var u = Math.random() + Math.random();
    var r = (u >1) ? 2 - u : u;
    return {x:r * Math.cos(t),y:r* Math.sin(t) };
}

Kiwi.GameObjects.StatelessParticles.prototype.randomPointRect = function() {
    return {x:Math.random() -0.5 ,y:Math.random() -0.5}
}

Kiwi.GameObjects.StatelessParticles.prototype.randomPointRectPerimeter = function () {
    var t = Math.random() * 4;
    
    if (t < 1) return {x:t - 0.5,y:-0.5};
    if (t < 2) return {x:0.5,y: t -1.5};
    if (t < 3) return {x:t - 2.5,y:0.5};

    return {x:-0.5,y:t -3.5};
}

Kiwi.GameObjects.StatelessParticles.prototype.randomPointLine = function(radians) {
    var r = Math.random() -0.5;
    var x = r * Math.cos(radians);
    var y = r * Math.sin(radians);
    return {x:x,y:y};
}