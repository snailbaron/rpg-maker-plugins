/*:
 * @target MZ
 * @author snailbaron
 * @plugindesc Skip title screen, and go directly to New Game
*/

(function() {
    Scene_Boot.prototype.startNormalGame = function() {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };
})();