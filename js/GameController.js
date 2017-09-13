//World and game mini state machine

function GameController() {

    this.handleInput = function () {
        state_.handleInput(); //Delegate the input to the state object! Yay!
    };
    this.update = function () {
        state_.update();
    };

    this.changeState = function (state) {
        if (typeof state !== "undefined") {
            didInteraction();
            if (state_) { var sameMusic = state.music === state_.music; }
            if (state_ && Sound.isPlaying(state_.music) && !sameMusic) {
                Sound.stop(state_.music);
            }
            //console.log("Changed state");
            state_ = state;
            if (state_.music && !sameMusic) { Sound.play(state_.music, true, 0.8); }
            state_.enter();
        }
    };

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
        var random = Math.floor(Math.random() * gauntletProgress);
        enemy = gauntletOrder[random];
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

function MainMenuState() {
    this.img = mainMenuPic;
    this.music = "SpellSpiel_Battle";

    this.update = function () {
        clearScreen(); //All this is drawn on the small canvas...
        this.handleInput();
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
    }
    this.handleInput = function () {

        if (holdP && okToInteract) {
            gameController.changeState(overworldState);
        }
        if (holdS && okToInteract) {
            gameController.changeState(spellMenuState);
        }
        if (holdC && okToInteract) {
            gameController.changeState(creditsMenuState);
        }
        if (holdQ && okToInteract) {
            window.close();
        }
    }
    this.enter = function () {
    }
}

function SpellMenuState() {
    this.img = spellMenuPic;
    this.music = "SpellSpiel_Battle";
    var firstTime = true;
    var firstTime = false;
    this.currentPage = 0;

    //this is a workaround to catch mouseUp events
    this.observer = new Observer();
    this.observer.onNotify = function () {
        if (!messageActive) {
            var clickedOn;
            if (mouseX <= 400 && mouseY <= 300) {
                clickedOn = spellMenuState.currentPage.spells[0];
            }
            if (mouseX > 400 && mouseY <= 300) {
                clickedOn = spellMenuState.currentPage.spells[1];
            }
            if (mouseX <= 400 && mouseY > 300) {
                clickedOn = spellMenuState.currentPage.spells[2];
            }
            if (mouseX > 400 && mouseY > 300) {
                clickedOn = spellMenuState.currentPage.spells[3];
            }
            if (!clickedOn.isUnlocked) { announceBox.beginText("You gotta unlock spells by helping out in school first!");}
            else if (clickedOn.level < 5 && player.skillpoints > 0) {
                player.levelUpSpell(clickedOn);
            }
        }
    }
    this.update = function () {
        clearScreen(); //All this is drawn on the small canvas...
        this.handleInput();
        this.drawCheckmarks();
        drawMessagesIfAlive(); //split cus it has to be drawn on small canvas while words are on big one...
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        updateMessages();
    }
    this.handleInput = function () {

        if (holdM && okToInteract) {
            mouseUpSubject.removeObserver(this.observer);
            gameController.changeState(mainMenuState);
        }
        if (holdH && okToInteract) {
            didInteraction();
            announceBox.beginText("Click on a spell to upgrade it. \b Press arrow keys to turn pages. \b New spells are unlocked by interacting in school. \b You can upgrade your spells by battling and leveling up your character, Beam.");
        }
        if (holdS && okToInteract) {
            didInteraction();
            announceBox.beginText("Current level: " + player.level + " \b Current exp needed for next: " + (player.expNeeded - player.exp) + " \b Current points to spend: " + player.skillpoints);
        }
        if (holdLeft && okToInteract) {
            this.changePage("previous");
        }
        if (holdRight && okToInteract) {
            this.changePage("next");
        }
    }

    this.changePage = function (page) {
        var toGo;
        if (typeof page === "string") {
            switch (page) {
                case "next":
                    toGo = this.currentPage.next;
                    break;
                case "previous":
                    toGo = this.currentPage.previous;
                    break;
                default: console.log("Not a valid direction!");
            }
            if (typeof toGo === "undefined") {
                console.log("There is no page there!");
            }
            else {
                this.currentPage = toGo;
                this.img = toGo.img;
            }
        }
            //else, we assume "page" is an actual page object
        else {
            console.log("Not a string");
            this.img = page.img;
            this.currentPage = page;
        }
        didInteraction();
    }
    this.drawCheckmarks = function () {
        var spells = this.currentPage.spells;
        if (spells[0].isUnlocked) {
            for (i = 0; i < spells[0].level; i++) {
                canvasContext.drawImage(checkmarkPic, 47 + i * 9, 59);
            };
        }
        if (spells[1].isUnlocked) {
            for (i = 0; i < spells[1].level; i++) {
                canvasContext.drawImage(checkmarkPic, 147 + i * 9, 59);
            };
        }
        if (spells[2].isUnlocked) {
            for (i = 0; i < spells[2].level; i++) {
                canvasContext.drawImage(checkmarkPic, 47 + i * 9, 133);
            };
        }
        if (spells[3].isUnlocked) {
            for (i = 0; i < spells[3].level; i++) {
                canvasContext.drawImage(checkmarkPic, 147 + i * 9, 133);
            };
        }
    }

    this.enter = function () {
        mouseUpSubject.addObserver(this.observer);
        this.changePage(page1);
        if (firstTime) {
            announceBox.beginText("Click on a spell to upgrade it. \b Press arrow keys to turn pages. \b New spells are unlocked by interacting in school. \b You can upgrade your spells by battling and leveling up your character, Beam.");
            firstTime = false;
        }
    }
}

function CreditsMenuState() {
    this.img = creditsMenuPic;
    this.music = "SpellSpiel_Battle";

    this.update = function () {
        clearScreen(); //All this is drawn on the small canvas...
        this.handleInput();
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
    }
    this.handleInput = function () {

        if (holdM && okToInteract) {
            gameController.changeState(mainMenuState);
        }
    }
    this.enter = function () {
    }
}

var interactDelay = 0;
var interactDelayReset = 10;
var okToInteract = true;

function OverworldState() {

    var firstTime = true;
    var firstTime = false;
    this.img = mainRoomPic;
    this.music = 'SpellSpiel_Music_Open';
    this.currentRoom = 0;
    this.update = function () {

        clearScreen(); //All this is drawn on the small canvas...
        this.handleInput();
        player.move();
        checkForRoomChange();
        this.currentRoom.makeColliders();
        this.currentRoom.checkCollisions();
        this.currentRoom.checkTriggers();
        this.currentRoom.drawObjects();

        updateCycles();


        drawMessagesIfAlive(); //split cus it has to be drawn on small canvas while words are on big one...
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        updateMessages(); //see above
    };
    var walkingCycleDuration = 5;
    this.handleInput = function () {
        if (!messageActive) {
            if (holdLeft) {
                player.speedX = -MOVE_SPEED;
                if (player.movingDirection != "left") {
                    player.movingDirection = "left";
                    player.setGraphics(walkingLeftPic, 4, walkingCycleDuration);
                }
            }
            else if (holdRight) {
                player.speedX = MOVE_SPEED;
                if (player.movingDirection != "right") {
                    player.movingDirection = "right";
                    player.setGraphics(walkingRightPic, 4, walkingCycleDuration);
                }
            }
            else {
                player.speedX = 0;
            }

            if (holdUp) {
                player.speedY = -MOVE_SPEED;
                if (player.movingDirection != "up") {
                    player.movingDirection = "up";
                    player.setGraphics(walkingUpPic, 4, walkingCycleDuration);
                }
            }
            else if (holdDown) {
                player.speedY = MOVE_SPEED;
                if (player.movingDirection != "down") {
                    player.movingDirection = "down";
                    player.setGraphics(walkingDownPic, 4, walkingCycleDuration);
                }
            }
            else {
                player.speedY = 0;
            }

            if (player.speedX === 0 && player.speedY === 0) {
                player.resetTickAndImg();
            }

            if (holdSpacebar) {
                gameController.startBattle(dummy);
            }
        }
        else {
            player.resetTickAndImg();
        }
        if (hold1) {
            announceBox.beginText("UNLOCKED PYROBLAST!");
        }
        if (hold2) {
            //overworldState.changeRoom("left");
            //bubblebox.beginText("Here's another example using Comic Sans (lol) and a little thought bubble that could be used in an RPG, or with multiple boxes alive at the same time. I hope some of you will find this sytem useful once it's finished (ie not buggy)");
        }
        if (holdP && okToInteract) {
            gameController.changeState(mainMenuState);
        }
    };


    this.drawOnScaled = function () {
        return;
    };

    this.changeRoom = function (room) {
        var toGo;
        //var initialPos = 
        if (typeof room === "string") {
            switch (room) {
                case "up":
                    toGo = this.currentRoom.upRoom;
                    if (toGo) { player.position.y = 150; }
                    else player.moveBack();
                    break;
                case "down":
                    toGo = this.currentRoom.downRoom;
                    if (toGo) { player.position.y = 10; }
                    else player.moveBack();
                    break;
                case "left":
                    toGo = this.currentRoom.leftRoom;
                    if (toGo) { player.position.x = 190; }
                    else player.moveBack();
                    break;
                case "right":
                    toGo = this.currentRoom.rightRoom;
                    if (toGo) { player.position.x = 10; }
                    else player.moveBack();
                    break;
                default: console.log("Not a valid direction!");
            }
            if (typeof toGo === "undefined") {
                console.log("There is no room on this side!");
            }
            else {
                this.currentRoom = toGo;
                this.img = toGo.img;
            }
        }
            //else, we assume "room" is an actual Room object
        else {
            console.log("Not a string");
            this.img = room.img;
            this.currentRoom = room;
            player.position = this.currentRoom.spawnPoints.center;
        }
    }

    this.enter = function () {
        if (typeof player !== "undefined") {
            if (firstTime || endingBattle) { player.setGraphics(walkingRightPic, 4, walkingCycleDuration); }
            if (typeof player.opponent != "undefined") { player.opponent.reset(); }
            player.position = this.currentRoom.spawnPoints.center;
            player.collider.position = player.position;
        }
        console.log(this.currentRoom);
        if (endingBattle === true) { endingBattle = false; }
        if (firstTime) {
            announceBox.beginText("Welcome to the Academy! \b To graduate, you must defeat every enemy outside the school grounds, through the big doorway near you. \b But first, take the time to chat with your classmates to prepare yourself!");
            firstTime = false;
        }
        document.removeEventListener("keypress", keyPressed);//keypress == only character keys!
        document.addEventListener("keydown", keyDown);
    };
}

var endingBattle = false;
function BattleState() {

    this.battleType = "Gauntlet";
    this.img = battlePic;
    this.music = "SpellSpiel_Battle";

    this.update = function () {
        spellTimeLapse();
        rechargeAllExceptCurrent();
        player.poisonUpdate();
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
        updateEffects();
        updateBuffs();

        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        this.drawOnScaled(); //This adds the text that can't be drawn on the mini canvas
        this.endCheck(); //Check if battle is over

        resetKeypress();
    };

    this.currentSpell = "";
    this.lastLen = 0;
    this.handleInput = function () {

        if (this.currentSpell === "") {
            player.isCasting = false;
            player.picToChange = true;
        }

        if (keyPressed.data.length === 0) {
            this.lastLen = 0;
            return;
        }

        if (keyPressed.data.length === this.lastLen) return;
        this.lastLen++;

        // Checks if the pressed key is in the alphabet. If it is, we query the trie
        // Non-letter input can be used for pausing, etc.
        var key = String.fromCharCode(keyPressed.data[keyPressed.data.length - 1]);

        if (key.match(/[a-z ':, ]/i)) {
            var completion = spellTrie.autoComplete(this.currentSpell + key);
            if (completion.length && player.availableSpells[completion[0]].isUnlocked) {
                completion = completion[0];
                this.currentSpell += key;
                var progress = player.currentSpell.progress;
                player.changeSpell(player.availableSpells[completion]);
                player.currentSpell.catchUp(progress);
                player.currentSpell.updateResults(true);
                resetKeypress();
            } else {
                // Play a sound, do not advance
                if (player.currentSpell.name != "No spell") {
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

function BattleEndState() {

    this.music = "SpellSpiel_Battle";
    var flicker = true;
    var flickerDuration = 15; //in frames
    var currentFlicker = 0;
    var changing;
    this.img = battleState.img;

    this.handleInput = function () {
        if (!messageActive) {
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
    }
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
        //this.updateFlicker();
        updateCycles();
        drawBothBattle();
        drawMessagesIfAlive(); //split cus it has to be drawn on small canvas while words are on big one...
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled canvas
        updateMessages();
        this.handleInput(); //can trigger a state change

    };
    this.enter = function () {
        //this.currentFlicker = 0;
        endingBattle = true;
        var leveledUp = false;
        if (player.hp == 0) {
            this.win = false;
            announceBox.beginText("Beam was defeated! \b Gonna need more practice!");
        }
        else if (player.opponent.hp == 0) {
            this.win = true;
            player.exp += enemy.expGiven;
            console.log(player.exp, player.expNeeded);
            if (player.exp >= player.expNeeded && !levelCapReached) {
                player.levelUp(); //Awesome!
                leveledUp = true;
            }
            if (battleState.battleType === "Gauntlet") {
                gauntletProgress++;
                if (gauntletProgress >= gauntletOrder.length) {
                    gameController.changeState(endgameState);
                }
            }
            if (leveledUp) { announceBox.beginText("Beam was victorious! \b Earned " + enemy.expGiven + " exp. \b Beam leveled up! Now level " + player.level + "! \b Gained " + player.hpLadder[player.level] + "hp. \b Gained one skill point to spend."); }
            else { announceBox.beginText("Beam was victorious! \b Earned " + enemy.expGiven + " exp.");}
        }
        document.removeEventListener("keypress", keyPressed);//keypress == only character keys!
        document.addEventListener("keydown", keyDown);
    };
}

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

allBackgrounds = [battlePic, lavaPic];

var battleState = new BattleState();
var overworldState = new OverworldState();
var battleEndState = new BattleEndState();
var endgameState = new EndgameState();
var mainMenuState = new MainMenuState();
var spellMenuState = new SpellMenuState();
var creditsMenuState = new CreditsMenuState();
var defaultState = mainMenuState;
var gameController = new GameController();
