define(function(require, exports, module) {
	var Engine  = require('famous/core/Engine');
    var AppView = require('views/AppView');

	var mainContext = Engine.createContext();

    var size = mainContext.getSize();

    var width = window.innerWidth;
    var height = window.innerHeight;


    var appView = new AppView({
        size: [width, height]
    });

    mainContext.add(appView);
});




