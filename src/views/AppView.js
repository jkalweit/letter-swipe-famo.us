/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var GameView = require('views/GameView');

    function AppView() {
        View.apply(this, arguments);

        this.menuToggle = false;

        _createGameView.call(this);

        _setListeners.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        openPosition: 276,
        transition: {
            duration: 300,
            curve: 'easeOut'
        }
    };

    function _createGameView() {
        this.gameView = new GameView();
        this.gameModifier = new StateModifier();

        this.add(this.gameModifier).add(this.gameView);
    }

    function _setListeners() {
        this.gameView.on('menuToggle', this.toggleMenu.bind(this));
    }

    AppView.prototype.toggleMenu = function() {
        if(this.menuToggle) {
            this.slideLeft();
        } else {
            this.slideRight();
        }
        this.menuToggle = !this.menuToggle;
    };

    AppView.prototype.slideLeft = function() {
        this.gameModifier.setTransform(Transform.translate(0, 0, 0), this.options.transition);
    };

    AppView.prototype.slideRight = function() {
        this.gameModifier.setTransform(Transform.translate(this.options.openPosition, 0, 0), this.options.transition);
    };

    module.exports = AppView;
});
