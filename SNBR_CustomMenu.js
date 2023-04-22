/*:
 * @target MZ
 * @author snailbaron
 * @plugindesc Custom main menu

 * @param ChaptersMenuItem
 * @text Menu Item: Chapters
 * @desc Name of the "Chapters" item in main menu
 * @default Chapters
 * @type string
 
 * @param Back
 * @text Chapter select: back
 * @desc Name of chapter menu item: back
 * @default Back
 * @type string
 
 * @param Chapters
 * @text Chapters
 * @desc List of chapters for chapter select menu
 * @default []
 * @type struct<Chapter>[]
*/

/*~struct~Chapter:
 *
 * @param Name
 * @text Item name
 * @type string
 *
 * @param MapId
 * @text Map ID
 * @type number
 * 
 * @param X
 * @text X Position
 * @type number
 * @default 0
 * 
 * @param Y
 * @text Y Position
 * @type number
 * @default 0
*/

(function() {
    "use strict";

    var parameters = PluginManager.parameters("SNBR_CustomMenu");
    var chapters = eval(parameters["Chapters"]).map(function(j) {
        return JsonEx.parse(j);
    });

    function Scene_Chapters() {
        this.initialize(...arguments);
    }

    Scene_Chapters.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Chapters.prototype.constructor = Scene_Chapters;

    Scene_Chapters.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    }

    Scene_Chapters.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._optionsWindow = new Window_Chapters(this.optionsWindowRect());

        for (let i = 0; i < chapters.length; i += 1) {
            const c = chapters[i];
            this._optionsWindow.setHandler(
                "chapter" + i,
                this.startChapter.bind(this, Number(c.MapId), Number(c.X), Number(c.Y)));
        }

        this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._optionsWindow);
    };

    Scene_Chapters.prototype.optionsWindowRect = function() {
        const wh = this.calcWindowHeight(3, true);
        const ww = 400;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Chapters.prototype.startChapter = function(mapId, x, y) {
        DataManager.createGameObjects();
        DataManager.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.reserveTransfer(mapId, x, y, 2, 0);
        Graphics.frameCount = 0;

        this._optionsWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    };

    function Window_Chapters() {
        this.initialize(...arguments);
    }

    Window_Chapters.prototype = Object.create(Window_Command.prototype);
    Window_Chapters.prototype.constructor = Window_Chapters;

    Window_Chapters.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    }

    Window_Chapters.prototype.makeCommandList = function() {
        for (let i = 0; i < chapters.length; i += 1) {
            this.addCommand(chapters[i].Name, "chapter" + i);
        }
    }

    Scene_Title.prototype.commandChapters = function() {
        this._commandWindow.close();
        SceneManager.push(Scene_Chapters);
    };

    Scene_Title.prototype.createCommandWindow = function() {
        const background = $dataSystem.titleCommandWindow.background;
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_TitleCommand(rect);
        this._commandWindow.setBackgroundType(background);
        this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
        this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
        this._commandWindow.setHandler("chapters", this.commandChapters.bind(this));
        this._commandWindow.setHandler("options", this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_Title.prototype.commandWindowRect = function() {
        const offsetX = $dataSystem.titleCommandWindow.offsetX;
        const offsetY = $dataSystem.titleCommandWindow.offsetY;
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(4, true);
        const wx = (Graphics.boxWidth - ww) / 2 + offsetX;
        const wy = Graphics.boxHeight - wh - 96 + offsetY;
        return new Rectangle(wx, wy, ww, wh);
    };

    Window_TitleCommand.prototype.makeCommandList = function() {
        const continueEnabled = this.isContinueEnabled();
        this.addCommand(TextManager.newGame, "newGame");
        this.addCommand(TextManager.continue_, "continue", continueEnabled);
        this.addCommand(parameters["ChaptersMenuItem"], "chapters");
        this.addCommand(TextManager.options, "options");
    };
})();