Kiwi.Renderers.StatelessParticleRenderer = function (gl,shaderManager,params){
    Kiwi.Renderers.Renderer.call(this,gl,shaderManager,false,params);
    
    this._maxItems = 2000;
    
    this.gl = gl;
    
    this._config = params.config;
    
    if (!this._config) {
        console.log("no particle configuration supplied");
    }
   
    this.vertexBuffer = new Kiwi.Renderers.GLArrayBuffer(gl, 11);

    //this.shaderPair = this.shaderManager.requestShader(gl, "StatelessParticleShader");
    this.startTime = Date.now();

};
Kiwi.extend(Kiwi.Renderers.StatelessParticleRenderer,Kiwi.Renderers.Renderer);

Kiwi.Renderers.StatelessParticleRenderer.prototype.RENDERER_ID = "StatelessParticleRenderer";

Kiwi.Renderers.StatelessParticleRenderer.prototype.enable = function (gl, params) {
       
    this.shaderPair = this.shaderManager.requestShader(gl, "StatelessParticleShader");
    var cfg = this._config;

    //Texture
    gl.uniform1i(this.shaderPair.uniforms.uSampler.location, 0);

    //Standard uniforms
    gl.uniform2fv(this.shaderPair.uniforms.uResolution.location, params.stageResolution);
    gl.uniform2fv(this.shaderPair.uniforms.uTextureSize.location, new Float32Array([params.textureAtlas.width,params.textureAtlas.height]));
   
    gl.uniformMatrix3fv(this.shaderPair.uniforms.uCamMatrix.location, false, params.camMatrix);
   
    this.camMatrix = new Float32Array(params.camMatrix.buffer);

    //Particle uniforms
    gl.uniform1f(this.shaderPair.uniforms.uT.location, 0);
    gl.uniform1f(this.shaderPair.uniforms.uGravity.location, cfg.gravity);
    gl.uniform2fv(this.shaderPair.uniforms.uPointSizeRange.location, new Float32Array([cfg.startSize, cfg.endSize]));
    gl.uniform3fv(this.shaderPair.uniforms.uColEnv0.location, new Float32Array(cfg.colEnv0));
    gl.uniform3fv(this.shaderPair.uniforms.uColEnv1.location, new Float32Array(cfg.colEnv1));
    gl.uniform3fv(this.shaderPair.uniforms.uColEnv2.location, new Float32Array(cfg.colEnv2));
    gl.uniform3fv(this.shaderPair.uniforms.uColEnv3.location, new Float32Array(cfg.colEnv3));
    gl.uniform2fv(this.shaderPair.uniforms.uColEnvKeyframes.location, new Float32Array(cfg.colEnvKeyframes));
    gl.uniform1f(this.shaderPair.uniforms.uAlpha.location, cfg.alpha);
    gl.uniform4fv(this.shaderPair.uniforms.uAlphaGradient.location, new Float32Array(cfg.alphaGradient));
    gl.uniform2fv(this.shaderPair.uniforms.uAlphaStops.location, new Float32Array(cfg.alphaStops));
    
    gl.uniform1f(this.shaderPair.uniforms.uLoop.location, (cfg.loop) ? 1 : 0);
};

Kiwi.Renderers.StatelessParticleRenderer.prototype.disable = function (gl) {
    gl.disableVertexAttribArray(this.shaderPair.attributes.aXYVxVy);
    gl.disableVertexAttribArray(this.shaderPair.attributes.aBirthLifespanAngle);
    gl.disableVertexAttribArray(this.shaderPair.attributes.aCellXYWH);
};

Kiwi.Renderers.StatelessParticleRenderer.prototype.clear = function (gl, params) {
    this.vertexBuffer.clear();
    
};


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
    var t = Date.now() - this.startTime;

    gl.uniform1f(this.shaderPair.uniforms.uT.location, t / 1000);


    gl.blendEquationSeparate(gl.FUNC_ADD,gl.FUNC_ADD)
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





