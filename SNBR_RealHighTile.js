/*:
 * @target MZ
 * @author snailbaron
 * @plugindesc Realistic high tiles
*/

(function() {
    Tilemap.prototype._addSpot = function(startX, startY, x, y) {
        const mx = startX + x;
        const my = startY + y;
        const dx = x * this.tileWidth;
        const dy = y * this.tileHeight;
        const tileId0 = this._readMapData(mx, my, 0);
        const tileId1 = this._readMapData(mx, my, 1);
        const tileId2 = this._readMapData(mx, my, 2);
        const tileId3 = this._readMapData(mx, my, 3);
        const shadowBits = this._readMapData(mx, my, 4);
        const upperTileId1 = this._readMapData(mx, my - 1, 1);
    
        this._addSpotTile(tileId0, dx, dy);
        this._addSpotTile(tileId1, dx, dy);
        this._addShadow(this._lowerLayer, shadowBits, dx, dy);
        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
            if (!Tilemap.isShadowingTile(tileId0)) {
                this._addTableEdge(this._lowerLayer, upperTileId1, dx, dy);
            }
        }
        if (this._isOverpassPosition(mx, my)) {
            this._addTile(this._upperLayer, tileId2, dx, dy);
            this._addTile(this._upperLayer, tileId3, dx, dy);
        } else {
            this._addSpotTile(tileId2, dx, dy, mx, my);
            this._addSpotTile(tileId3, dx, dy, mx, my);
        }
    };

    Tilemap.prototype._addSpotTile = function(tileId, dx, dy, mx, my) {
        if (this._isHigherTile(tileId) && $gamePlayer._y <= my) {
            this._addTile(this._upperLayer, tileId, dx, dy);
        } else {
            this._addTile(this._lowerLayer, tileId, dx, dy);
        }
    };
    


})();