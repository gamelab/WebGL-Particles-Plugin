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
