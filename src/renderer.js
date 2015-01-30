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
	this.modelMatrix = new Float32Array( [
	1, 0, 0,
	0, 1, 0,
	0, 0, 1 ] );

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
	this.gl.uniform1f( this.shaderPair.uniforms.uWorldAngle.location,
		this.worldAngle );
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
	var modelViewMatrix = mat3.create();
	mat3.mul( modelViewMatrix,this.camMatrix, this.modelMatrix );
	gl.uniformMatrix3fv( this.shaderPair.uniforms.uCamMatrix.location,
		false, modelViewMatrix );

	// calculate time
	this.time = this._now() - this.startTime;

	gl.uniform1f( this.shaderPair.uniforms.uT.location, this.time );

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
