define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});


    function TileView() {
        View.apply(this, arguments);

        this.swipePos = 0;

        _createTile.call(this);
        _setListeners.call(this);
        if(this.options.handleSwipe)
            _handleSwipe.call(this);
    }

    TileView.prototype = Object.create(View.prototype);
    TileView.prototype.constructor = TileView;
    TileView.prototype.isBlank = function () {
        if(this.options.tileValue)
            return true;
        else
            return false;
    };

    TileView.DEFAULT_OPTIONS = {
        size: [100, 100],
        gameX: 0,
        gameY: 0,
        handleSwipe: false,
        posThreshold: 20,
        velThreshold: 0.75,
        tileValue: undefined,
        backgroundProperties: {
            backgroundColor: 'blue',
            border: '2px solid darkblue',
            borderRadius: '10px',
            boxShadow: '5px 5px 5px #888888',
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
        transform: Transform.translate(5, 5, 0)
    };

    function _createTile() {

        this.tileModifier = new StateModifier({
            size: [this.options.size[0] -10, this.options.size[1] - 10]
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

        this.tileModifier.setTransform(this.options.transform);
    }

    function _setListeners() {
        this.backgroundSurface.on('click', function() {
            this._eventOutput.emit('click');
        }.bind(this));
    }

    function _handleSwipe() {
        var sync = new GenericSync(
            ['mouse', 'touch'],
            {direction : GenericSync.DIRECTION_X}
        );

        this.backgroundSurface.pipe(sync);

        sync.on('update', function(data) {
            this.swipePos += data.delta;
            this.tileModifier.setTransform(
                Transform.translate(this.options.size[0] + (this.options.size[0]*this.options.gameX) + 5 + this.swipePos, this.options.size[1] + (this.options.size[1]*this.options.gameY) + 5, 0));
        }.bind(this));

        sync.on('end', function(data) {
            var velocity = data.velocity;

            if(this.swipePos > this.options.posThreshold) {
                if(velocity < -this.options.velThreshold) {
                    this._eventOutput.emit('slideLeft');
                } else {
                    this._eventOutput.emit('slideRight');
                }
            } else {
                if(velocity > this.options.velThreshold) {
                    this._eventOutput.emit('slideRight');
                } else {
                    this._eventOutput.emit('slideLeft');
                }
            }
        }.bind(this));
    }

    TileView.prototype.update = function(callback) {
        if(this.isBlank()) {
            this.contentSurface.setContent(this.options.tileValue);
        } else {
            //this.contentSurface.setContent( ' [' + this.options.gameX + ',' + this.options.gameY + ']');
        }



        this.tileModifier.setTransform(
            Transform.translate(this.options.size[0] + (this.options.size[0]*this.options.gameX) + 5, this.options.size[1] + (this.options.size[1]*this.options.gameY) + 5, 0), this.options.transition, callback);
    };


    module.exports = TileView;
});
