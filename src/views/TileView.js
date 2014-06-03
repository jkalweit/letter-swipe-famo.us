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

        this.syncsCompleted = [false, false];
        this.syncsPositions = [0, 0];
        this.x = 0;
        this.y = 0;

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
        var syncX = new GenericSync(
            ['mouse', 'touch'],
            {direction : GenericSync.DIRECTION_X}
        );

        this.backgroundSurface.pipe(syncX);

        syncX.on('start', (function(data) {
            this.syncsCompleted[0] = false;
        }).bind(this));

        syncX.on('update', function(data) {
            this.syncsPositions[0] = data.position;
        }.bind(this));

        syncX.on('end', function(data) {
            var velocity = data.velocity;

            this.syncsCompleted[0] = true;

            if(Math.abs(this.syncsPositions[0]) < Math.abs(this.syncsPositions[1]))
                return;

            if(data.position > this.options.posThreshold || velocity > this.options.velThreshold) {
                this._eventOutput.emit('slideRight');
            }else if(data.position < -this.options.posThreshold || velocity < -this.options.velThreshold) {
                this._eventOutput.emit('slideLeft');
            } else {
                //if(this.syncsCompleted[0] && this.syncsCompleted[1]) {
                    //this.update();
                    this.syncsCompleted = [false, false];
                //}
            }

        }.bind(this));



        var syncY = new GenericSync(
            ['mouse', 'touch'],
            {direction : GenericSync.DIRECTION_Y}
        );

        this.backgroundSurface.pipe(syncY);

        syncY.on('start', (function(data) {
            this.syncsCompleted[1] = false;
        }).bind(this));

        syncY.on('update', function(data) {
            this.syncsPositions[1] = data.position;
            if(Math.abs(this.syncsPositions[0]) > Math.abs(this.syncsPositions[1])) {
                this.tileModifier.setTransform(
                    Transform.translate(this.x + this.syncsPositions[0] + 5, this.y + 5, 0));
            } else {
                this.tileModifier.setTransform(
                    Transform.translate(this.x + 5, this.y + this.syncsPositions[1] + 5, 0));
            }
        }.bind(this));

        syncY.on('end', function(data) {
            var velocity = data.velocity;

            this.syncsCompleted[1] = true;

            if(Math.abs(this.syncsPositions[0]) > Math.abs(this.syncsPositions[1]))
                return;

            if(data.position > this.options.posThreshold || velocity > this.options.velThreshold) {
                this._eventOutput.emit('slideDown');
            }else if(data.position < -this.options.posThreshold || velocity < -this.options.velThreshold) {
                this._eventOutput.emit('slideUp');
            } else {
                if(this.syncsCompleted[0] && this.syncsCompleted[1]) {
                    //this.update();
                    this.syncsCompleted = [false, false];
                }
            }

        }.bind(this));
    }

    TileView.prototype.move = function(x, y, callback) {
        this.contentSurface.setContent(this.options.tileValue);

        this.x = x;
        this.y = y;

        this.tileModifier.setTransform(
            Transform.translate(x + 5, y + 5), this.options.transition, callback);
    };

    TileView.prototype.moveToGamePos = function(callback) {

        this.move(this.options.gameX * this.options.size[0], this.options.gameY * this.options.size[1], callback);

    }

    module.exports = TileView;
});
