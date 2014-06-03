/**
 * Created by jkalweit on 6/2/2014.
 */
define(function(require, exports, module) {

    function TileGame() {

        this.matches = 0;
        this.isGameOver = false;

        this.tileValues = ['D', 'U', 'K', 'E'];

    }


    module.exports = TileGame;
});
