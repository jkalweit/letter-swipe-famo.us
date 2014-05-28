define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var FastClick       = require('famous/inputs/FastClick');

    var TileView         = require('views/TileView');

    function GameView() {
        View.apply(this, arguments);

        this.add(new Surface({
            properties: {
                backgroundColor: 'gray'
            }
        }));

        _createGameTiles.call(this);
        _createControlTiles.call(this);

        _getNextTile.call(this);
    }

    GameView.prototype = Object.create(View.prototype);
    GameView.prototype.constructor = GameView;

    GameView.DEFAULT_OPTIONS = {

    };


    function _createGameTiles() {

        this.gameTiles = [];
        var tile;
        for(var j = 0; j < 4; j++) {
            for(var i = 0; i < 4; i++) {
                tile = new TileView({
                    gameX: i,
                    gameY: j
                });
                this.gameTiles[i + (j*4)] = tile;
                tile.update();
                this.add(tile);
            }
        }
    }

    function _createControlTiles() {

        _createSwipeRightTile.call(this, 0);
        _createSwipeRightTile.call(this, 1);
        _createSwipeRightTile.call(this, 2);
        _createSwipeRightTile.call(this, 3);

        _createSwipeLeftTile.call(this, 0);
        _createSwipeLeftTile.call(this, 1);
        _createSwipeLeftTile.call(this, 2);
        _createSwipeLeftTile.call(this, 3);

        _createSwipeDownTile.call(this, 0);
        _createSwipeDownTile.call(this, 1);
        _createSwipeDownTile.call(this, 2);
        _createSwipeDownTile.call(this, 3);

    }

    function _createSwipeRightTile(row) {
        var tile = new TileView({
            content: '->',
            backgroundProperties: {
                backgroundColor: 'black',
                border: '2px solid black'
            }
        });
        tile.tileModifier.setTransform(Transform.translate(0, 100 + (row*100), 0.1), tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            for(var i = (row*4)+3; i >= row*4; i--) {
                this.gameTiles[i].options.gameX++;
                this.gameTiles[i].update();
                if(i != (row*4) +3)
                    this.gameTiles[i+1] = this.gameTiles[i];
            }

            this.nextTile.options.gameX = 0;
            this.nextTile.options.gameY = row;
            this.gameTiles[row*4] = this.nextTile;
            this.nextTile.update();

            _getNextTile.call(this);

            console.log('right clicked!');
        }.bind(this));
    }

    function _createSwipeLeftTile(row) {
        var tile = new TileView({
            content: '<-',
            backgroundProperties: {
                backgroundColor: 'black',
                border: '2px solid black'
            }
        });
        tile.tileModifier.setTransform(Transform.translate(500, 100 + (row*100), 0.1), tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            for(var i = (row*4); i <= (row*4)+3; i++) {
                this.gameTiles[i].options.gameX--;
                this.gameTiles[i].update();
                this.gameTiles[i] = this.gameTiles[i+1];
            }

            this.nextTile.options.gameX = 3;
            this.nextTile.options.gameY = row;
            this.gameTiles[(row*4)+3] = this.nextTile;
            this.nextTile.update();

            _getNextTile.call(this);

            console.log('left clicked!');
        }.bind(this));
    }

    function _createSwipeDownTile(col) {
        var tile = new TileView({
            content: '',
            backgroundProperties: {
                backgroundColor: 'black',
                border: '2px solid black'
            }
        });
        tile.tileModifier.setTransform(Transform.translate(100 + (col*100), 0, 0.1), tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            for(var i = 3; i >= 0; i--) {
                var index = col + (i*4);
                this.gameTiles[index].options.gameY++;
                this.gameTiles[index].update();
                console.log('updated ' + index + ': ' + this.gameTiles[index].options.gameX + ',' + this.gameTiles[index].options.gameY);
            }
            for(var i = 3; i >= 1; i--) {
                var index = col + (i*4);
                this.gameTiles[index] = this.gameTiles[index - 4];
            }

            this.nextTile.options.gameX = col;
            this.nextTile.options.gameY = 0;
            this.gameTiles[col + (col*4)] = this.nextTile;
            this.nextTile.update();

            _getNextTile.call(this);

            console.log('left clicked!');
        }.bind(this));
    }


    function _getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function _getRandomLetter() {
        var letter = ['D', 'U', 'K', 'E'][_getRandomInt.call(this, 0, 3)];
        return letter;
    }

    function _getNextTile() {
        var nextValue = _getRandomLetter.call(this);
        this.nextTile = new TileView({
            gameValue: nextValue,
            gameX: -1,
            gameY: -1
        });
        this.nextTile.update();
        this.add(this.nextTile);
    }

        module.exports = GameView;
});
