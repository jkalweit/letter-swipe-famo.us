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
            this.gameTiles.push([]);
            for(var i = 0; i < 4; i++) {
                tile = new TileView({
                    gameX: i,
                    gameY: j
                });
                this.gameTiles[j].push(tile);
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

        _createSwipeUpTile.call(this, 0);
        _createSwipeUpTile.call(this, 1);
        _createSwipeUpTile.call(this, 2);
        _createSwipeUpTile.call(this, 3);
    }

    function _createSwipeRightTile(row) {
        var tile = new TileView({
            content: '',
            backgroundProperties: {
                backgroundColor: 'black',
                border: '2px solid white'
            }
        });
        tile.tileModifier.setTransform(Transform.translate(0, 100 + (row*100), 0.1), tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            this.nextTile.options.gameX = 0;
            this.nextTile.options.gameY = row;
            var toRemove = this.gameTiles[row].pop();
            toRemove.options.gameX++;
            toRemove.update();
            this.gameTiles[row].unshift(this.nextTile);

            for(var i = 0; i < 4; i++) {
                this.gameTiles[row][i].options.gameX = i;
                this.gameTiles[row][i].update();
            }

            _getNextTile.call(this);

            console.log('right clicked!');
        }.bind(this));
    }

    function _createSwipeLeftTile(row) {
        var tile = new TileView({
            content: '',
            backgroundProperties: {
                backgroundColor: 'black',
                border: '2px solid white'
            }
        });
        tile.tileModifier.setTransform(Transform.translate(500, 100 + (row*100), 0.1), tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            this.nextTile.options.gameX = 3;
            this.nextTile.options.gameY = row;
            var toRemove = this.gameTiles[row].shift();
            toRemove.options.gameX--;
            toRemove.update();
            this.gameTiles[row].push(this.nextTile);

            for(var i = 0; i < 4; i++) {
                this.gameTiles[row][i].options.gameX = i;
                this.gameTiles[row][i].update();
            }

            _getNextTile.call(this);

            console.log('right clicked!');
        }.bind(this));
    }

    function _createSwipeDownTile(col) {
        var tile = new TileView({
            content: '',
            backgroundProperties: {
                backgroundColor: 'black',
                border: '2px solid white'
            }
        });
        tile.tileModifier.setTransform(Transform.translate(100 + (col*100), 0, 0.1), tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            this.nextTile.options.gameX = col;
            this.nextTile.options.gameY = 0;
            this.nextTile.update();

            var toMove = this.gameTiles[0].splice(col, 1, this.nextTile)[0];
            toMove.options.gameY++;
            toMove.update();

            for(var i = 1; i < 4; i++) {
                toMove = this.gameTiles[i].splice(col, 1, toMove)[0];
                toMove.options.gameY++;
                toMove.update();
            }

            _getNextTile.call(this);

            console.log('down clicked!');
        }.bind(this));
    }

    function _createSwipeUpTile(col) {
        var tile = new TileView({
            content: '',
            backgroundProperties: {
                backgroundColor: 'black',
                border: '2px solid white'
            }
        });
        tile.tileModifier.setTransform(Transform.translate(100 + (col*100), 500, 0.1), tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            this.nextTile.options.gameX = col;
            this.nextTile.options.gameY = 3;
            this.nextTile.update();

            var toMove = this.gameTiles[3].splice(col, 1, this.nextTile)[0];
            toMove.options.gameY--;
            toMove.update();

            for(var i = 2; i >= 0; i--) {
                toMove = this.gameTiles[i].splice(col, 1, toMove)[0];
                toMove.options.gameY--;
                toMove.update();
            }

            _getNextTile.call(this);

            console.log('up clicked!');
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
