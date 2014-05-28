/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var GameView = require('views/GameView');

    function AppView() {
        View.apply(this, arguments);

        this.add(new Surface({
            properties: {
                backgroundColor: 'gray'
            }
        }));

        _createGameView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        size: [250, 250]
    };

    function _createGameView() {


        this.gameView = new GameView({
            size: this.options.size
        });
        this.gameModifier = new StateModifier();

        this.add(this.gameModifier).add(this.gameView);
    }

    module.exports = AppView;
});
