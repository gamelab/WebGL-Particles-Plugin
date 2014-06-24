WebGL Particles
=======================================

Name: ParticlesGL

Version: 1.1.0

Type: GameObject Plugin

Author: Kiwi.js Team

Website: www.kiwijs.org

KiwiJS last version tested: 1.0.1

Tutorials for this plugin can be found on the Kiwi.JS website here:

[Using the ParticlesGL Plugin](http://www.kiwijs.org/using-the-particle-effects-plugin)


##Version Release Notes
1.0.3
  - removeOnComplete method functions properly.
  - Compatibility fixes for Kiwi.js v1.0.1
  - Dependency updated to Kiwi.js v1.0.1

1.0.2
  - Updated link to website tutorials.

##Description:
The ParticlesGL plugin lets you create particle effects game objects in your Kiwi.js games.
If you have any problems then feel free to contact us via the http://www.kiwijs.org/help


##Dependencies
- Kiwi.js version 1.0.1 or greater

##How to Include: 

First Step:
- Copy either the particlesgl.js or the particlesgl.min.js file into your project directory. We recommend that you save the files under a plugin directory that lives inside of your project directory so that you can easily manage all of the plugins but that is not required.

Second Step:
- Link in the JavaScript file particlesgl.js or the min version of the file) into your HTML file. Make sure you link it in underneath the link to the main Kiwi.js file AND underneath the Cocoon files if you are using Cocoon.

##How to use

Check out the example found in the "examples" folder of this repository.
Read tha API docs found in the "docs" folder of this repository.
[Look at the tutorials on the Kiwijs.org website.](Something)

You'll need to include an image, spritesheet or texture atlas that contains the particle sprites eg

	MyState.preload = function() {
       this.addImage('particle', 'assets/particle_01.png');
  	};


To create a particle gameobject, do the following. 

  	var particles = new Kiwi.GameObjects.StatelessParticles(this,this.textures.particle,400,300,config);

The last parameter in the above code contains the config object for the effect. If you leave it out a default config will be used.
The config object has many properties which are described below along with some terminology.

To start the particle effect
	particles.startEmitting();

### Generation

Determines how the particles spawn. These values are fixed until the next time particles are generated.

### Emission
Sets generation properties of the entire emitter

* "numParts" (positive integer) : Particle Count: The number of particles that will be generated
* "posOffsetX" (number) : Offset X: The global offset distance along the x axis from the center of the emitter (and from the game object) in pixels
* "posOffsetY" (number) : Offset Y: The global offset distance along the y axis from the center of the emitter (and from the game object) in pixels

### Position
Determines the spawn position of each particle

* "posShape"  (string): Determines the distribution shape of generated positions. Values are "point", "line", "rectangle" and "radial"

 * posShape = point : generate all particles on the point determined by posOffsetX,posOffsetY
 * posShape = "line" :
   * "posLength"  (number) : The length in pixels of the line along which particles will be generated
   * "posAngle"  (number ): The angle in degress of the line along which particles will be generated
   * "posRandomLine" (boolean) : Toggle random or regular distribution along the line
 * posShape = "rectangle" :
   * "posWidth"  (number) : The width in pixels of the rectangle within which particles will be generated
   * "posHeight"  (number) : The height in pixels of the rectangle within which particles will be generated
   * "posConstrainRect"  (boolean) : Toggle whether to generate particles within the rectangle, or on its edge
 *  posShape = "radial" :
   * "posRadius"  (number) : The radius in pixels of the circle within which particles will be generated
   * "posRadialStart" (number) : The starting angle in radians of the radial distribution	
   * "posRadialEnd"  (number) : The ending angle in radians of the radial distribution
   * "posConstrainRadial"  (boolean) : Toggle whether to generate particles within the radial field, or on its edge
   * "posRandomRadial" (boolean) : Toggle random or regular distribution along the edge of the radial distribution

### Velocity
Determines the velocity vector (a pair of numbers representeing direction and speed) of each particle at spawn time.
 * "velOffsetX" (number) : The x offset of the generated velocity
 * "velOffsetY" (number) : The y offset of the generated velocity
 * "velAngMin" (number) : The minimum angular velocity of each particle. A random angular velocity between "velAngMin" and "velAngMax" will be generated
 * "velAngMax" (number) : The maximum angular velocity of each particle. A random angular velocity between "velAngMin" and "velAngMax" will be generated
 * "velShape" (string) : Determines the shape of the distribution of the generated velocities Values are "center","point","line","rectangle" and "radial"
   * velShape = "center" : The direction will be calculated from the center of the position distribution
    * "minVel" (number) : The minimum speed of each particle. A random speed between "minVel" and "maxVel" will be generated
    * "maxVel" (number) : The maximum speed of each particle. A random speed between "minVel" and "maxVel" will be generated
  * velShape = "point" : The velocity is determined by calculating a random vector bounded by "velOffsetX" and "velOffsetY"
  * velShape = "line" : 
  * "velLength" (number): The length in pixels of the line along which velocity vectors will be generated
   * "velAngle" (number): The angle in degress of the line along which velocity vectors will be generated
   * "velRandomLine" (boolean): Toggle random or regular distribution along the line
   * velShape = "rectangle" :
     * "velWidth" (number) : The width in pixels of the rectangle within which velocity vectors will be generated
     * "velHeight" (number) : The height in pixels of the rectangle within which velocity vectors will be generated
     * "velConstrainRect" (boolean): Toggle whether to generate velocity vectors within the rectangle, or on its edge
   *  velShape = "radial" :
     * "velRadius" (number) : The radius in pixels of the circle within which velocity vectors will be generated
     * "velRadialStart" (number) : The starting angle in radians of the radial distribution    
     * "velRadialEnd" (number) : The ending angle in radians of the radial distribution
     * "velConstrainRadial" (boolean) : Toggle whether to generate velocity vectors within the radial field, or on its edge
     * "velRandomRadial" (boolean : Toggle random or regular distribution along the edge of the radial distribution

### Lifespan
Determines the spawn time and lifespan of particles
  * "minStartTime" (number) : The minimum start time of each particle. A random start time between "minStartTime" and "maxStartTime" will be generated
  * "maxStartTime" (number)  : The maximum start time of each particle. A random start time between "minStartTime" and "maxStartTime" will be generated
  * "minLifespan" (number)  : The minimum lifespan of each particle. A random start time between "minLifespan" and "maxLifespan" will be generated
  * "maxLifespan" (number)  : The maximum lifespan of each particle. A random start time between "minLifespan" and "maxLifespan" will be generated

### Textures
Determines which image/spritesheet/textureatlas will be used as bitmap textures. If a textureAtlas or a spritesheet is used then individual cells can be selected. You can also use a canvas and draw in real time.

###Runtime
Runtime properties are set up to one time per frame for the entire emitter
 * "startSize"  (number) : The particle start size in pixels 
 * "endSize"  (number) : The particle end size in pixels
 * "gravityX"  (number) : The amount of gravitional force applied to all particles vertically
 * "gravityY"  (number) : The amount of gravitional force applied to all particles horizontally
  
 * "alpha"  (number) : The global alpha of all particles
 * "colEnv0..3"  (array of 3 numbers 0 < n < 1) : The color applied at each color stop in the color envelope
 * "colEnvKeyframes" (array of 2 numbers 0 < n < 1): determines the second and third color stop. The first and fourth are locked to 0 and 1 respectively
 * "alphaGradient" (array of 4 numbers 0 < n < 1): the alpha value at each color stop in the color envelope
 * "alphaStops" ((array of 2 numbers 0 < n < 1): determines the second and third alpha stop. The first and fourth are locked to 0 and 1 respectively
 * "additive" (boolean) : Use additive blending for compositing particles when true.
 * "startAngle" (number) : The anglulat offset of the particle - to which rotation calculated from angular velocity will be added to.

