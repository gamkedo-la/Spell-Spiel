//World and game mini state machine

function GameController() {

    this.handleInput = function () {
        state_.handleInput(); //Delegate the input to the state object! Yay!
    };
    this.update = function () {
        state_.update();
    };

    this.changeState = function (state) {
        if (state != null) {
            console.log("Changed state");
            delete state_; //not sure if it actually deletes...
            state_ = state;
            state_.enter();
        }
    };


    this.getBackground = function () {
        return state_.img; //Eventually we can expand this so states can have a variety of bg images
    };

    var state_ = null; //default state, changes during runtime
    this.changeState(defaultState); //Initialize at default
}

function BattleState() {

    this.img = battlePic;
    this.update = function ()
    { date = new Date();
        lastTime = currentTime;
        currentTime = date.getTime();
        deltaTime = currentTime - lastTime;
        player.currentSpell.timeElapsed += deltaTime;

        rechargeAllExceptCurrent();

        this.handleInput();
        clearScreen(); //Everything under this is drawn on the small canvas...
        player.draw();
        player.drawBattle();
        player.opponent.draw();
        player.opponent.drawBattle();

        drawParticles();
        //draw_particles();

        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        this.drawOnScaled(); //This adds the text that can't be drawn on the mini canvas
        endCheck(); //Check if battle is over
    };

    this.currentSpell = "";
    this.lastLen = 0;
    // TODO
    this.handleInput = function () { //Holy *** that's ugly (censored for a family-friendly Gamkedo Club). IMPORTANT keypresses are looked at in battle, while keydown/up are in overworld (diff. is the first checks only character keys)
        if(keyPressed.data.length === 0) {
            this.lastLen = 0;
            return;
        }
        if(keyPressed.data.length === this.lastLen) return;
        this.lastLen++;

        // Checks if the pressed key is alphanumeric. If it is, we query the trie
        var key = String.fromCharCode(keyPressed.data[keyPressed.data.length-1]);
        if(key.match(/[a-z]/i)) {
            var completion = spellTrie.autoComplete(this.currentSpell+key);
            if(completion.length) {
                this.currentSpell += key;
                player.changeSpell(player.availableSpells[completion]);
                resetKeypress();
            } else {
                // Play a sound

            }
        } else {
            // Play a sound
        }

        if (player.currentSpell.name == "No spell") { //Do nothing if no spell selected
            return;
        }

        player.casting = true;
    };
    this.drawOnScaled = function () {
        player.drawScaled(); //UI text for each character
        player.opponent.drawScaled();
        drawSpell(player.currentSpell);
        //Display messages (ie the ones that are timed and kept in a queue)
        for (i = 0; i < msgOnDisplay.length; i++) {
            var toDraw = msgOnDisplay[i];
            if (toDraw instanceof Message) {
                toDraw.fontOn();
                toDraw.framesLeft -= 1;
                if (toDraw.framesLeft <= 0) {
                    msgOnDisplay.splice(i, 1); //If over, remove
                }
            }
            toDraw.draw();
            //console.log("Frames left: ", toDraw.framesLeft);
            toDraw.fontOff();
        }
    };
    this.enter = function () {
        console.log("Entered battle");
        document.removeEventListener("keydown", keyDown);
        document.addEventListener("keypress", keyPressed); //keypress == only character keys!

        player.x = 40;
        player.y = 125;
        //player.opponent.useAttack();
    };
}

function OverworldState() {

    this.img = overworldPic;
    this.update = function () {
        this.handleInput();
        clearScreen(); //All this is drawn on the small canvas...
        player.move();
        player.draw();

        draw_particles();

        checkDoor(); //For demo only. Will need to implement actual collision detection later!
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        this.drawOnScaled(); //This adds the text that can't be drawn on the mini canvas
    };
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

    this.drawOnScaled = function () {
        return;
    };

    this.enter = function () {
        if (endingBattle === true) { endingBattle = false; }
        if (typeof player !== "undefined") { player.opponent.reset(); }
        console.log("Entered overworld");
        document.removeEventListener("keypress", keyPressed);
        document.addEventListener("keydown", keyDown); //keypress == only character keys!
    };
}

var battleState = new BattleState();
var overworldState = new OverworldState();
//var defaultState = battleState;
var defaultState = overworldState;
var gameController = new GameController();
var endingBattle = false;

function endCheck() {
    if (player.hp == 0 || player.opponent.hp == 0) {
        endBattle();
    }
}

function endBattle() {
    if (player.hp != 0 && player.opponent.hp != 0) { //safety check
        return;
    }
    gameController.changeState(battleEndState);

}

function BattleEndState() {
    this.img = battleState.img;

    this.handleInput = function () {
        return;
    };

    this.drawOnScaled = function () {
        if (this.win == true) {
            console.log("Display text");
            scaledContext.textAlign = "center";
            colorText("You win!", scaledCanvas.width / 2, 200, "black");
            scaledContext.textAlign = "left";
        }
        else if (this.win == false) {
            scaledContext.textAlign = "center";
            colorText("You lose...", scaledCanvas.width / 2, 200, "black");
            scaledContext.textAlign = "left";
        }
    };

    this.update = function () {
        this.handleInput();
        clearScreen(); //Everything under this is drawn on the small canvas...
        player.draw();
        player.drawBattle();
        player.opponent.draw();
        player.opponent.drawBattle();
        draw_particles();
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        this.drawOnScaled(); //This adds the text that can't be drawn on the mini canvas
    };
    this.enter = function () {
        setTimeout(gameController.changeState, 3000, overworldState);
        console.log("Timeout set!");
        if (player.hp == 0) { this.win = false;}
        else if (player.opponent.hp == 0) { this.win = true; }
    };
}
battleEndState = new BattleEndState();

function checkDoor() { //Demo only
    if (player.x < 190 && player.x+5 > 165 &&
        player.y < 52  && player.y+5 > 12) {
        gameController.changeState(battleState);
    }
}
