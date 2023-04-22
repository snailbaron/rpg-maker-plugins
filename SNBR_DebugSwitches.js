/*:
 * @target MZ
 * @author snailbaron
 * @plugindesc Set switches for debugging

 * @param Switches
 * @text Switches
 * @desc Switches to set for debugging
 * @default []
 * @type string[]

 * @param Items
 * @text Items
 * @desc Items to add to party for debugging
 * @default []
 * @type string[]

 * @param Gold
 * @text Gold
 * @desc Amount of party's gold
 * @default 0
 * @type number

 * @help
 * Set certain switches before starting the game. Works only when you select
*/

(function() {
    "use strict";

    var parameters = PluginManager.parameters("SNBR_DebugSwitches");

    var switchNames = JsonEx.parse(parameters["Switches"] || "[]");
    var itemNames = JsonEx.parse(parameters["Items"] || "[]");
    var giveGold = Number(parameters["Gold"] || "0");

    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);

        for (var switchName of switchNames) {
            var switchIndex = $dataSystem.switches.indexOf(switchName);
            if (switchIndex == -1) {
                throw new Error(`SNBR_DebugSwitches: no switch named "${switchName}"`);
            }
            $gameSwitches.setValue(switchIndex, true);
        }

        for (var itemName of itemNames) {
            var item = $dataItems.find(x => x?.name == itemName);
            if (!item) {
                throw new Error(`SNBR_DebugSwitches: no item named "${itemName}"`);
            }
            $gameParty.gainItem(item, 1, false);
        }

        $gameParty.gainGold(giveGold);
    }
})();