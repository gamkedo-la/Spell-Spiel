//World and Game State machine

var inBattle = false; //To remove

var defaultState = new BattleState();


function GameController() {

    this.handleInput = function () {
        state_.handleInput(); //Delegate the input to the state object! Yay!
    }
    this.update = function () {
        state_.update();
    }

    this.changeState = function (state) {
        if (state != null) {
            delete state_; //not sure if it actually deletes...
            state_ = state;
            state_.enter();
        }
    }

    this.setGraphics = function (img) {
        player.img = img;
    }

    var state_ = defaultState; //default state, changes during runtime
}

function BattleState() {

    this.img = bgPic;
    this.update = function ()
    {
        clearScreen();
        player.draw();
        bat.draw();
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled
        drawOnScaled();
        endCheck();
    }
    this.handleInput = function () { //Holy shit that's ugly
        if (keyPressed.data[keyPressed.data.length - 1] == "1".charCodeAt(0)) {
            player.changeSpell(player.availableSpells[0]);
            resetKeypress();
        }
        if (keyPressed.data[keyPressed.data.length - 1] == "2".charCodeAt(0)) {
            player.changeSpell(player.availableSpells[1]);
            resetKeypress();
        }
        if (keyPressed.data[keyPressed.data.length - 1] == "3".charCodeAt(0)) {
            player.changeSpell(player.availableSpells[2]);
            resetKeypress();
        }

        if (player.currentSpell.name == "No spell") { //Do nothing if no spell selected
            return;
        }

        if (pressedKey === true) { //If no key pressed, we draw the same spell as last frame
            pressedKey = false;
            player.currentSpell.checkLetters();

        }
    };
    this.enter = function () {
        console.log("Started standing");
        gameController.setGraphics(standingPic);
        inBattle = true;
    }
}
function OverworldState() {

    this.img = overworldPic;
    this.update = function () {
        return;
    }
    this.handleInput = function () { return };
    this.enter = function () {
        console.log("Started standing");
        gameController.setGraphics(standingPic);
        inBattle = true;
    }
}

var gameController = new GameController();