define(function(require, exports, module) {
	var Engine  = require('famous/core/Engine');
    var AppView = require('views/AppView');
    var TileGame = require('TileGame');

	var mainContext = Engine.createContext();

    var size = mainContext.getSize();

    var width = window.innerWidth;
    var height = window.innerHeight;

    this.TileGame = new TileGame();

    var appView = new AppView({
        size: [width, height],
        game: this.TileGame
    });

    mainContext.add(appView);
});




