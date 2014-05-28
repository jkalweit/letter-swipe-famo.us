define(function(require, exports, module) {
	var Engine  = require('famous/core/Engine');
    var AppView = require('views/AppView');

	var mainContext = Engine.createContext();

    var size = mainContext.getSize();
    var gameSize = size[0];
    if(size[1] < size[0])
        gameSize = size[1];

    if(gameSize < 350) gameSize = 300;

    var appView = new AppView({
        size: [gameSize, gameSize]
    });

    mainContext.add(appView);
});




