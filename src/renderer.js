Kiwi.Renderers.StatelessParticleRenderer = function (gl,shaderManager,params){
    Kiwi.Renderers.Renderer.call(this,gl,shaderManager,false,params);
    
    this._maxItems = 2000;
    
    this.gl = gl;
    
    this._config = params.config;
    
    if (!this._config) {
        console.log("no particle configuration supplied");
    }
   
    this.vertexBuffer = new Kiwi.Renderers.GLArrayBuffer(gl, 12);

    this.shaderPair = this.shaderManager.requestShader(gl, "StatelessParticleShader");
    this.resetTime();

    this.worldAngle = 0;
    this.modelMatrix = new Float32Array([
    1,0,0,
    0,1,0,
    0,0,1]);

};
Kiwi.extend(Kiwi.Renderers.StatelessParticleRenderer,Kiwi.Renderers.Renderer);


Kiwi.Renderers.StatelessParticleRenderer.prototype.RENDERER_ID = "StatelessParticleRenderer";

Kiwi.Renderers.StatelessParticleRenderer.prototype.setConfig = function (config) {
    this._config = config;
    // Set desired blend mode
    if(config.additive)
        this.blendMode.setMode("ADDITIVE");
    else
        this.blendMode.setMode("NORMAL");
}

Kiwi.Renderers.StatelessParticleRenderer.prototype.resetTime = function () {
    this.startTime = Date.now();
}

Kiwi.Renderers.StatelessParticleRenderer.prototype.resetPauseTime = function () {
    this.pauseTime = 999999999;
}



Kiwi.Renderers.StatelessParticleRenderer.prototype.enable = function (gl, params) {
    this.shaderPair = this.shaderManager.requestShader(gl, "StatelessParticleShader");
    this._setStandardUniforms(gl,params.stageResolution,params.camMatrix)
    this._setConfigUniforms(gl);
}

Kiwi.Renderers.StatelessParticleRenderer.prototype._setStandardUniforms = function (gl,stageResolution, camMatrix){

    //Texture
    gl.uniform1i(this.shaderPair.uniforms.uSampler.location, 0);

    //Standard uniforms
    gl.uniform2fv(this.shaderPair.uniforms.uResolution.location, stageResolution);
    gl.uniformMatrix3fv(this.shaderPair.uniforms.uCamMatrix.location, false, camMatrix);
    gl.uniform1f(this.shaderPair.uniforms.uPauseTime.location, this.pauseTime);
   
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
    gl.uniform1f(this.shaderPair.uniforms.uWorldAngle.location, this.worldAngle);
    gl.uniform1i(this.shaderPair.uniforms.uLoop.location, (cfg.loop) ? 1 : 0);
};

Kiwi.Renderers.StatelessParticleRenderer.prototype.setTextureUniforms = function( gl, textureAtlas) {
    // Texture uniforms must be set late in the pipeline, so are separated to here.
    gl.uniform2fv(this.shaderPair.uniforms.uTextureSize.location, new Float32Array([textureAtlas.image.width,textureAtlas.image.height]));
}

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
}

Kiwi.Renderers.StatelessParticleRenderer.prototype.setWorldAngle = function(angle) {
    this.worldAngle = angle;
    this.gl.uniform1f(this.shaderPair.uniforms.uWorldAngle.location, this.worldAngle);
}

Kiwi.Renderers.StatelessParticleRenderer.prototype.draw = function (gl) {
    var modelViewMatrix = mat3.create();
    mat3.mul(modelViewMatrix,this.camMatrix,this.modelMatrix);
    gl.uniformMatrix3fv(this.shaderPair.uniforms.uCamMatrix.location, false, modelViewMatrix);

    // calculate time
    this.time = Date.now() - this.startTime;

    gl.uniform1f(this.shaderPair.uniforms.uT.location, this.time / 1000);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.buffer);

    gl.enableVertexAttribArray(this.shaderPair.attributes.aXYVxVy);
    gl.vertexAttribPointer(this.shaderPair.attributes.aXYVxVy, 4, gl.FLOAT, false, 48, 0);

    gl.enableVertexAttribArray(this.shaderPair.attributes.aBirthLifespanAngle);
    gl.vertexAttribPointer(this.shaderPair.attributes.aBirthLifespanAngle, 4, gl.FLOAT, false, 48, 16);

    gl.enableVertexAttribArray(this.shaderPair.attributes.aCellXYWH);
    gl.vertexAttribPointer(this.shaderPair.attributes.aCellXYWH, 4, gl.FLOAT, false, 48, 32);

    gl.drawArrays(gl.POINTS, 0,this._config.numParts);
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





