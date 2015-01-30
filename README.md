WebGL Particles
===============

	Name: ParticlesGL
	Version: 1.2.0
	Type: GameObject Plugin
	Author: Kiwi.js Team
	Website: www.kiwijs.org
	KiwiJS last version tested: 1.2.1

Tutorials for this plugin can be found on the Kiwi.JS website here: [Using the ParticlesGL Plugin](http://www.kiwijs.org/using-the-particle-effects-plugin)


## Version Release Notes

### 1.2.0
* Upgrade to KiwiJS v1.2.0
* Add `setColor` and `getColor` methods, allowing you to use Kiwi.Utils.Color style color values.
* Add `clock` property to drive particle animation based on in-game rather than game-independent time
* Config parser is stricter with numbers expressed as strings. It can find and correct most of these errors. This is not an issue in many browsers, but it has caused problems in CocoonJS.

### 1.1.2
* Fixed anchor point set to non-zero values, causing particles to appear offset from the emitter.
* Fixed particles not updating when certain config options were changed and there were no other objects in the scene.

### 1.1.1
* Updated examples to KiwiJS 1.1.1.
* Added instructions to `examples/keyboard.html`.
* Fixed WebGL errors when particle object is created.
* Fixed default config.alpha being a string instead of a number. Most browsers caught this, but it caused particles to have 0 alpha in CocoonJS on iOS, and really the other browsers should have been more strict.
* Fixed particles not scaling in CocoonJS.

### 1.1.0
* Added angStartMin, angStartMax, and angVelocityConform config fields, allowing the particle to spawn with extant rotation.
* Complied rotation to parent, state, and camera rotation for flawless particle-to-world continuity.
* Much more forgiving config; specify only those parameters you wish to differ from default. Other parameters will be filled in automatically.
* Default config tweaked to a more pleasing effect.
* Deprecated config parameter `startAngle` because it didn't do anything and we have better alternatives.
* Fully integrated particle renderer with new rendering pipeline in core Kiwi.js library version 1.1.0.

### 1.0.3
* removeOnComplete method functions properly.
* Compatibility fixes for Kiwi.js v1.0.1
* Dependency updated to Kiwi.js v1.0.1

### 1.0.2
* Updated link to website tutorials.

## Description

The ParticlesGL plugin lets you create particle effects game objects in your Kiwi.js games. If you have any problems then feel free to contact us via the http://www.kiwijs.org/help

## Dependencies

- Kiwi.js version 1.1.0 or greater (new in plugin version 1.1.0)

## How to Include

First Step:
- Copy either the `particlesgl-x.x.x.js` or the `particlesgl-x.x.x.min.js` file into your project directory. We recommend that you save the files under a plugin directory that lives inside of your project directory so that you can easily manage all of the plugins, but that is not required.

Second Step:
- Link in the JavaScript file (particlesgl-x.x.x.js or the min version) into your HTML file. Make sure you link it in underneath the link to the main Kiwi.js file AND underneath the CocoonJS files if you are using CocoonJS, as requires them to be loaded first.

```html
<script src="js/lib/kiwi.js"></script>
<script src="js/plugins/particlesgl-x.x.x.js"></script>
```

## How to use

Check out the example found in the `examples/` folder of this repository.

Read the API docs found in the `docs/` folder of this repository.

[Look at the tutorials on the Kiwijs.org website.](http://www.kiwijs.org/using-the-particle-effects-plugin)

You'll need to include an image, spritesheet or texture atlas that contains the particle sprites, for example:

```javascript
MyState.preload = function() {
	this.addImage('particle', 'assets/particle_01.png');
};
```

To create a particle gameobject, do the following:

```javascript
var particles = new Kiwi.GameObjects.StatelessParticles(
	this, this.textures.particle, 400, 300, config );

// Begin emitting - if you don't do this,
// the particles will exist but have nothing to display
particles.startEmitting();

// Don't forget to add it to the state
this.addChild( particles );
```

The `config` parameter in the above code contains the config object for the effect. If you leave it out a default config will be used. The config object has many properties which are described below along with some terminology.

### Using Transforms

Particles can move and rotate freely. However, their scaling behaviour is limited. Scaling a particle object will scale the path along which the particles move, causing them to appear to move slower or faster. However, it will not change the size or orientation of the particles. For example, if you have a particle effect which shoots a rocket to the right, you can scale the game object by -1 to shoot to the left. However, the rocket will still face right, and appear to be facing backwards. If you want to change the direction of a particle effect, either use rotation or create a duplicate particle effect pointing in the other direction.

Particles emit from the anchor point. If you move the anchor point of a particle object, the particles will follow. The anchor point is set to ( 0, 0 ) by default and should not need to change; you can use either `transform.x, y` or `config.offsetX, offsetY` to change the position of the particles.

### Textures

Determines which image/spritesheet/textureatlas will be used as bitmap textures. If a textureAtlas or a spritesheet is used then individual cells can be selected via config. You can also use a canvas and draw in real time.

## Config Parameters

Determines how the particles spawn. These values are fixed until the next time particles are generated.

### Emission

Sets generation properties of the entire emitter

* `numParts` (positive integer) : Particle Count: Number of particles that will be generated
* `posOffsetX` (number) : Offset X: Global offset distance along the x axis from the center of the emitter (and from the game object) in pixels
* `posOffsetY` (number) : Offset Y: Global offset distance along the y axis from the center of the emitter (and from the game object) in pixels

### Position

Determines the spawn position of each particle

* `posShape` (string): Determines the distribution shape of generated positions. Values are `point`, `line`, `rectangle` and `radial`.

* posShape = point : Generate all particles on the point determined by posOffsetX,posOffsetY
	* posShape = `line` :
		* `posLength` (number) : Length in pixels of the line along which particles will be generated
		* `posAngle` (number ): Angle in degress of the line along which particles will be generated
		* `posRandomLine` (boolean) : Toggle random or regular distribution along the line
	* posShape = `rectangle` :
		* `posWidth` (number) : Width in pixels of the rectangle within which particles will be generated
		* `posHeight` (number) : Height in pixels of the rectangle within which particles will be generated
		* `posConstrainRect` (boolean) : Toggle whether to generate particles within the rectangle, or only on its edge
	* posShape = `radial` :
		* `posRadius` (number) : Radius in pixels of the circle within which particles will be generated
		* `posRadialStart` (number) : Starting angle in radians of the radial distribution
		* `posRadialEnd` (number) : Ending angle in radians of the radial distribution
		* `posConstrainRadial` (boolean) : Toggle whether to generate particles within the radial field, or only on its edge
		* `posRandomRadial` (boolean) : Toggle random or regular distribution along the edge of the radial distribution

### Velocity

Determines the velocity vector (a pair of numbers representeing direction and speed) of each particle at spawn time.

* `velOffsetX` (number) : X offset of the generated velocity
* `velOffsetY` (number) : Y offset of the generated velocity
* `velAngMin` (number) : Minimum angular velocity of each particle. A random angular velocity between `velAngMin` and `velAngMax` will be generated
* `velAngMax` (number) : Maximum angular velocity of each particle. A random angular velocity between `velAngMin` and `velAngMax` will be generated
* `velShape` (string) : Determines the shape of the distribution of the generated velocities. Values are `center`, `point`, `line`, `rectangle` and `radial`.
	* velShape = `center` : Direction will be calculated from the center of the position distribution
		* `minVel` (number) : Minimum speed of each particle. A random speed between `minVel` and `maxVel` will be generated
		* `maxVel` (number) : Maximum speed of each particle. A random speed between `minVel` and `maxVel` will be generated
	* velShape = `point` : Velocity is determined by calculating a random vector bounded by `velOffsetX` and `velOffsetY`
	* velShape = `line` :
		* `velLength` (number): Length in pixels of the line along which velocity vectors will be generated
		* `velAngle` (number): Angle in degress of the line along which velocity vectors will be generated
		* `velRandomLine` (boolean): Toggle random or regular distribution along the line
	* velShape = `rectangle` :
		* `velWidth` (number) : Width in pixels of the rectangle within which velocity vectors will be generated
		* `velHeight` (number) : Height in pixels of the rectangle within which velocity vectors will be generated
		* `velConstrainRect` (boolean): Toggle whether to generate velocity vectors within the rectangle, or only on its edge
	 * velShape = `radial` :
		* `velRadius` (number) : Radius in pixels of the circle within which velocity vectors will be generated
		* `velRadialStart` (number) : Starting angle in radians of the radial distribution
		* `velRadialEnd` (number) : Ending angle in radians of the radial distribution
		* `velConstrainRadial` (boolean) : Toggle whether to generate velocity vectors within the radial field, or only on its edge
		* `velRandomRadial` (boolean : Toggle random or regular distribution along the edge of the radial distribution

### Angle Start

Determines initial angle.

* `angStartMin` (number) : Minimum start angle of each particle. A random start angle between `angStartMin` and `angStartMax` will be generated
* `angStartMax` (number) : Maximum start angle of each particle. A random start angle between `angStartMin` and `angStartMax` will be generated
* `angVelocityConform` (boolean) : Toggle velocity conformity. If false, particles default to standard orientation. If true, particles are emitted facing their birth velocity. Standard orientation assumes rotation 0, in which the "front" of a particle is pointing to the right.

### Lifespan

Determines the spawn time and lifespan of particles

* `minStartTime` (number) : Minimum start time of each particle. A random start time between `minStartTime` and `maxStartTime` will be generated
* `maxStartTime` (number) : Maximum start time of each particle. A random start time between `minStartTime` and `maxStartTime` will be generated
* `minLifespan` (number) : Minimum lifespan of each particle. A random lifespan between `minLifespan` and `maxLifespan` will be generated
* `maxLifespan` (number) : Maximum lifespan of each particle. A random lifespan between `minLifespan` and `maxLifespan` will be generated
* `loop` (boolean) : Whether to repeat the particles after maxStartTime has elapsed

### Runtime

Runtime properties are set up to one time per frame for the entire emitter.

* `startSize` (number) : Particle start size in pixels
* `endSize` (number) : Particle end size in pixels
* `gravityX` (number) : Amount of gravitional force applied to all particles vertically
* `gravityY` (number) : Amount of gravitional force applied to all particles horizontally
* `alpha` (number) : Global opacity of all particles (0 is transparent, 1 is fully opaque)
* `colEnv0..3` (array of 3 numbers 0 < n < 1) : Color applied at each color stop in the color envelope. The array is [ red, green, blue ]; for example, [ 1, 1, 0 ] is yellow.
* `colEnvKeyframes` (array of 2 numbers 0 < n < 1): Determines the second and third color stop. The first and fourth are locked to 0 and 1 respectively. A "stop" is when, in a lifespan measured from 0 to 1, a value is at full strength.
* `alphaGradient` (array of 4 numbers 0 < n < 1): Alpha value at each alpha stop in the color envelope
* `alphaStops` ((array of 2 numbers 0 < n < 1): determines the second and third alpha stop. The first and fourth are locked to 0 and 1 respectively. A "stop" is when, in a lifespan measured from 0 to 1, a value is at full strength.
* `additive` (boolean) : Use additive blending for compositing particles when true

### Texture

Texture properties let you control what textures to use.

* `cells` (array of numbers) : Texture Atlas cells from which to select sprites upon creation

## Thanks for using the WebGL Particles Plugin!
