define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var GridLayout = require("famous/views/GridLayout");

    var TileView = require("views/TileView");

    function RowView() {
        View.apply(this, arguments);

        _createGrid.call(this);
    }

    RowView.prototype = Object.create(View.prototype);
    RowView.prototype.constructor = RowView;

    RowView.DEFAULT_OPTIONS = {
        size: [600, 100]
    };

    function _createGrid() {
        this.grid = new GridLayout({
           dimensions: [6, 1]
        });

        this.tiles = [];
        this.grid.sequenceFrom(this.tiles);

        this.rightArrow = new TileView({
            content: '->',
            backgroundProperties: {
                backgroundColor: 'black'
            },
            transform: Transform.translate(0, 0, 0.1) //allow tiles to slide under
        });

        this.rightArrow.on('click', function() {
            this._eventOutput.emit('moveRight');
            for(var i = 1; i <=4; i ++) {
                this.tiles[i].slideRight();
            }

            console.log('right clicked!');
        }.bind(this));

        this.tiles.push(this.rightArrow);

        for(var i = 0; i < 4; i++) {
            this.tiles.push(new TileView({ content: 'D' + i }));
        }

        this.leftArrow = new TileView({
            content: '<-',
            backgroundProperties: {
                backgroundColor: 'black'
            },
            transform: Transform.translate(0, 0, 0.1) //allow tiles to slide under
        });

        this.leftArrow.on('click', function() {
            this._eventOutput.emit('moveLeft');
            for(var i = 1; i <=4; i ++) {
                this.tiles[i].slideLeft((function(index) {
                    console.log('finished: ' + index)
                    this.tiles[index].center();
                    //this.tiles[index - 1] = this.tiles[index];
                }).bind(this)(i));
            }
            for(var i = 2; i <=4; i ++) {
                this.tiles[i - 1] = this.tiles[i];
            }
           // for(var i = 1; i <=4; i ++) {
            //    this.tiles[i].center();
            //}
            this.tiles[4] = new TileView();
            //this.grid.sequenceFrom(this.tiles);
            console.log('left clicked!');
        }.bind(this));

        this.tiles.push(this.leftArrow);

        this.gridModifier = new StateModifier({
           size: this.options.size
        });

        this.add(this.gridModifier).add(this.grid);
    }

    module.exports = RowView;
});
