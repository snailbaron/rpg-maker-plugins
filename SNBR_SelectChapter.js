// SNBR_SelectChapter

/*:
 * @plugindesc Go directly to a game chapter from the main menu
 * @author snailbaron
 *
 * @param name
 * @text Menu Item Name
 * @type text
 *
 * @param chapters
 * @text Chapters
 * @type struct<Chapter>[]
 */

/*~struct~Chapter:
 * @param name
 * @text Name
 * @type text
 *
 * @param event
 * @text Common Event
 * @type common_event
 */

(function() {
    const selectChapterSymbol = 'SNBR_SelectChapter_root_symbol';
    function chapterSymbol(index) {
        return 'SNBR_SelectChapter_chapter_' + index + '_symbol';
    };

    var parameters = PluginManager.parameters('SNBR_SelectChapter');

    var chapters = [];
    {
        for (var chapterJson of JSON.parse(parameters.chapters)) {
            chapter = JSON.parse(chapterJson);
            chapters.push({
                name: chapter.name,
                event: chapter.event ? JSON.parse(chapter.event) : null,
            });
        }
    }


    function Window_Chapters() {
        this.initialize.apply(this, arguments);
    };

    Window_Chapters.prototype = Object.create(Window_Command.prototype);
    Window_Chapters.prototype.constructor = Window_Chapters;

    Window_Chapters.prototype.initialize = function() {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = (Graphics.boxHeight - this.height) / 2;
    };

    Window_Chapters.prototype.windowWidth = function() {
        return 400;
    };

    Window_Chapters.prototype.windowHeight = function() {
        return this.fittingHeight(chapters.length);
    };

    Window_Chapters.prototype.makeCommandList = function() {
        for (var i = 0; i < chapters.length; i++) {
            this.addCommand(chapters[i].name, chapterSymbol(i));
        }
    };


    function Scene_Chapters() {
        this.initialize.apply(this, arguments);
    };

    Scene_Chapters.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Chapters.prototype.constructor = Scene_Chapters;

    Scene_Chapters.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_Chapters.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._chaptersWindow = new Window_Chapters();
        this._chaptersWindow.setHandler('cancel', this.popScene.bind(this));
        for (var i = 0; i < chapters.length; i++) {
            let event = chapters[i].event;
            console.log(event);
            if (event) {
                this._chaptersWindow.setHandler(chapterSymbol(i), () => {
                    DataManager.setupNewGame();
                    this._chaptersWindow.close();
                    this.fadeOutAll();
                    SceneManager.goto(Scene_Map);

                    $gameTemp.reserveCommonEvent(event);
                });
            }
        }

        this.addWindow(this._chaptersWindow);
    }


    var Window_TitleCommand_makeCommandList =
        Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        Window_TitleCommand_makeCommandList.call(this);
        this.addCommand(parameters.name, selectChapterSymbol);
    };


    var Scene_Title_createCommandWindow =
        Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler(selectChapterSymbol, () => {
            this._commandWindow.close();
            SceneManager.push(Scene_Chapters);
        });
    };
})();