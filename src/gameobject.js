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
* @param state {Kiwi.State} State to which the game object belongs
* @param atlas {Kiwi.Textures.TextureAtlas} Texture for the particle object
* @param x {number} X position of the game object
* @param y {number} Y position of the game object
* @param config {object} Particle configuration object
* @public
* @return {Kiwi.GameObjects.StatelessParticles}
*/

Kiwi.GameObjects.StatelessParticles = function( state, atlas, x, y, config ) {
	Kiwi.Entity.call( this,state, x, y );

	return this.constructor( state, atlas, x, y, config );

};
Kiwi.extend( Kiwi.GameObjects.StatelessParticles, Kiwi.Entity );


(function() {
	var protoProps = {

		constructor : function( state, atlas, x, y, config ) {
			var i;

			this.config = this.buildDefaultConfig();
			if ( typeof x === "undefined" ) {
				x = 0;
			}
			if ( typeof y === "undefined" ) {
				y = 0; }
			if( typeof config !== "undefined" ) {
				this.mergeConfig( this.config, config );
			}
			
			this.randoms = function() {
				var arr = [];
				for ( i =0; i < 5000; i++ ) {
					arr.push( Math.random() );
				}
				return arr;
			}();

			if ( this.game.renderOption === Kiwi.RENDERER_WEBGL ) {
				this.glRenderer = this.game.renderer.requestRendererInstance(
					"StatelessParticleRenderer", { config: this.config } );
			}

			if ( typeof atlas === "undefined" ) {
				console.error( "A Texture Atlas was not passed when " +
					"instantiating a new StatelessParticles." );
				this.visible = false;
				this.active = false;
				return;
			}

			//Set coordinates and texture
			this.atlas = atlas;
			this.cellIndex = this.atlas.cellIndex;
			this.width = atlas.cells[ 0 ].w;
			this.height = atlas.cells[ 0 ].h;
			this.transform.rotPointX = this.width / 2;
			this.transform.rotPointY = this.height / 2;
			this.box = this.components.add(
				new Kiwi.Components.Box( this, x, y, this.width, this.height) );

			// Hide object until it is fully initialised by startEmitting
			this.visible = false;
		},

		/**
		* Populates a new object with default config parameters
		* @method buildDefaultConfig
		* @return {object}
		* @public
		*/
		buildDefaultConfig: function()
		{
			return {
				"additive": false,
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
				"angStartMin": 0,
				"angStartMax": 0,
				"angVelocityConform": false,
				"minStartTime": 1,
				"maxStartTime": 6,
				"minLifespan": 3,
				"maxLifespan": 5,
				"gravityX": 0,
				"gravityY": -50,
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
			};
		},


		/**
		* Merges config objects, overwriting the first config with all
		* definitions in the second while preserving non-revised terms.
		* @method mergeConfig
		* @param config1 {object} Config object to modify
		* @param config2 {object} Config object to copy in
		* @public
		*/
		mergeConfig: function( config1, config2 ) {
			var i;

			for ( i in config2 ) {
				config1[ i ] = config2[ i ];
			}
		},


		/**
		* Returns the state of the particle effect.
		* Either "stopped","started" or "stopping" 
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
		objType : function() {
			return "StatelessParticles";
		},

		/**
		* An array of vectors that conatains generated velocities
		* if useDrawingVectors is true. Used by the particle editor.
		* @property drawingVectors
		* @type array
		* @private
		*/
		drawingVectors : [],

		/**
		* If true, velocity vectors will be stored on particle generation.
		* Used by the particle editor.
		* @property useDrawingVectors
		* @type boolean
		* @private
		*/
		useDrawingVectors : false,

		/**
		* A function delegated to return a random number.
		* Used by the particle editor.
		* @property rnd
		* @type function
		* @private
		*/
		rnd : null,

		/**
		* If useRandoms is true, This array will contain pregenerate random
		* numbers which will be used every new generation refresh.
		* Used by the particle editor.
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
		* The index of the next random number in useRandoms.
		* Used by the particle editor.
		* @property nextRandomIndex
		* @type number
		* @private
		*/
		nextRandomIndex : -1,
	
		/**
		* The maximum loop length of the system. Used for calculating
		* the timeout when stopping emission. This is calculated when
		* the particles are generated. It can be overridden once
		* the emission has started.
		* @property timeoutLength
		* @type number
		* @public
		*/
		timeoutLength:0,

		/**
		* Get the next random number from the randoms list.
		* Used by the particle editor.
		* @method nextRandom
		* @return number
		* @private
		*/
		nextRandom : function() {
			this.nextRandomIndex++;
			if (this.nextRandomIndex >= this.numRandoms) {
				this.nextRandomIndex = -1;
			}
			return this.randoms[ this.nextRandomIndex ];
		},

		/**
		* Starts the system emitting particles.
		* Particles will be regenerated each time.
		* @method startEmitting
		* @param loop {boolean} Set to true for continuous looping.
		*	Overrides and updates the config loop setting. 
		* @param removeOnComplete {boolean} If not looping, then
		*	the gameobject will destroy itself after one full emission cycle.
		* @param numParts {number} Number of particles to generate,
		*	set on the config object - if not provided
		*	the current config value will be used 
		* @public
		*/
		startEmitting : function( loop, removeOnComplete, numParts ) {
			if ( typeof loop === "undefined" ) {
				loop = true;
			}
			if ( typeof removeOnComplete === "undefined" ) {
				removeOnComplete = false;
			}
			if ( typeof numParts === "undefined" ) {
				numParts = this.config.numParts;
			}

			this.config.numParts = numParts;
			this.config.loop = loop;
			
			this.glRenderer.resetTime();
			this.glRenderer.resetPauseTime();

			this.setConfig( this.config, true, true );

			if ( !loop && removeOnComplete ) {
				this.scheduleStop( this.timeoutLength * 1000, true );
			}

			this.effectState = "started";
			this.visible = true;
			clearTimeout( this._timer );
		},

		/**
		* Stops the system from emitting particles.
		* @method stopEmitting
		* @param immediate {boolean} Stops the emitter
		*	and removes any existing particles.
		* @param remove {boolean} If true the gameobject will mark itself
		*	for removal either immediately, or after a completed cycle.
		* @public
		*/
		stopEmitting : function( immediate, remove ) {
			if ( typeof immediate === "undefined") {
				immediate = false;
			}
			if ( typeof remove === "undefined") {
				remove = false;
			}

			if ( this.effectState === "started" ) {
				if ( immediate && remove ) {
					this.remove();
				} else if ( immediate && !remove ) {
					this.effectState = "stopped";
					this.visible = false;
				} else if ( !immediate && !remove ) {
					this.glRenderer.pause();
					this.effectState = "stopping";
					this.scheduleStop( this.timeoutLength * 1000, false );
				} else if ( !immediate && remove ) {
					this.config.loop = false;
					this.scheduleStop( this.timeoutLength * 1000, true );
				}
			}
		},

		/**
		* Schedules the particle effect to stop (discontinue rendering),
		*	and optionally marks the gameobject for removal.
		* @method scheduleStop
		* @param milliseconds {number} Delay time in milliseconds
		*	before being marked for removal.
		* @param remove {boolean} Mark the gameobject for removal.
		* @public
		*/
		scheduleStop: function( milliseconds, remove ) {
			var that = this;
			clearTimeout( this._timer );
			this._timer = setTimeout( function() {
				that.effectState = "stopped";
				that.visible = false;
				if ( remove ) {
					that.remove.call(that);
				}
			}, milliseconds);
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
		* Sets the configuration object and optionally regenerates particles
		*	and sets runtime properties.
		* @method setConfig
		* @param config {object} New configuration object
		* @param doGenerate {boolean} Immediately regenerate particles
		* @param doUniforms {boolean} Apply runtime properties.
		*	Deprecated: would apply runtime properties before rendering,
		*	and this parameter only served to create errors.
		* @public
		*/
		setConfig : function( config, doGenerate, doUniforms ) {
			this.config = config;
			this.glRenderer.setConfig( config );
			if ( doGenerate ) {
				this._generateParticles();
			}
		},

		/**
		* Sets a property on the configuration object and optionally
		* regenerates particles and sets runtime properties.
		* @method setConfigProp
		* @param prop {string} Name of the property to set
		* @param val {any} Value of the property to set
		* @param doGenerate {boolean} Immediately regenerate particles
		* @param doUniforms {boolean} Apply runtime properties.
		*	Deprecated: would apply runtime properties before rendering,
		*	and this parameter only served to create errors.
		* @public
		*/
		setConfigProp : function( prop, val, doGenerate, doUniforms ) {
			this.config[ prop ] = val;
			this.setConfig( this.config, doGenerate, doUniforms );
		},

		/**
		* Gets the configuration object.
		*	To change it, use setConfig or setConfigProp.
		* @method getConfig
		* @return {object}
		* @public
		*/
		getConfig : function() {
			return this.config;
		},


		/**
		* Generates particles based on configuration object.
		* @method _generateParticles
		* @private
		*/
		_generateParticles : function() {
			var angDiff, cell, cellIndex, diff, direction, i, lifespan,
				magnitude, numCells, pos, posSeed, startAng, startTime,
				vel, velAng, velSeed,
				cfg = this.config,
				vertexItems = [];
				

			this.nextRandomIndex = -1;
			this.drawingVectors = [];

			if ( this.useRandoms ) {
				this.rnd = this.nextRandom;
			} else {
				this.rnd = Math.random;
			}

			for ( i = 0; i < cfg.numParts; i++ ) {

				// Calculate pos
				pos = { x: 0, y: 0 };
				posSeed = { x: 0, y: 0 };
				vel = { x: cfg.velOffsetX, y: cfg.velOffsetY };
				velSeed = { x: 0, y: 0 };

				switch ( cfg.posShape ) {

					case "radial":
						if ( cfg.posRandomRadial ) {
							posSeed = ( cfg.posConstrainRadial ) ?
								this.randomPointCirclePerimeter(
									cfg.posRadialStart, cfg.posRadialEnd ) :
								this.randomPointCircle(
									cfg.posRadialStart, cfg.posRadialEnd );
						} else {
							posSeed = ( cfg.posConstrainRadial ) ?
							this.regularPointCirclePerimeter(
								cfg.posRadialStart, cfg.posRadialEnd,
								i, cfg.numParts - 1 ) :
							this.randomPointCircle(
								cfg.posRadialStart, cfg.posRadialEnd );
						}
						pos.x  = posSeed.x * cfg.posRadius;
						pos.y  = posSeed.y * cfg.posRadius;
						break;

					case "rectangle":
						posSeed = cfg.posConstrainRect ?
							this.randomPointRectPerimeter() :
							this.randomPointRect();
						pos.x += posSeed.x * cfg.posWidth;
						pos.y += posSeed.y * cfg.posHeight;
						break;

					case "line":
						if ( cfg.posRandomLine ) {
							posSeed = this.randomPointLine( cfg.posAngle );
						} else {
							posSeed = this.regularPointLine(
								cfg.posAngle, i, cfg.numParts - 1 );
						}
						pos.x += posSeed.x * cfg.posLength;
						pos.y += posSeed.y * cfg.posLength;
						break;

					case "point" :
						break;
				}

				switch (cfg.velShape) {

					case "center":
						direction = posSeed;
						magnitude = cfg.minVel + this.rnd() *
							(cfg.maxVel - cfg.minVel);
						vel.x = direction.x * magnitude ;
						vel.y = direction.y * magnitude ;
						break;

					case "radial":
						if ( cfg.velRandomRadial ) {
							velSeed = cfg.velConstrainRadial ?
								this.randomPointCirclePerimeter(
									cfg.velRadialStart, cfg.velRadialEnd ) :
								this.randomPointCircle(
									cfg.velRadialStart, cfg.velRadialEnd );
						} else {
							velSeed = cfg.velConstrainRadial ?
								this.regularPointCirclePerimeter(
									cfg.velRadialStart, cfg.velRadialEnd,
									i, cfg.numParts - 1 ) :
								this.randomPointCircle(
									cfg.velRadialStart, cfg.velRadialEnd );
						}

						vel.x += velSeed.x * cfg.velRadius;
						vel.y += velSeed.y * cfg.velRadius;
						break;

					case "rectangle":
						velSeed = cfg.velConstrainRect ?
							this.randomPointRectPerimeter() :
							this.randomPointRect();

						vel.x += velSeed.x * cfg.velWidth;
						vel.y += velSeed.y * cfg.velHeight;
						break;

					case "line":
						if ( cfg.velRandomLine ) {
							velSeed = this.randomPointLine( cfg.velAngle );
						} else {
							velSeed = this.regularPointLine(
								cfg.velAngle, i, cfg.numParts - 1 );
						}
						vel.x += velSeed.x * cfg.velLength;
						vel.y += velSeed.y * cfg.velLength;
						break;

					case "point":
						break;
				}

				// Angular velocity
				diff = Math.max( cfg.velAngMax, cfg.velAngMin ) -
					Math.min( cfg.velAngMax, cfg.velAngMin );
				velAng = cfg.velAngMin + this.rnd() * diff;

				// Angular spawn parameters
				angDiff = Math.abs( cfg.angStartMax - cfg.angStartMin );
				startAng = cfg.angStartMin + this.rnd() * angDiff;
				if ( cfg.angVelocityConform ) {

					// Base angle is based on velocity vector
					startAng += Math.atan2( vel.y, vel.x );
				}

				pos.x += cfg.posOffsetX;
				pos.y += cfg.posOffsetY;

				vertexItems.push( pos.x, pos.y, vel.x, vel.y );
				this.drawingVectors.push(
					{ x: pos.x, y: pos.y, vx: vel.x, vy: vel.y } );

				startTime = cfg.minStartTime + this.rnd() *
					( cfg.maxStartTime - cfg.minStartTime );
				lifespan = cfg.minLifespan + this.rnd() *
					( cfg.maxLifespan - cfg.minLifespan );

				this.timeoutLength =
					Math.max( this.timeoutLength, startTime + lifespan );
				cellIndex = 0;

				if ( cfg.cells ) {
					numCells = cfg.cells.length;
					if ( numCells > 1 ) {
						cellIndex =
							cfg.cells[ Math.floor( this.rnd() * numCells ) ];
					} else {
						cellIndex = cfg.cells[ 0 ];
					}
				}

				vertexItems.push( startTime, lifespan, velAng, startAng );
				cell = this.atlas.cells[ cellIndex ];
				vertexItems.push( cell.x, cell.y, cell.w, cell.h );
			}

			this.glRenderer.initBatch( vertexItems );
		},

		/**
		* Instructs the renderer to draw the particles.
		* @method renderGL
		* @private
		*/
		renderGL : function( gl, camera ) {
			var m = this.transform.getConcatenatedMatrix();
			this.glRenderer.modelMatrix = new Float32Array( [
				m.a, m.b, 0,
				m.c, m.d, 0,
				m.tx, m.ty, 1
			] );
			this.glRenderer.setWorldAngle(
				this.deriveWorldAngle( this.transform, camera ) );
			this.glRenderer.setTextureUniforms( gl, this.atlas );
		},

		/**
		* Computes a collapsed world rotation for the renderer.
		* @method deriveWorldAngle
		* @param transform {Kiwi.Geom.Transform} Transform of the gameObject
		* @param camera {Kiwi.Camera} Camera being rendered
		* @private
		*/
		deriveWorldAngle: function( transform, camera ) {
			var worldAngle,
				divisor = transform.scaleX * camera.transform.scaleX,
				m = transform.getConcatenatedMatrix();

			// Apply camera perspective
			m.prependMatrix( camera.transform.getConcatenatedMatrix() );
			m.prependMatrix( new Kiwi.Geom.Matrix( 1, 0, 0, 1,
				-camera.transform.rotPointX, -camera.transform.rotPointY ) );
			worldAngle = Math.acos( m.a / divisor );

			// acos does not distinguish between positive and negative angles,
			// so is wrong half the time. However, we know that sin will always
			// be negative when the angle is below 0 (and above -PI).
			if ( Math.asin( m.b / divisor ) < 0 ) {
				worldAngle *= -1;
			}
			return worldAngle;
		},

		/**
		* Returns a point on a unit arc based on a total number of points
		*	and an index
		* @method regularPointCirclePerimeter
		* @param a {number} Start angle of the arc
		* @param b {number} End angle of the arc
		* @param index {number} Point index
		* @param total {number} Total number of points
		* @private
		*/
		regularPointCirclePerimeter : function( a, b, index, total ) {
			var t = ( (b - a ) / total ) * index + a;
			return { x: Math.cos( t ), y: Math.sin( t ) };
		},

		/**
		* Returns a point on a unit arc
		* @method randomPointCirclePerimeter
		* @param a {number} Start angle of the arc
		* @param b {number} End angle of the arc
		* @private
		*/
		randomPointCirclePerimeter : function( a, b ) {
			var t = a + ( (b - a ) * this.rnd() );
			return { x: Math.cos( t ), y: Math.sin( t ) };
		},

		/**
		* Returns a point within the sector of a circle
		* @method randomPointCircle
		* @param a {number} Start angle of the sector
		* @param b {number} End angle of the sector
		* @private
		*/
		randomPointCircle : function( a, b ) {
			var t = a + ( (b - a )* this.rnd() );
			var u = this.rnd() + this.rnd();
			var r = ( u > 1 ) ? 2 - u : u;
			return { x: r * Math.cos( t ), y: r * Math.sin( t ) };
		},

		/**
		* Returns a point within the unit square
		* @method randomPointRect
		* @private
		*/
		randomPointRect : function() {
			return { x: this.rnd() - 0.5, y: this.rnd() -0.5 };
		},

		/**
		* Returns a point on the perimeter of the unit square
		* @method randomPointRectPerimeter
		* @private
		*/
		randomPointRectPerimeter : function() {
			var t = this.rnd() * 4;

			if ( t < 1 ) {
				return { x: t - 0.5, y: -0.5 };
			}
			if ( t < 2 ) {
				return { x: 0.5, y: t - 1.5 };
			}
			if ( t < 3 ) {
				return { x: t - 2.5, y: 0.5 };
			}

			return { x: -0.5, y: t - 3.5 };
		},

		/**
		* Returns a point on a unit line based on
		*	a total number of points and an index.
		* @method regularPointLine
		* @param radians {number} Angle of the line
		* @param index {number} Point index
		* @param total {number} Total number of points
		* @private
		*/
		regularPointLine : function( radians, index, total ) {
			var len = 1 / total * index - 0.5;
			var x = len * Math.cos( radians );
			var y = len * Math.sin( radians );
			return { x: x, y: y };
		},

		/**
		* Returns a point on a unit line.
		* @method regularPointLine
		* @param {number} radians : the angle of the line
		* @private
		*/
		randomPointLine : function( radians ) {
			var r = this.rnd() - 0.5;
			var x = r * Math.cos( radians );
			var y = r * Math.sin( radians );
			return { x: x, y: y };
		},
};

for ( var prop in protoProps ) {
	Kiwi.GameObjects.StatelessParticles.prototype[ prop ] = protoProps[ prop ];

}
}());
