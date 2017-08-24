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
            if (state_ && Sound.isPlaying(state_.music)) { Sound.stop(state_.music); }
            console.log("Changed state");
            state_ = state;
            if (state_.music) { Sound.play(state_.music, true, 1); }
            state_.enter();
        }
    };
    /*
    this.startMusicLoop = function () {
        Sound.play(state_.music);
    }*/
    this.getBackground = function () {
        return state_.img; //Eventually we can expand this so states can have a variety of bg images
    };

    this.startBattle = function (chosenEnemy) {
        enemy = chosenEnemy;
        player.reset();
        enemy.reset();
        setOpponentsBoth(enemy);
        battleState.battleType = "Normal";
        gameController.changeState(battleState);
    };

    this.startGauntletBattle = function () {
        enemy = gauntletOrder[gauntletProgress];
        player.reset();
        enemy.reset();
        setOpponentsBoth(enemy);
        battleState.battleType = "Gauntlet";
        gameController.changeState(battleState);
    };
    this.startRandomBattle = function () {
        var random = Math.floor(Math.random() * allEnemies.length);
        enemy = allEnemies[random];
        random = Math.floor(Math.random() * allBackgrounds.length);
        battleState.img = allBackgrounds[random];
        battleEndState.img = allBackgrounds[random];
        player.reset();
        enemy.reset();
        setOpponentsBoth(enemy);
        battleState.battleType = "Random";
        gameController.changeState(battleState);
    };

    var state_; //default state, changes during runtime
    this.changeState(defaultState); //Initialize at default
}

function BattleState() {

    this.battleType = "Gauntlet";
    this.img = battlePic;
    //this.music = "gymLeader";

    this.update = function ()
    {
        spellTimeLapse();
        rechargeAllExceptCurrent();
        player.checkState();
        updateCycles();
        player.opponent.updateAttack();

        this.handleInput();

        clearScreen(); //Everything under this is drawn on the small canvas...
        drawBothBattle();
        drawParticles();

        updateScreenshake();
        updateParticles();
        updateDamage();

        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        this.drawOnScaled(); //This adds the text that can't be drawn on the mini canvas
        this.endCheck(); //Check if battle is over

        resetKeypress();
    };

    this.currentSpell = "";
    this.lastLen = 0;
    this.handleInput = function () {

        if (this.currentSpell === ""){
            player.isCasting = false;
            player.picToChange = true;
        }

        if(keyPressed.data.length === 0) {
            this.lastLen = 0;
            return;
        }

        if(keyPressed.data.length === this.lastLen) return;
        this.lastLen++;

        // Checks if the pressed key is in the alphabet. If it is, we query the trie
        // Non-letter input can be used for pausing, etc.
        var key = String.fromCharCode(keyPressed.data[keyPressed.data.length - 1]);
        if(key.match(/[a-z ]/i)) {
            var completion = spellTrie.autoComplete(this.currentSpell + key);
            if (completion.length) {
                completion = completion[0];
                this.currentSpell += key;
                var progress = player.currentSpell.progress;
                player.changeSpell(player.availableSpells[completion]);
                player.currentSpell.catchUp(progress);
                player.currentSpell.updateResults(true);
                resetKeypress();
            } else {
                // Play a sound, do not advance
                if(player.currentSpell.name != "No spell") {
                    player.currentSpell.updateResults(false);
                    console.log(player.currentSpell.numWrong);
                }
            }
        } else {
            // Pausing, other input?
        }

        if (player.currentSpell.name == "No spell") { //Do nothing if no spell selected
            return;
        }
        if (this.currentSpell != "") {
            player.isCasting = true;
            if (this.currentSpell.length == 1) {
                player.picToChange = true;
            }
        }

        };


    this.endCheck = function () {
        if (player.hp == 0 || player.opponent.hp == 0) {
            resetAllParticles();
            gameController.changeState(battleEndState);
        }
    };

    this.drawOnScaled = function () {
        player.drawScaled(); //UI text for each character
        player.opponent.drawScaled();
        drawSpell(player.currentSpell);
    };
    this.enter = function () {
        console.log("Entered battle");
        document.removeEventListener("keydown", keyDown);
        document.addEventListener("keypress", keyPressed); //keypress == only character keys!

        player.position.x = 40;
        player.position.y = 125;

    };
}

function NPC() {
    var currentImg = 0;
    this.imgNumber = 1;
    this.name = "NPC";
    this.text = "Text Goes Here";
    this.img = batPic;

    //Graphics
    this.setGraphics = function (img, imgNumber) {
        this.img = img;
        this.imgNumber = imgNumber; //# of images in spritesheet
    };

    this.draw = function () { //On canvas
        var spriteWidth = this.img.width / this.imgNumber;
        canvasContext.drawImage(this.img, currentImg*spriteWidth, 0, spriteWidth,
            this.img.height, this.position.x - (this.img.width / this.imgNumber) / 2,
            this.position.y - this.img.height, spriteWidth, this.img.height);
        scaledContext.font = "normal 20pt Bookman";
        resetFont();
    };

    this.cycleTick = function () {
        cycleCurrent++;
        if (cycleCurrent >= this.cycleDuration) {
            cycleCurrent = 0;
            currentImg++;
        }
        if (currentImg >= this.imgNumber) {
            currentImg = 0;
        }
    };

    this.displayText = function(collider) {
        var collidedOrNot = this.checkCollision(collider);
        if (collidedOrNot && holdLeft) { // Spacebar eventually decoupled from startRandomBattle function? Or different button?
            console.log(this.text);
        }
    };

}

function Collider(position,width,height) {
    this.position = position;
    this.width = width;
    this.height = height;
}

var test = new NPC();
    test.name = "Bat";
    test.position = {
        x : 30,
        y : 100,
    };
    test.img = batPic;
    test.imgNumber = 1;
    test.text = "Testing";

function OverworldState() {

    this.img = overworldPic;
    this.music = 'SpellSpiel_Music_Open';

    this.update = function () {
        this.handleInput();
        clearScreen(); //All this is drawn on the small canvas...
        updateCycles();
        player.move();
        player.draw();
        test.draw();

        if(!player.hasOwnProperty("collider") && player.img.width && player.img.height) {
            player.collider = new Collider(player.position,player.img.width,player.img.height);
        }
        if(!test.hasOwnProperty("collider") && test.img.width && test.img.height) {
            test.collider = new Collider(test.position, test.img.width, test.img.height);
        }

        player.checkCollision(test);

        draw_particles();
        checkDoor(); //For demo only. Will need to implement actual collision detection later!
        drawMessagesIfAlive(); //split cus it has to be drawn on small canvas while words are on big one...
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        updateMessages(); //see above
        this.drawOnScaled(); //This adds the text that can't be drawn on the mini canvas
    };
    var walkingCyleDuration = 5;
    this.handleInput = function () {
        if (holdLeft) {
            player.speedX = -MOVE_SPEED;
            if (player.movingDirection != "left") {
                player.movingDirection = "left";
                player.setGraphics(walkingLeftPic, 4, walkingCyleDuration);
            }
        }
        else if (holdRight) {
            player.speedX = MOVE_SPEED;
            if (player.movingDirection != "right") {
                player.movingDirection = "right";
                player.setGraphics(walkingRightPic, 4, walkingCyleDuration);
            }
        }
        else {
            player.speedX = 0;
        }

        if (holdUp) {
            player.speedY = -MOVE_SPEED;
            if (player.movingDirection != "up") {
                player.movingDirection = "up";
                player.setGraphics(walkingUpPic, 4, walkingCyleDuration);
            }
        }
        else if (holdDown) {
            player.speedY = MOVE_SPEED;
            if (player.movingDirection != "down") {
                player.movingDirection = "down";
                player.setGraphics(walkingDownPic, 4, walkingCyleDuration);
            }
        }
        else {
            player.speedY = 0;
        }

        if (player.speedX === 0 && player.speedY === 0) {
            player.resetTick();
        }
        
        if (holdSpacebar) {
            gameController.startRandomBattle();
        }
        if (hold1) {
            console.log("Pressed 1");
            pokebox.beginText("This will be the NPC/game text used by my super duper text wrapping code! You can even \n skip lines, adjust padding, and much more! :) \n \n stuff stuff stuff \n");
        }
        if (hold2) {
            console.log("Pressed 2");
            bubblebox.beginText("Here's another example using Comic Sans (lol) and a little thought bubble that could be used in an RPG, or with multiple boxes alive at the same time. I hope some of you will find this sytem useful once it's finished (ie not buggy)");
        }
    };


    this.drawOnScaled = function () {
        return;
    };

    this.enter = function () {
        if (endingBattle === true) { endingBattle = false; }
        if (typeof player !== "undefined") {
            console.log("Entered overworld");
            player.setGraphics(walkingRightPic, 4, walkingCyleDuration);
            console.log(player.img);
            player.opponent.reset();
        }
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

function BattleEndState() {

    var flicker = true;
    var flickerDuration = 15; //in frames
    var currentFlicker = 0;
    var changing;
    this.img = battleState.img;

    this.handleInput = function () {

        if (pressedKey) {
            gameController.changeState(overworldState);
            resetBattle();
            resetKeypress();
            player.shieldHP = 0;
            if (!this.win) {
                player.hp = player.maxHP;
            }
        }
    };

    this.drawOnScaled = function () {
        if (this.win === true) {
            scaledContext.textAlign = "center";
            colorText("You win!", scaledCanvas.width / 2, 180, "black");
            colorText("Beam got " + enemy.expGiven + " exp!", scaledCanvas.width / 2, 220, "black");
            if (flicker) { colorText("Press any key to continue", scaledCanvas.width / 2, 290, "black"); }
            scaledContext.textAlign = "left";
        }
        else if (this.win === false) {
            scaledContext.textAlign = "center";
            colorText("You lose...", scaledCanvas.width / 2, 200, "black");
            if (flicker) { colorText("Press any key to continue", scaledCanvas.width / 2, 245, "black"); }
            scaledContext.textAlign = "left";
        }
    };
    this.updateFlicker = function () {
        currentFlicker++;
        if (currentFlicker >= flickerDuration) {
            currentFlicker = 0;
            if (flicker) { flicker = false;}
            else if (!flicker) { flicker = true;}
        }
    };

    this.update = function () {

        clearScreen(); //Everything under this is drawn on the small canvas...
        this.updateFlicker();
        updateCycles();
        player.draw();
        player.drawBattle();
        player.opponent.draw();
        player.opponent.drawBattle();
        draw_particles();
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        this.drawOnScaled(); //This adds the text that can't be drawn on the mini canvas
        this.handleInput(); //can trigger a state change

    };
    this.enter = function () {
        this.currentFlicker = 0;
        if (player.hp == 0) { this.win = false; }
        else if (player.opponent.hp == 0) { this.win = true; }
        if (this.win) {
            player.exp += enemy.expGiven;
            if (battleState.battleType === "Gauntlet") {
                gauntletProgress++;
                if (gauntletProgress >= gauntletOrder.length) {
                    gameController.changeState(endgameState);
                }
            }
        }

    };
}
battleEndState = new BattleEndState();

function EndgameState() {

    this.img = null;

    this.update = function () {

        colorRect(0, 0, canvas.width, canvas.height, "black");
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        this.drawOnScaled(); //This adds the text that can't be drawn on the mini canvas
    };

    this.drawOnScaled = function () {
        scaledContext.textAlign = "center";
        colorText("Congratulations!", scaledCanvas.width / 2, 200, "white");
        colorText("You've completed the game!", scaledCanvas.width / 2, 285, "white");
        scaledContext.textAlign = "left";
    };

    this.enter = function () {
        return;
    };
}
endgameState = new EndgameState();

function checkDoor() { //Demo only
    if (player.x < 190 && player.x+5 > 165 &&
        player.y < 52  && player.y+5 > 12) {
        gameController.startGauntletBattle();
    }
}

function updateCycles() {
    if (player.cycleImage) {
        player.cycleTick();
    }
    if (player.opponent) {
        if (player.opponent.cycleImage) {
            console.log("Ticked enemy");
            player.opponent.cycleTick();
        }
    }
}

function resetBattle() {
    particles = [];
    msgOnDisplay = [];
    braceYourselves = [];
}

allBackgrounds = [battlePic, lavaPic];
