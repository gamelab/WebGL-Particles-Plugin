Kiwi.Renderers.StatelessParticleRenderer = function (gl,shaderManager,params){
    Kiwi.Renderers.Renderer.call(this,gl,shaderManager,false,params);
    
    this._maxItems = 2000;
    
    this.gl = gl;
    
    this._config = params.config;
    
    if (!this._config) {
        console.log("no particle configuration supplied");
    }
   
    this.vertexBuffer = new Kiwi.Renderers.GLArrayBuffer(gl, 11);

    this.shaderPair = this.shaderManager.requestShader(gl, "StatelessParticleShader");
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
    
    this.shaderPair = this.shaderManager.requestShader(gl, "StatelessParticleShader");
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
    gl.uniform1f(this.shaderPair.uniforms.uStartAngle.location, cfg.startAngle || 0);
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





