define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var Timer    = require('famous/utilities/Timer');
    var FastClick       = require('famous/inputs/FastClick');

    var TileView         = require('views/TileView');

    function GameView() {
        View.apply(this, arguments);

        this.add(new Surface({
            properties: {
                backgroundColor: 'white'
            }
        }));

        this.tileSize = [this.options.size[0]/6, this.options.size[1]/6];

        this.matches = 0;
        this.isGameOver = false;

        _createBackground.call(this);
        _createGameTiles.call(this);
        _createControlTiles.call(this);

        _getNextTile.call(this);
    }

    GameView.prototype = Object.create(View.prototype);
    GameView.prototype.constructor = GameView;

    GameView.DEFAULT_OPTIONS = {
        size: [400, 400],
        tileValues: ['D', 'U', 'K', 'E']
    };

    function _createBackground() {

        var size = [
            this.tileSize[0]*4,
            this.tileSize[1]*4
        ];

        this.backgroundSurface = new Surface({
            size: size,
            properties: {
                backgroundColor: 'white',
                borderRadius: '10px'
            }
        });

        this.backgroundModifier = new StateModifier({
            transform: Transform.translate(this.tileSize[0], this.tileSize[1], 0)
        });

        this.add(this.backgroundModifier).add(this.backgroundSurface);
    }

    function _createGameTiles() {

        this.gameTiles = [];
        var tile;
        for(var i = 0; i < 4; i++) {
            this.gameTiles.push([]);
            tile = new TileView({
                size: this.tileSize,
                gameX: i,
                gameY: i,
                tileValue: this.options.tileValues[i]
            });
            this.gameTiles[i][i] = tile;
            tile.update();
            this.add(tile);
        }

//        for(var j = 0; j < 4; j++) {
//            this.gameTiles.push([]);
//            for(var i = 0; i < 4; i++) {
//                if(i === j)
//                    tileValue = this.options.tileValues[i];
//                else
//                    tileValue = undefined;
//                tile = new TileView({
//                    size: this.tileSize,
//                    gameX: i,
//                    gameY: j,
//                    tileValue: tileValue
//                });
//                this.gameTiles[j].push(tile);
//                tile.update();
//                this.add(tile);
//            }
//        }

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
            size: this.tileSize,
            content: '',
            backgroundProperties: {
                backgroundColor: 'lightgreen',
                border: '2px solid darkgreen'
            }
        });
        tile.tileModifier.setTransform(
            Transform.translate(0 + 5, this.tileSize[1] + (row*this.tileSize[1]) + 5, 0.1),
            tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            if(!_canPlayRow.call(this, row))
                return;

            for(var x = 2; x >= 0; x--)
            {
                if(!_isBlank.call(this, row, x) && _isBlank.call(this, row, x+1)){
                    this.gameTiles[row][x].options.gameX++;
                    this.gameTiles[row][x].update();
                    this.gameTiles[row][x+1] = this.gameTiles[row][x];
                    this.gameTiles[row][x] = null;
                }
            }

            this.nextTile.options.gameX = 0;
            this.nextTile.options.gameY = row;
            this.nextTile.update();
            this.gameTiles[row][0] = this.nextTile;

            _checkScore.call(this);

            _getNextTile.call(this);
        }.bind(this));
    }

    function _isBlank(y, x) {
        return !this.gameTiles[y][x];
    }

    function _createSwipeLeftTile(row) {
        var tile = new TileView({
            size: this.tileSize,
            content: '',
            backgroundProperties: {
                backgroundColor: 'lightgreen',
                border: '2px solid darkgreen'
            }
        });
        tile.tileModifier.setTransform(Transform.translate(5*this.tileSize[0] + 5, this.tileSize[1] + (row*this.tileSize[1]) + 5, 0.1), tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            if(!_canPlayRow.call(this, row))
                return;

            for(var x = 1; x < 4; x++)
            {
                if(!_isBlank.call(this, row, x) && _isBlank.call(this, row, x-1)){
                    this.gameTiles[row][x].options.gameX--;
                    this.gameTiles[row][x].update();
                    this.gameTiles[row][x-1] = this.gameTiles[row][x];
                    this.gameTiles[row][x] = null;
                }
            }

            this.nextTile.options.gameX = 3;
            this.nextTile.options.gameY = row;
            this.nextTile.update();
            this.gameTiles[row][3] = this.nextTile;

            _checkScore.call(this);

            _getNextTile.call(this);
        }.bind(this));
    }

    function _createSwipeDownTile(col) {
        var tile = new TileView({
            size: this.tileSize,
            content: '',
            backgroundProperties: {
                backgroundColor: 'lightgreen',
                border: '2px solid darkgreen'
            }
        });

        tile.tileModifier.setTransform(Transform.translate(this.tileSize[0] + (col*this.tileSize[0]) + 5, 0 + 5, 0.1), tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            if(!_canPlayColumn.call(this, col))
                return;

            for(var y = 2; y >=0; y--)
            {
                if(!_isBlank.call(this, y, col) && _isBlank.call(this, y+1, col)){
                    this.gameTiles[y][col].options.gameY++;
                    this.gameTiles[y][col].update();
                    this.gameTiles[y+1][col] = this.gameTiles[y][col];
                    this.gameTiles[y][col] = null;
                }
            }

            this.nextTile.options.gameX = col;
            this.nextTile.options.gameY = 0;
            this.nextTile.update();
            this.gameTiles[0][col] = this.nextTile;

            _checkScore.call(this);

            _getNextTile.call(this);
        }.bind(this));
    }

    function _createSwipeUpTile(col) {
        var tile = new TileView({
            size: this.tileSize,
            content: '',
            backgroundProperties: {
                backgroundColor: 'lightgreen',
                border: '2px solid darkgreen'
            }
        });
        tile.tileModifier.setTransform(Transform.translate(this.tileSize[0] + (col*this.tileSize[0]) + 5, 5*this.tileSize[1] + 5, 0.1), tile.options.transition);
        this.add(tile);

        tile.on('click', function() {

            if(!_canPlayColumn.call(this, col))
                return;

            for(var y = 1; y < 4; y++)
            {
                if(!_isBlank.call(this, y, col) && _isBlank.call(this, y-1, col)){
                    this.gameTiles[y][col].options.gameY--;
                    this.gameTiles[y][col].update();
                    this.gameTiles[y-1][col] = this.gameTiles[y][col];
                    this.gameTiles[y][col] = null;
                }
            }

            this.nextTile.options.gameX = col;
            this.nextTile.options.gameY = 3;
            this.nextTile.update();
            this.gameTiles[3][col] = this.nextTile;

            _checkScore.call(this);

            _getNextTile.call(this);

        }.bind(this));
    }




    function _checkScore() {
        var grid = this.gameTiles;
        var matchedRows = [];
        var matchedColumns = [];

        for(var x = 0; x < 4; x++) {
            if(grid[0][x] && grid[0][x].options.tileValue === this.options.tileValues[0] &&
               grid[1][x] && grid[1][x].options.tileValue === this.options.tileValues[1] &&
               grid[2][x] && grid[2][x].options.tileValue === this.options.tileValues[2] &&
               grid[3][x] && grid[3][x].options.tileValue === this.options.tileValues[3])
            {
                this.matches++;
                matchedColumns.push(x);
            }
        }

        for(var y = 0; y < 4; y++) {
            if(grid[y][0] && grid[y][0].options.tileValue === this.options.tileValues[0] &&
                grid[y][1] && grid[y][1].options.tileValue === this.options.tileValues[1] &&
                grid[y][2] && grid[y][2].options.tileValue === this.options.tileValues[2] &&
                grid[y][3] && grid[y][3].options.tileValue === this.options.tileValues[3])
            {
                this.matches++;
                matchedRows.push(y);
            }
        }

        // Clear matched columns and rows.
        matchedColumns.forEach(function (x) {
            for(var y = 0; y < 4; y++) {
                if(grid[y][x]){
                    grid[y][x].options.gameX = -2;
                    grid[y][x].options.gameY = -2;

                    (function (tile) {
                        Timer.setTimeout(function() {
                            tile.update();
                        }, 300);
                    })(grid[y][x]);

                    grid[y][x] = null;
                }
            }
        });
        matchedRows.forEach(function (y) {
            for(var x = 0; x < 4; x++) {
                if(grid[y][x]){
                    grid[y][x].options.gameX = -2;
                    grid[y][x].options.gameY = -2;

                    (function (tile) {
                        Timer.setTimeout(function() {
                            tile.update();
                        }, 300);
                    })(grid[y][x]);

                    grid[y][x] = null;
                }
            }
        });


//        var isCleared = true;
//        // check for cleared board
//        for(var x = 0; x < $scope.size; x++) {
//            for(var y = 0; y < $scope.size; y++) {
//                if(grid[y][x] !== '')
//                    isCleared = false;
//            }
//        }
//
//
//        if(isCleared)
//            $scope.clears++;
//
//        if(matchedColumns.length + matchedRows.length > 1)
//            $scope.doubles++;
//
//        if($scope.isGameOver())
//            $scope.gameOver = true;
    };






    function _getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function _getRandomLetter() {
        var letter = this.options.tileValues[_getRandomInt.call(this, 0, 3)];
        return letter;
    }

    function _getNextTile() {
        var nextValue = _getRandomLetter.call(this);
        this.nextTile = new TileView({
            size: this.tileSize,
            tileValue: nextValue,
            gameX: 4,
            gameY: -1
        });
        this.nextTile.update();
        this.add(this.nextTile);
    }

    function _canPlayRow(y) {
        if(this.isGameOver)
            return false;

        for(var x = 0; x < 4; x++) {
            if(_isBlank.call(this, y, x))
                return true;
        }

        return false;
    };

    function _canPlayColumn(x) {
        if(this.isGameOver)
            return false;

        for(var y = 0; y < 4; y++) {
            if(_isBlank.call(this, y, x))
                return true;
        }

        return false;
    };

    module.exports = GameView;
});
