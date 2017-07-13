//World and game mini state machine


function GameController() {

    this.bg = defaultState.img;

    this.handleInput = function () {
        state_.handleInput(); //Delegate the input to the state object! Yay!
    }
    this.update = function () {
        state_.update();
    }

    this.changeState = function (state) {
        if (state != null) {
            console.log("Changed");
            delete state_; //not sure if it actually deletes...
            state_ = state;
            state_.enter();
        }
    }


    this.getBackground = function () {
        return this.bg;
    }
    this.setBackground = function (img) {
        this.bg = img;
    }

    var state_ = null; //default state, changes during runtime
    this.changeState(defaultState);
}

function BattleState() {

    this.img = battlePic;
    this.update = function ()
    {
        this.handleInput();
        clearScreen(); //All this is drawn on the small canvas...
        player.draw();
        bat.draw();
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        drawOnScaled(); //This adds the text that can't be drawn on the mini canvas
        endCheck(); //Check if battle is over
    }
    this.handleInput = function () { //Holy *** that's ugly (censored for a family-friendly Gamkedo Club). IMPORTANT keypresses are looked at in battle, while keydown/up are in overworld (diff. is the first checks only character keys)
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

        if (pressedKey === true) {
            pressedKey = false;
            player.currentSpell.checkLetters();

        }
    };
    this.enter = function () {
        console.log("Entered battle");
        document.removeEventListener("keydown", keyDown);
        document.addEventListener("keypress", keyPressed); //keypress == only character keys!
    }
}
function OverworldState() {

    this.img = overworldPic;
    this.update = function () {
        this.handleInput();
        clearScreen(); //All this is drawn on the small canvas...
        player.move();
        player.draw();
        //bat.draw();
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        //drawOnScaled(); //This adds the text that can't be drawn on the mini canvas
        //endCheck(); //Check if battle is over
    }
    this.handleInput = function () {
        if (holdLeft) {
            player.speedX = -MOVE_SPEED;
        }
        else if (holdRight) {
            player.speedX = MOVE_SPEED;
        }
        else { player.speedX = 0; }
        if (holdUp) {
            player.speedY = -MOVE_SPEED;
        }
        else if (holdDown) {
            player.speedY = MOVE_SPEED;
        }
        else { player.speedY = 0; }
    };

    this.enter = function () {
        console.log("Entered overworld");
        document.removeEventListener("keypress", keyPressed);
        document.addEventListener("keydown", keyDown); //keypress == only character keys!
    }
}

var battleState = new BattleState();
var overworldState = new OverworldState();
//var defaultState = battleState;
var defaultState = overworldState;
var gameController = new GameController();
