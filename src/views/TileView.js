define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var TransitionableTransform = require("famous/transitions/TransitionableTransform");

    function TileView() {
        View.apply(this, arguments);


        _createTile.call(this);
        _setListeners.call(this);
    }

    TileView.prototype = Object.create(View.prototype);
    TileView.prototype.constructor = TileView;

    TileView.DEFAULT_OPTIONS = {
        size: [100, 100],
        gameX: 0,
        gameY: 0,
        tileValue: 'X',
        backgroundProperties: {
            backgroundColor: 'blue',
            border: '2px solid black',
            zIndex: 0
        },
        contentProperties: {
            color: 'white',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 1
        },
        transition: {
            duration: 300,
            curve: 'easeOut'
        },
        transform: Transform.translate(0, 0, 0)
    };

    function _createTile() {

        this.tileModifier = new StateModifier({
            size: this.options.size,
            transform: this.options.transform
        });

        this.backgroundSurface = new Surface({
            properties: this.options.backgroundProperties
        });

        this.contentModifier = new StateModifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5]
        });

        this.contentSurface = new Surface({
            size: [20, 20],
            content : this.options.content,
            properties: this.options.contentProperties
        });


        var node = this.add(this.tileModifier);
        node.add(this.backgroundSurface);
        node.add(this.contentModifier).add(this.contentSurface);
    }

    function _setListeners() {
        this.backgroundSurface.on('click', function() {
            this._eventOutput.emit('click');
        }.bind(this));
    }

    TileView.prototype.update = function(callback) {
        if(this.options.gameValue)
            this.contentSurface.setContent(this.options.gameValue);
        else
            this.contentSurface.setContent('[' + this.options.gameX + ',' + this.options.gameY + ']');


        this.tileModifier.setTransform(
            Transform.translate(100 + (100*this.options.gameX), 100 + (100*this.options.gameY), 0), this.options.transition, callback);
    };


    module.exports = TileView;
});
