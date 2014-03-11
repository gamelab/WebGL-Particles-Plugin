/**
* Description about the main namespace that the plugin is in.
*
* @module Kiwi
* @submodule Plugins
* @namespace Kiwi.Plugins
* @class MyPlugin
*/
Kiwi.Plugins.MyPlugin = {
  
  /**
  * The name of this plugin.
  * @property name
  * @type String
  * @default 'MyPlugin'
  * @public
  */
  name:'MyPlugin',

  /**
  * The version of this plugin.
  * @property version
  * @type String
  * @default '1.0.0'
  * @public
  */
  version:'1.0.0'

};

/**
* Regsisters this plugin with the Global Kiwi Plugins Manager if it is avaiable.
* 
*/
Kiwi.PluginManager.register(Kiwi.Plugins.MyPlugin);

/**
* This create method is executed when Kiwi Game that has been told to use this plugin reaches the boot stage of the game loop.
* @method create
* @param game{Kiwi.Game} The game that is current in the boot stage.
* @private 
*/
Kiwi.Plugins.MyPlugin.create = function(game) {
  	
	console.log( 'Hello ' + game.name );

}
 

 
