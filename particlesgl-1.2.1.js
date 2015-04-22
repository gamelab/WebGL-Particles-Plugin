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
* @param config {object} Particle configuration object;
*	see properties for more information.
* @param [clock] {Kiwi.Time.Clock} Clock to govern animation.
*	If omitted, will use state.game.time.clock.
* @public
* @return {Kiwi.GameObjects.StatelessParticles}
*/

Kiwi.GameObjects.StatelessParticles =
		function( state, atlas, x, y, config, clock ) {
	Kiwi.Entity.call( this, state, x, y );

	if ( !clock || clock.objType !== "Clock" ) {
		clock = state.game.time.clock;
	}

	return this.constructor( state, atlas, x, y, config, clock );

};
Kiwi.extend( Kiwi.GameObjects.StatelessParticles, Kiwi.Entity );


(function() {
	var protoProps = {

		constructor : function( state, atlas, x, y, config, clock ) {
			var i;

			/**
			* Config object. This allows you to alter any or all of the default
			*	properties of a particle object. You do not need to specify
			*	any config values; they all have default values.
			*	A complete listing is as follows:
			* <ul>
			* <li>additive: Whether to draw in additive mode. Boolean.
			*	Default false.</li>
			* <li>alpha: Overall object transparency. Number, range 0-1.
			*	More sophisticated alpha control is available via
			*	alphaGradient and alphaStops.
			*	Default 1.</li>
			* <li>alphaGradient: Alpha value at four points throughout the
			*	lifetime of each particle. Array of numbers, range 0-1.
			*	Default [ 1, 1, 1, 0 ].</li>
			* <li>alphaStops: Coordinates for alpha gradient stops.
			*	The beginning and end are always 0 and 1 respectively;
			*	this specifies the middle two stops.
			*	Array of numbers, range 0-1. Default [ 0.3, 0.7 ].</li>
			* <li>angStartMin: 0,</li>
			* <li>angStartMax: 0,</li>
			* <li>angVelocityConform: false,</li>
			* <li>colEnv0: Initial color value in the particle's lifespan.
			*	Array of three numbers, range 0-1. Default [ 1, 0, 0 ].</li>
			* <li>colEnv1: Second color value in the particle's lifespan.
			*	Array of three numbers, range 0-1. Default [ 1, 1, 0 ].</li>
			* <li>colEnv2: Third color value in the particle's lifespan.
			*	Array of three numbers, range 0-1. Default [ 1, 1, 1 ].</li>
			* <li>colEnv3: Final color value in the particle's lifespan.
			*	Array of three numbers, range 0-1. Default [ 0, 0, 0 ].</li>
			* <li>colEnvKeyframes: Coordinates for color gradient stops.
			*	The beginning and end are always 0 and 1 respectively;
			*	this specifies the middle two stops.
			*	Array of numbers, range 0-1. Default [ 0.5, 0.6 ].</li>
			* <li>endSize: Size of particle at end of lifespan in pixels.
			*	Number, default 150.</li>
			* <li>gravityX: Acceleration along X axis. Number, default 0.</li>
			* <li>gravityY: Acceleration along Y axis. Number, default -50.
			* <li>loop: Whether the particles repeat, or play once.
			*	Boolean, default true.</li>
			* <li>maxLifespan: Maximum random lifespan. Number, default 5.</li>
			* <li>maxStartTime: Maximum random start time.
			*	Number, default 6.</li>
			* <li>maxVel: Maximum random start velocity.
			*	Number, default 100.</li>
			* <li>minLifespan: Minimum random lifespan. Number, default 3.</li>
			* <li>minStartTime: Minimum random start time.
			*	Number, default 1.</li>
			* <li>minVel: Minimum random start velocity.
			*	Number, default 70.</li>
			* <li>numParts: Number of particles to emit, default 20.</li>
			* <li>posAngle: Angle of "line" emitter. Number, default 0.
			* <li>posConstrainRadial: Whether to emit from the edge of a
			*	"radial" emitter. Boolean, default true.</li>
			* <li>posConstrainRect: Whether to emit from the edge of a
			*	"rectangle" emitter. Boolean, default true.</li>
			* <li>posHeight: Height of "rectangle" emitter.
			*	Number, default 100.</li>
			* <li>posLength: Length of "line" emitter.
			*	Number, default 100.</li>
			* <li>posOffsetX: Position offset of emitter.
			*	Number, default 0.</li>
			* <li>posOffsetY: Position offset of emitter.
			*	Number, default 0.</li>
			* <li>posRadialStart: Beginning angle of arc of "radial"
			*	emitter. Number, default 4.363323129985823.</li>
			* <li>posRadialEnd: End angle of arc of "radial" emitter.
			*	Number, default 5.061454830783556.</li>
			* <li>posRadius: Radius of "radial" emitter.
			*	Number, default 50.</li>
			* <li>posShape: Shape of emitter. String, default "radial".
			*	Choose one of:
			* <ul>
			* <li>"radial"</li>
			* <li>"rectangle"</li>
			* <li>"line"</li>
			* </ul></li>
			* <li>posWidth: Width of "rectangle" emitter.
			*	Number, default 100.</li>
			* <li>startSize: Size of particle at start of lifespan in
			*	pixels. Number, default 4.</li>
			* <li>velAngle: Angle of "line" emission velocity type.
			*	Number, default 0.</li>
			* <li>velAngMin: Minimum angular velocity of emitted particles.
			*	Number, default -2.</li>
			* <li>velAngMax: Maximum angular velocity of emitted particles.
			*	Number, default 2.</li>
			* <li>velConstrainRadial: Whether to constrain velocities
			*	of particles emitted using "radial" velocity to the edge
			*	of a circle, ensuring they all have the same magnitude.
			*	Number, default false.</li>
			* <li>velConstrainRect: Whether to constrain velocities
			*	of particles emitted using "rectangle" velocity to the edge
			*	of the rectangle. Number, default false.</li>
			* <li>velHeight: Height of velocity vectors created by
			*	"rectangle" type emitter. Number, default 100.</li>
			* <li>velLength: Range of lengths of velocity vectors
			*	created by "line" type emitter. Number, default 30.</li>
			* <li>velOffsetX: Offset applied to all velocity vectors.
			*	Number, default 0.</li>
			* <li>velOffsetY: Offset applied to all velocity vectors.
			*	Number, default 0.</li>
			* <li>velRadialStart: Low angle of arc describing
			*	velocity vectors created with "radial" type velocity.
			*	Number, default 0.</li>
			* <li>velRadialEnd: High angle of arc describing
			*	velocity vectors created with "radial" type velocity.
			*	Number, default 6.283185307179586.</li>
			* <li>velRadius: Radius of velocity vectors created
			*	using "radial" type velocity. Number, default 100.</li>
			* <li>velShape: Shape of velocity vector creator.
			*	String, default "line".
			* <ul>
			* <li>"center"</li>
			* <li>"radial"</li>
			* <li>"rectangle"</li>
			* <li>"line"</li>
			* </ul></li>
			* <li>velWidth: Width of velocity vectors created by
			*	"rectangle" type emitter. Number, default 100.</li>
			* </ul>
			* @property config
			* @type Object
			* @public
			*/
			this.config = this.buildDefaultConfig();

			/**
			* Used to determine how to scale particles when the stage changes.
			* @property _stageScale
			* @type Kiwi.Geom.Point
			* @default ( 1, 1 )
			* @private
			* @since 1.1.1
			*/
			this._stageScale = new Kiwi.Geom.Point( 1, 1 );

			/**
			* Indicates whether the object has been altered
			*	and is in need of update.
			* @property dirty
			* @type Boolean
			* @public
			* @since 1.1.2
			*/
			this.dirty = false;

			/**
			* Color at stop 0 (start)
			* @property color0
			* @type Kiwi.Utils.Color
			* @private
			* @since 1.2.0
			*/
			this._color0 = new Kiwi.Utils.Color();

			/**
			* Color at stop 1
			* @property color1
			* @type Kiwi.Utils.Color
			* @private
			* @since 1.2.0
			*/
			this._color1 = new Kiwi.Utils.Color();

			/**
			* Color at stop 2
			* @property color2
			* @type Kiwi.Utils.Color
			* @private
			* @since 1.2.0
			*/
			this._color2 = new Kiwi.Utils.Color();

			/**
			* Color at stop 3 (end)
			* @property color3
			* @type Kiwi.Utils.Color
			* @private
			* @since 1.2.0
			*/
			this._color3 = new Kiwi.Utils.Color();

			/**
			* Timer used to schedule particle cessation
			* @property _timer
			* @type Kiwi.Time.Timer
			* @private
			*/
			this._timer = null;

			/**
			* Matrix used to compute angles during rendering.
			* This is a scratch value and has no other meaning.
			*
			* @property _deriveAngleTransformMatrix
			* @type Kiwi.Geom.Matrix
			* @private
			*/
			this._deriveAngleTransformMatrix = new Kiwi.Geom.Matrix();

			/**
			* Matrix used to compute angles during rendering.
			* This is a scratch value and has no other meaning.
			*
			* @property _deriveAngleOffsetMatrix
			* @type Kiwi.Geom.Matrix
			* @private
			*/
			this._deriveAngleOffsetMatrix = new Kiwi.Geom.Matrix();

			this.clock = clock;

			this.randoms = function() {
				var arr = [];
				for ( i =0; i < 5000; i++ ) {
					arr.push( Math.random() );
				}
				return arr;
			}();

			if ( typeof x === "undefined" ) {
				x = 0;
			}
			if ( typeof y === "undefined" ) {
				y = 0; }
			if( typeof config !== "undefined" ) {
				this.mergeConfig( this.config, config );
			}

			if ( this.game.renderOption === Kiwi.RENDERER_WEBGL ) {
				this.glRenderer = this.game.renderer.requestRendererInstance(
					"StatelessParticleRenderer",
					{
						config: this.config,
						gameObject: this
					} );
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
			this.transform.rotPointX = 0;
			this.transform.rotPointY = 0;
			this.box = this.components.add(
				new Kiwi.Components.Box( this, x, y, this.width, this.height) );

			// Hide object until it is fully initialised by startEmitting
			this.visible = false;
		},

		/**
		* Sets a color stop using Kiwi.Utils.Color terminology.
		* Specify any valid Color arguments after the index.
		* You may set alpha in this way.
		* @method setColor
		* @param index {number} Index of the color stop: 0-3.
		* @public
		* @since 1.2.0
		*/
		setColor: function( index ) {
			// var args = arguments;//.slice( 1 );
			// Kiwi.Log.log( "Arguments", "#debug", arguments);
			var i,
				args = [];
			for ( i in arguments ) {
				args[ i ] = arguments[ i ];
			}
			args = args.slice( 1 );

			switch( index ) {
				case 0:
					this._color0.set.apply( this._color0, args );
					this.setConfigProp( "colEnv0",
						[ this._color0.r, this._color0.g, this._color0.b ],
						true );
					this.setConfigProp( "alphaGradient",
						[ this._color0.a,
						this.config.alphaGradient[1],
						this.config.alphaGradient[2],
						this.config.alphaGradient[3] ],
						true );
					break;
				case 1:
					this._color1.set.apply( this._color1, args );
					this.setConfigProp( "colEnv1",
						[ this._color1.r, this._color1.g, this._color1.b ],
						true );
					this.setConfigProp( "alphaGradient",
						[ this.configalphaGradient[0],
						this._color1.a,
						this.config.alphaGradient[2],
						this.config.alphaGradient[3] ],
						true );
					break;
				case 2:
					this._color2.set.apply( this._color2, args );
					this.setConfigProp( "colEnv2",
						[ this._color2.r, this._color2.g, this._color2.b ],
						true );
					this.setConfigProp( "alphaGradient",
						[ this.config.alphaGradient[0],
						this.config.alphaGradient[1],
						this._color2.a,
						this.config.alphaGradient[3] ],
						true );
					break;
				case 3:
					this._color3.set.apply( this._color3, args );
					this.setConfigProp( "colEnv3",
						[ this._color3.r, this._color3.g, this._color3.b ],
						true );
					this.setConfigProp( "alphaGradient",
						[ this.config.alphaGradient[0],
						this.config.alphaGradient[1],
						this.config.alphaGradient[2],
						this._color3.a ],
						true );
					break;
			}
		},

		/**
		* Returns a color from this object. Note that this color will not
		* update the particles if you change it; you must use "setColor".
		* @method getColor
		* @param index {number} Position of color stop, 0-3
		* @return Kiwi.Utils.Color
		* @public
		* @since 1.2.0
		*/
		getColor: function( index ) {
			switch( index ) {
				case 1:
					this._color1.set(
						this.config.colEnv1[0],
						this.config.colEnv1[1],
						this.config.colEnv1[2],
						this.config.alphaGradient[1] );
					return this._color1;
				case 2:
					this._color2.set(
						this.config.colEnv2[0],
						this.config.colEnv2[1],
						this.config.colEnv2[2],
						this.config.alphaGradient[2] );
					return this._color2;
				case 3:
					this._color3.set(
						this.config.colEnv3[0],
						this.config.colEnv3[1],
						this.config.colEnv3[2],
						this.config.alphaGradient[3] );
					return this._color3;
				default:
					this._color0.set(
						this.config.colEnv0[0],
						this.config.colEnv0[1],
						this.config.colEnv0[2],
						this.config.alphaGradient[0] );
					return this._color0;
			}
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
				"alpha": 1,
				"alphaGradient": [
					1,
					1,
					1,
					0
				],
				"alphaStops": [
					0.3,
					0.7
				],
				"angStartMin": 0,
				"angStartMax": 0,
				"angVelocityConform": false,
				"numParts": 20,
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
				"colEnvKeyframes": [
					0.5,
					0.6
				],
				"endSize": 150,
				"gravityX": 0,
				"gravityY": -50,
				"loop": true,
				"maxLifespan": 5,
				"maxStartTime": 6,
				"maxVel": 100,
				"minLifespan": 3,
				"minStartTime": 1,
				"minVel": 70,
				"posAngle": 0,
				"posConstrainRadial": true,
				"posConstrainRect": true,
				"posHeight": 100,
				"posLength": 100,
				"posOffsetX": 0,
				"posOffsetY": 0,
				"posRadialStart": 4.363323129985823,
				"posRadialEnd": 5.061454830783556,
				"posRadius": 50,
				"posShape": "radial",
				"posWidth": 100,
				"startSize": 4,
				"velAngle": 0,
				"velAngMin": -2,
				"velAngMax": +2,
				"velConstrainRadial": false,
				"velConstrainRect": false,
				"velHeight": 100,
				"velLength": 30,
				"velOffsetX": 0,
				"velOffsetY": 0,
				"velRadialStart": 0,
				"velRadialEnd": 6.283185307179586,
				"velRadius": 100,
				"velShape": "line",
				"velWidth": 100
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
				config1[ i ] = this.forceNumeric( config2[ i ] );
			}
		},

		/**
		* Recursively forces anything that can be a number
		* to be a number, including array members.
		* @method forceNumeric
		* @param value {any} A value to force
		* @return {any} The value
		* @public
		* @since 1.2.0
		*/
		forceNumeric: function( value ) {
			var i, num;

			if ( typeof value === "string" ) {
				num = +value;
				if ( !isNaN( num ) ) {
					return num;
				}
			}

			if ( Kiwi.Utils.Common.isArray( value ) ) {
				for ( i in value ) {
					value[ i ] = this.forceNumeric( value[ i ] );
				}
			}

			return value;
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
			this.clock.removeTimer( this._timer );
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
			this.clock.removeTimer( this._timer );
			this._timer = this.clock.setTimeout( function() {
				that.effectState = "stopped";
				that.visible = false;
				if ( remove ) {
					that.remove.call( that );
				}
			}, milliseconds );
		},

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
			this.dirty = true;
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

				vertexItems.push(
					startTime,
					lifespan,
					velAng,
					startAng );
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
			var aspectRatioCanvas, aspectRatioWindow, scaleFactor,
				m = this.transform.getConcatenatedMatrix();

			if ( this.dirty ) {
				this.dirty = false;
				this.glRenderer.enableUniforms();
			}

			this.glRenderer.modelMatrix = m;
			this.glRenderer.setWorldAngle(
				this.deriveWorldAngle( this.transform, camera ) );
			this.glRenderer.setTextureUniforms( gl, this.atlas );

			// Set the stage scale factor when using CocoonJS
			// Because this is a WebGL-only plugin, we can safely assume
			// that we must use WebGL-specific scaling techniques,
			// as CocoonJS does not scale WebGL contexts using CSS techniques.
			if ( this.state.game.deviceTargetOption === Kiwi.TARGET_COCOON ) {
				if ( this.state.game.stage.scaleType ===
						Kiwi.Stage.SCALE_NONE ) {
					this._stageScale.setTo( 1, 1 );
				} else if ( this.state.game.stage.scaleType ===
						Kiwi.Stage.SCALE_FIT ) {
					aspectRatioCanvas = this.state.game.stage.width /
						this.state.game.stage.height;
					aspectRatioWindow = window.innerWidth /
						window.innerHeight;
					if ( aspectRatioWindow > aspectRatioCanvas ) {
						scaleFactor = window.innerHeight /
							this.state.game.stage.height;
						this._stageScale.setTo( scaleFactor, scaleFactor );
					} else {
						scaleFactor = window.innerWidth /
							this.state.game.stage.width;
						this._stageScale.setTo( scaleFactor, scaleFactor );
					}
				} else if ( this.state.game.stage.scaleType ===
						Kiwi.Stage.SCALE_STRETCH ) {
					this._stageScale.x = window.innerWidth /
						this.state.game.stage.width;
					this._stageScale.y = window.innerHeight /
						this.state.game.stage.height;
				}
			}
			this.glRenderer.stageScale.setTo(
				this._stageScale.x, this._stageScale.y );
		},

		/**
		* Computes a collapsed world rotation for the renderer.
		* @method deriveWorldAngle
		* @param transform {Kiwi.Geom.Transform} Transform of the gameObject
		* @param camera {Kiwi.Camera} Camera being rendered
		* @private
		*/
		deriveWorldAngle: function( transform, camera ) {
			var m, worldAngle,
				divisor = transform.scaleX * camera.transform.scaleX;

			this._deriveAngleTransformMatrix.copyFrom(
				transform.getConcatenatedMatrix() );
			m = this._deriveAngleTransformMatrix;

			// Apply camera perspective
			m.prependMatrix( camera.transform.getConcatenatedMatrix() );
			m.prependMatrix( this._deriveAngleOffsetMatrix.setTo( 1, 0, 0, 1,
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
		Kiwi.GameObjects.StatelessParticles.prototype[ prop ] =
			protoProps[ prop ];

	}
}());

/**
* The particles plugin creates a new gameobject "StatelessParticles".
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
	* @default "ParticlesGL"
	* @public
	*/
	name:"ParticlesGL",

	/**
	* The version of this plugin.
	* @property version
	* @type String
	* @public
	*/
	version:"1.2.1",

	minimumKiwiVersion:"1.2.1",

	pluginDependencies: []
};

/**
* Registers this plugin with the Global Kiwi Plugins Manager if it is avaiable.
* 
*/
Kiwi.PluginManager.register(Kiwi.Plugins.ParticlesGL);

/**
* @module Kiwi
* @submodule Renderers
* @main StatelessParticleRenderer
*/

/**
* Renderer used by the Kiwi.GameObjects.StatelessParticle
* @class StatelessParticleRenderer
* @constructor
* @param gl {WebGLRenderingContext}
* @param shaderManager {Kiwi.Shaders.ShaderManager}
* @param params {object} Parameter object
* @param [params.config] {object} Configuration definitions
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer =
		function( gl, shaderManager, params ) {
	Kiwi.Renderers.Renderer.call( this, gl, shaderManager, false, params );

	this.gl = gl;
	this._config = params.config;
	this._gameObject = params.gameObject;

	/**
	* Contains information on stage scaling.
	* @property _stageScale
	* @type Kiwi.Geom.Point
	* @default ( 1, 1 )
	* @private
	* @since 1.1.1
	*/
	this._stageScale = new Kiwi.Geom.Point( 1, 1 );
	
	if ( !this._config ) {
		console.log( "no particle configuration supplied" );
	}

	this.vertexBuffer = new Kiwi.Renderers.GLArrayBuffer( gl, 12 );

	this.shaderPair = this.shaderManager.requestShader(
		gl, "StatelessParticleShader", false );

	this.worldAngle = 0;

	/**
	* Concatenated transformation matrix of the particle object
	* currently being rendered
	*
	* @property modelMatrix
	* @type Kiwi.Geom.Matrix
	*/
	this.modelMatrix = new Kiwi.Geom.Matrix();

	/**
	* Camera matrix derived from render manager camera data.
	* Used to compute final matrix for shader.
	*
	* @property _camMatrix
	* @type Kiwi.Geom.Matrix
	*/
	this._camMatrix = new Kiwi.Geom.Matrix();

};
Kiwi.extend( Kiwi.Renderers.StatelessParticleRenderer,
	Kiwi.Renderers.Renderer );

/**
* Identification string
* @property RENDERER_ID
* @type string
* @default "StatelessParticleRenderer"
* @final
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.RENDERER_ID =
	"StatelessParticleRenderer";

/**
* Contains information on stage scaling, received from the rendered entity.
* @property stageScale
* @type Kiwi.Geom.Point
* @default ( 1, 1 )
* @public
* @since 1.1.1
*/
Object.defineProperty( Kiwi.Renderers.StatelessParticleRenderer.prototype,
		"stageScale", {
	get: function() {
		return this._stageScale;
	},
	set: function( value ) {
		this._stageScale = value;
	}
} );


/**
* Configures the shader to use the current configuration of the game object.
* @method setConfig
* @param config {object} Configuration object set up in GameObject
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.setConfig =
		function( config ) {
	this._config = config;

	// Set desired blend mode
	if ( config.additive ) {
		this.blendMode.setMode( "ADDITIVE" );
	} else {
		this.blendMode.setMode( "NORMAL" );
	}
};

/**
* Resets the timer, so that the particles begin from the start.
* @method resetTime
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.resetTime = function() {
	this.startTime = this._now();
};

/**
* Resets the pause time. This will probably hold for some 4 decades,
* longer than the physical lifetime of many devices.
* @method resetPauseTime
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.resetPauseTime =
		function() {
	this.pauseTime = 999999999;
};

/**
* Enables the renderer in the rendering pipeline.
* @method enable
* @param gl {WebGLRenderingContext}
* @param params {object}
* @param params.camMatrix {array} 3*3 transformation matrix
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.enable =
		function( gl, params ) {
	this.shaderPair = this.shaderManager.requestShader(
		gl, "StatelessParticleShader" );
	this._setStandardUniforms( gl, params.stageResolution, params.camMatrix );
	this._setConfigUniforms( gl );
};

/**
* Sets key uniforms.
* @method enableUniforms
* @param gl {WebGLRenderingContext}
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.enableUniforms =
		function( gl ) {
	this._setConfigUniforms( gl );
};

/**
* Configures basic uniforms in the shader.
* @method _setStandardUniforms
* @param gl {WebGLRenderingContext}
* @param stageResolution {Float32Array}
* @param camMatrix {array} 3*3 transformation matrix
* @private
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype._setStandardUniforms =
		function( gl, stageResolution, camMatrix ) {

	// Texture
	gl.uniform1i( this.shaderPair.uniforms.uSampler.location, 0 );

	// Standard uniforms
	gl.uniformMatrix3fv( this.shaderPair.uniforms.uCamMatrix.location,
		false, camMatrix );
	gl.uniform2fv( this.shaderPair.uniforms.uResolution.location,
		stageResolution );

	this.camMatrix = new Float32Array( camMatrix.buffer );
};

/**
* Configures particle animation uniforms in the shader.
* @_setConfigUniforms
* @param gl {WebGLRenderingContext}
* @private
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype._setConfigUniforms =
		function( gl ) {
	var pointSizeRange,
		cfg = this._config;
	
	gl = gl || this.gl;

	// Scale point size
	pointSizeRange = new Float32Array( [
		cfg.startSize * this._stageScale.x,
		cfg.endSize * this._stageScale.y
		] );

	// Particle uniforms
	gl.uniform1f( this.shaderPair.uniforms.uAlpha.location, cfg.alpha );
	gl.uniform4fv( this.shaderPair.uniforms.uAlphaGradient.location,
		new Float32Array( cfg.alphaGradient ) );
	gl.uniform2fv( this.shaderPair.uniforms.uAlphaStops.location,
		new Float32Array( cfg.alphaStops ) );
	gl.uniform3fv( this.shaderPair.uniforms.uColEnv0.location,
		new Float32Array( cfg.colEnv0 ) );
	gl.uniform3fv( this.shaderPair.uniforms.uColEnv1.location,
		new Float32Array( cfg.colEnv1 ) );
	gl.uniform3fv( this.shaderPair.uniforms.uColEnv2.location,
		new Float32Array( cfg.colEnv2 ) );
	gl.uniform3fv( this.shaderPair.uniforms.uColEnv3.location,
		new Float32Array( cfg.colEnv3 ) );
	gl.uniform2fv( this.shaderPair.uniforms.uColEnvKeyframes.location,
		new Float32Array( cfg.colEnvKeyframes ) );
	gl.uniform2fv( this.shaderPair.uniforms.uGravity.location,
		new Float32Array( [ cfg.gravityX, cfg.gravityY ] ) );
	gl.uniform1i( this.shaderPair.uniforms.uLoop.location,
		cfg.loop ? 1 : 0 );
	gl.uniform1f( this.shaderPair.uniforms.uPauseTime.location,
		this.pauseTime );
	gl.uniform2fv( this.shaderPair.uniforms.uPointSizeRange.location,
		pointSizeRange );
	gl.uniform1f( this.shaderPair.uniforms.uT.location, 0 );
};

/**
* Configures texture uniforms on the shader.
* @method setTextureUniforms
* @param gl {WebGLRenderingContext}
* @param textureAtlas {Kiwi.Textures.TextureAtlas}
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.setTextureUniforms =
		function( gl, textureAtlas ) {
	gl.uniform2fv( this.shaderPair.uniforms.uTextureSize.location,
		new Float32Array( [ textureAtlas.image.width,
			textureAtlas.image.height ] ) );
};

/**
* Disables the renderer to make way for subsequent batches.
* @method disable
* @param gl {WebGLRenderingContext}
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.disable = function( gl ) {
	gl.disableVertexAttribArray(
		this.shaderPair.attributes.aXYVxVy );
	gl.disableVertexAttribArray(
		this.shaderPair.attributes.aBirthLifespanAngle );
	gl.disableVertexAttribArray(
		this.shaderPair.attributes.aCellXYWH );
};

/**
* Clears the renderer to make way for new data.
* @method clear
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.clear = function() {
	this.vertexBuffer.clear();
};

/**
* The current time, used to drive stateless animation
* @property time
* @type number
* @default 0
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.time = 0;

/**
* The pause time
* @property pauseTime
* @type number
* @default 999999999
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.pauseTime = 999999999;

/**
* Pauses the particle emission.
* @method pause
* @param gl {WebGLRenderingContext}
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.pause = function( gl ) {
	gl = gl || this.gl;
	this.pauseTime = this.time;
};

/**
* Sets the "world angle"
* Configures the shader to render correctly when the world has been rotated.
* @method setWorldAngle
* @param angle {number}
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.setWorldAngle =
		function( angle ) {
	this.worldAngle = angle;
};

/**
* Renders the object using WebGL
* @method draw
* @param gl {WebGLRenderingContext}
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.draw = function( gl ) {
	this._camMatrix.setTo(
		this.camMatrix[ 0 ], this.camMatrix[ 1 ],
		this.camMatrix[ 3 ], this.camMatrix[ 4 ],
		this.camMatrix[ 6 ], this.camMatrix[ 7 ] );
	this._camMatrix.appendMatrix( this.modelMatrix );
	gl.uniformMatrix3fv( this.shaderPair.uniforms.uCamMatrix.location,
		false, new Float32Array( [
			this._camMatrix.a, this._camMatrix.b, 0,
			this._camMatrix.c, this._camMatrix.d, 0,
			this._camMatrix.tx, this._camMatrix.ty, 1 ] ) );

	// calculate time
	this.time = this._now() - this.startTime;
	gl.uniform1f( this.shaderPair.uniforms.uT.location, this.time );

	// World angle including current camera perspective
	gl.uniform1f( this.shaderPair.uniforms.uWorldAngle.location,
		this.worldAngle );

	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer.buffer );

	gl.enableVertexAttribArray( this.shaderPair.attributes.aXYVxVy );
	gl.vertexAttribPointer( this.shaderPair.attributes.aXYVxVy,
		4, gl.FLOAT, false, 48, 0 );

	gl.enableVertexAttribArray(
		this.shaderPair.attributes.aBirthLifespanAngle );
	gl.vertexAttribPointer( this.shaderPair.attributes.aBirthLifespanAngle,
		4, gl.FLOAT, false, 48, 16 );

	gl.enableVertexAttribArray( this.shaderPair.attributes.aCellXYWH );
	gl.vertexAttribPointer( this.shaderPair.attributes.aCellXYWH,
		4, gl.FLOAT, false, 48, 32 );

	gl.drawArrays( gl.POINTS, 0,this._config.numParts );
};

/**
* Updates the stage resolution so that the image renders at the correct size.
* @method updateStageResolution
* @param gl {WebGLRenderingContext}
* @param res {Float32Array}
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.updateStageResolution =
		function( gl, res ) {
	gl.uniform2fv( this.shaderPair.uniforms.uResolution.location, res );
};

/**
* Updates the texture information.
* @method updateTextureSize
* @param gl {WebGLRenderingContext}
* @param size {Float32Array}
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.updateTextureSize =
		function( gl, size ) {
	gl.uniform2fv( this.shaderPair.uniforms.uTextureSize.location, size );
};

/**
* Uploads the vertex buffer. Because these particles are stateless,
* this can be done once and left alone, making particles very efficient.
* @method initBatch
* @param vertexItems {Array}
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.initBatch =
		function( vertexItems ) {
	this.vertexBuffer.items = vertexItems;
	this.vertexBuffer.uploadBuffer( this.gl, this.vertexBuffer.items );
};

/**
* Returns the current time
* @method _now
* @return number
* @private
* @since 1.2.0
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype._now = function() {
	return this._gameObject.clock.elapsed();
};


/**
* Removes external references, allowing this to be destroyed without
* memory leaks.
* @method destroy
* @param gl {WebGLRenderingContext}
* @public
*/
Kiwi.Renderers.StatelessParticleRenderer.prototype.destroy = function( gl ) {
	gl = gl || this.gl;
	gl.deleteBuffer( this.vertexBuffer.buffer );
};

/**
* @module Kiwi
* @submodule Shaders
* @main StatelessParticleShader
*/

/**
* Shader for stateless particles
* @class StatelessParticleShader
* @constructor
* @public
*/
Kiwi.Shaders.StatelessParticleShader = function(){
	Kiwi.Shaders.ShaderPair.call( this );

	/**
	* Records the attribute locations of this shader.
	* @property attributes
	* @type object
	*/
	this.attributes = {
		aXYVxVy: null,
		aBirthLifespanAngle: null,
		aCellXYWH: null
	};
};
Kiwi.extend( Kiwi.Shaders.StatelessParticleShader, Kiwi.Shaders.ShaderPair );

/**
* Initialises the shader wrapper with references to attributes and uniforms.
* @method init
* @param gl {WebGLRenderingContext}
* @public
*/
Kiwi.Shaders.StatelessParticleShader.prototype.init = function( gl ) {
	Kiwi.Shaders.ShaderPair.prototype.init.call(this,gl);

	this.attributes.aBirthLifespanAngle = gl.getAttribLocation(
		this.shaderProgram, "aBirthLifespanAngle" );
	this.attributes.aCellXYWH = gl.getAttribLocation(
		this.shaderProgram, "aCellXYWH" );
	this.attributes.aXYVxVy = gl.getAttribLocation(
		this.shaderProgram, "aXYVxVy" );
	this.initUniforms(gl);
};

/**
* List of uniforms and types
* @property uniforms
* @final
* @type object
* @public
*/
Kiwi.Shaders.StatelessParticleShader.prototype.uniforms = {
	uAlpha: {
		type: "1f"
	},
	uAlphaGradient: {
		type: "4fv"
	},
	uAlphaStops: {
		type: "2fv"
	},
	uCamMatrix: {
		type: "mat3"
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
	uGravity: {
		type: "2fv"
	},
	uLoop: {
		type: "1i"
	},
	uPauseTime: {
		type: "1f"
	},
	uPointSizeRange: {
		type: "2fv"
	},
	uResolution: {
		type: "2fv"
	},
	uSampler: {
		type: "1i",
	},
	uT: {
		type: "1f"
	},
	uTextureSize: {
		type: "2fv"
	},
	uWorldAngle: {
		type: "1f"
	}
};

/**
* Fragment shader source
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
	"void main( void ) {",
	"	vec2 cellCoord = vCell.xy + vCell.zw * gl_PointCoord;",
	"	vec2 texCoord = ( vRotationMatrix * vec4( cellCoord, 0, 1 ) ).xy;",
	"	vec4 sampleCol = texture2D( uSampler, texCoord );",
	"	gl_FragColor.rgb = vCol.rgb * sampleCol.rgb;",
	"	gl_FragColor.a = sampleCol.a * vCol.a;",
	"}"
];


/**
* Vertex shader source
* @property texture2DVert
* @type Array
* @public
*/
Kiwi.Shaders.StatelessParticleShader.prototype.vertSource = [
	"precision mediump float;",
	"attribute vec4 aXYVxVy;",
	"attribute vec4 aBirthLifespanAngle;",
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
	"uniform float uWorldAngle;",
	
	"uniform float uAlpha;",
	"uniform bool uLoop;",

	"varying vec4 vCol;",
	"varying mat4 vRotationMatrix;",
	"varying vec4 vCell;",

	"vec3 deadPos = vec3( -0.02, -0.02, 0.01 );",

	"void main(void) {",
	"	float lerp;",
	"	float birthTime = aBirthLifespanAngle.x;",
	"	float lifespan = aBirthLifespanAngle.y;",
	"	float angularVelocity = aBirthLifespanAngle.z;",
	"	float angleStart = aBirthLifespanAngle.w;",
	"	float deathTime = birthTime + lifespan;",
	"	float age = mod(uT-birthTime,lifespan);",
	"	float pauseTimeAge = mod(uPauseTime-birthTime,lifespan);",

	"	float loopBirthTime = (uT - birthTime) / lifespan;",
	"	if ( uT < birthTime || (uT >= deathTime && !uLoop ) ||",
	"			(uT >= uPauseTime - pauseTimeAge + lifespan)) {",
	"		gl_Position = vec4(deadPos.x,deadPos.y,0,0);",
	"		gl_PointSize = deadPos.z;",
	"	} else {",
	"		lerp =  age / lifespan;",
	"		gl_PointSize = mix( uPointSizeRange.x, uPointSizeRange.y, lerp );",
	"		vec2 pos = aXYVxVy.xy;",
	"		vec2 vel = aXYVxVy.zw;",
	"		pos += age * vel;",
	"		pos += 0.5 * uGravity * age * age;",
	"		pos = ( uCamMatrix * vec3( pos, 1.0 ) ).xy;",
	"		pos = ( pos / uResolution ) * 2.0 - 1.0;",
	"		gl_Position = vec4( pos * vec2( 1, -1 ), 0, 1 );",

	"		float colLerp = 1.0;",
	"		if ( lerp <= uColEnvKeyframes.x ) {",
	"			float cLerp = lerp / uColEnvKeyframes.x;",
	"			vCol = vec4( mix( uColEnv0, uColEnv1, cLerp ), 1.0 );",
	"		} else if ( lerp > uColEnvKeyframes.x &&",
	"				lerp <= uColEnvKeyframes.y ) {",
	"			float cLerp = ( lerp - uColEnvKeyframes.x ) /",
	"				( uColEnvKeyframes.y - uColEnvKeyframes.x );",
	"			vCol = vec4( mix( uColEnv1, uColEnv2, cLerp ), 1.0 );",
	"		} else {",
	"			float cLerp = ( lerp - uColEnvKeyframes.y ) /",
	"				( 1.0 - uColEnvKeyframes.y );",
	"			vCol = vec4( mix( uColEnv2, uColEnv3, cLerp ), 1.0 );",
	"		}",
	"		if (lerp <= uAlphaStops.x) {",
	"			vCol.a = mix( uAlphaGradient.x, uAlphaGradient.y,",
	"				lerp / uAlphaStops.x );",
	"		} else if ( lerp > uAlphaStops.x && lerp <= uAlphaStops.y ) {",
	"			vCol.a = mix( uAlphaGradient.y, uAlphaGradient.z,",
	"				( lerp - uAlphaStops.x ) /",
	"				( uAlphaStops.y - uAlphaStops.x ) );",
	"		} else {",
	"			vCol.a = mix( uAlphaGradient.z, uAlphaGradient.w,",
	"				( lerp - uAlphaStops.y ) / ( 1.0 - uAlphaStops.y ) );",
	"		}",

	"		vCol.a *= uAlpha;",
	"		float ang = age * angularVelocity + angleStart + uWorldAngle;",
	"		vec2 ratio = vec2( 1.0 / uTextureSize.x, 1.0 / uTextureSize.y );",
	"		vec4 normCell = aCellXYWH;",
	"		normCell.xz *= ratio;",
	"		normCell.yw *= ratio;",
	"		vec2 cellCenter = vec2( normCell.x + normCell.z / 2.0,",
	"			normCell.y + normCell.w / 2.0 );",
	"		float c = cos( ang );",
	"		float s = sin( ang );",
	"		mat4 transInMat = mat4(",
	"			1.0, 0.0, 0.0, 0.0,",
	"			0.0, 1.0, 0.0, 0.0,",
	"			0.0, 0.0, 1.0, 0.0,",
	"			cellCenter.x, cellCenter.y, 0.0, 1.0 );",
	"		mat4 rotMat = mat4(",
	"			c, -s, 0.0, 0.0,",
	"			s, c, 0.0, 0.0,",
	"			0.0, 0.0, 1.0, 0.0,",
	"			0.0, 0.0, 0.0, 1.0 );",
	"		mat4 resultMat = transInMat * rotMat;",
	"		resultMat[ 3 ][ 0 ] = resultMat[ 3 ][ 0 ] + resultMat[ 0 ][ 0 ] *",
	"			-cellCenter.x + resultMat[ 1 ][ 0 ] * -cellCenter.y;",
	"		resultMat[ 3 ][ 1 ] = resultMat[ 3 ][ 1 ] + resultMat[ 0 ][ 1 ] *",
	"			-cellCenter.x + resultMat[ 1 ][ 1 ] * -cellCenter.y;",
	"		resultMat[ 3 ][ 2 ] = resultMat[ 3 ][ 2 ] + resultMat[ 0 ][ 2 ] *",
	"			-cellCenter.x + resultMat[ 1 ][ 2 ] * -cellCenter.y;",

	"		vRotationMatrix = resultMat;",
	"		vCell = normCell;",
	"	} ",
	"}"
];
