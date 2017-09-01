
function Character() { //"Character" == base class for anything that can fight

    this.name = "Character";
    this.position = {
        x : 150,
        y : 150
    };
    this.speedX = 0;
    this.speedY = 0;
    this.img = null;

    this.level = 1;
    this.shieldHP = 0;

    this.isCasting = false;

    this.cycleImage = false;
    var cycleCurrent = 0;
    this.cycleDuration = 50; //frames
    var currentImg = 0;
    this.imgNumber = 1;

    this.skillpoints = 0;
    //RELATED TO BATTLES

    //Eh, implement status effects later
    this.ticks = [
        {poison:0}
    ];

    this.delayedDamage = []; //2D array with [framesLeft, dmg]
    this.delayedEffect = []; //2D array with [framesLeft, method call]

    this.opponent;

    this.reset = function () {
        this.hp = this.maxHP;
        this.shieldHP = 0;
        if (!this.cycleImage) {
            currentImg = 0;
        }
        this.delayedDamage = [];
        this.delayedEffect = [];
        resetSpellWindows();
    };
    this.dealDamage = function (amount) {
        var toDeal;
        //Remove shield
        if (this.shieldHP != 0 && amount >=0 ) {
            toDeal = amount - this.shieldHP;
            if (toDeal < 0) {
                toDeal = 0;
            }
            this.shieldHP = this.shieldHP - amount;
            if (this.shieldHP < 0) {
                this.shieldHP = 0;
            }
        }
        else { toDeal = amount; }
        //Remove hp
        this.hp -= toDeal;
        if (this.hp <= 0) {
            this.hp = 0;
        }
        if (this.hp >= this.maxHP) {
            this.hp = this.maxHP;
        }
    };
    //effects need to take "this" as argument
    this.updateEffect = function () {
        for (var i = 0; i < this.delayedEffect.length; i++) {
            this.delayedEffect[i][0]--; // -1 frame
            if (this.delayedEffect[i][0] <= 0) {
                switch (this.delayedEffect[i][1]) {
                    case "castFailed":
                        console.log("Caliss, c'est plate");
                        this.castFailed();
                        break;
                }
                this.delayedEffect.splice(i, 1);
            };
        }
    };
    //Graphics
    this.setGraphics = function (img, imgNumber, cycleDuration) {
        this.img = img;
        this.imgNumber = imgNumber; //# of images in spritesheet
        this.cycleDuration = cycleDuration;
    };
    this.draw = function () { //On canvas;
        var spriteWidth = this.img.width / this.imgNumber;
        canvasContext.drawImage(this.img, currentImg*spriteWidth, 0, spriteWidth,
            this.img.height, this.position.x - (this.img.width / this.imgNumber) / 2,
            this.position.y - this.img.height, spriteWidth, this.img.height);
        if (this.shieldHP !== 0) {
            canvasContext.drawImage(shieldPic, this.position.x - (this.img.width / this.imgNumber) - 2, this.position.y - this.img.height - 21);
        }
        scaledContext.font = "normal 20pt Bookman";
        resetFont();
    };
    this.drawBattle = function () { //Override in player/enemy class
        return;
    };
    this.drawScaled = function () { //On scaled canvas

        colorText("HP: " + this.hp, (this.position.x - (this.img.width / this.imgNumber) / 2) * PIXEL_SCALE_UP, (this.position.y - this.img.height - 30) * PIXEL_SCALE_UP, "red");
        if (this.shieldHP !== 0) {
            colorText("Shield: " + this.shieldHP, (this.position.x - (this.img.width / this.imgNumber) / 2) * PIXEL_SCALE_UP, (this.position.y - this.img.height - 20) * PIXEL_SCALE_UP, "white");
        }
        colorText(this.name, (this.position.x - (this.img.width / this.imgNumber) / 2 - 15) * PIXEL_SCALE_UP, (this.position.y - this.img.height - 55) * PIXEL_SCALE_UP, "orange");

        if (typeof this.chosenOne !== "undefined") {
            colorRectScaled(395, 520, 405, 70, "#e63900");
            colorRectScaled(400, 525, 395, 60, "#660000");
            colorText("Next: " + this.chosenOne.name, 405, 570, "#e63900");
        }
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
    this.resetTickAndImg = function () {
        cycleCurrent = 0;
        currentImg = 0;
    }

    ////////////       Spell mechanics         ///////////
    this.levelUp = function () {
        this.level++;
        this.maxHP += this.hpLadder[this.level - 1];
        this.skillPoints++;
    };
    this.changeSpell = function (spell) {
        if(spell != this.currentSpell) {
            this.currentSpell.stopCountdown();
            spell.startCountdown();
            spell.reset();
        }
        if (spell.particle && !spell.particle.isAlive) { spell.particle.reset();}
        this.currentSpell = spell;
    };
    //Called from clicking a button in skills menu
    this.upgradeSpell = function (spell) {
        spell.levelUp();
        this.skillPoints--;
    };

    //Status effects
    this.isPoisoned = function () {
        this.ticks[0].poison = 5;
        //console.log(this.ticks[0]["poison"]);
    };


    //RELATED TO OVERWORLD

    this.move = function () {
        this.position.x += this.speedX;
        this.position.y += this.speedY;
    }
    this.moveBack = function () {
        this.position.x -= this.speedX;
        this.position.y -= this.speedY;
        if (this.speedX == 0 && this.speedY == 0) {
            this.position.x -= 1;
            this.position.y -= 1;
        }
    };
}

const MOVE_SPEED = 4; //In mini canvas pixels!

function Player() { //Defines the player object

    this.name = "Beam";
    this.img = walkingRightPic;
    this.cycleImage = true;
    this.imgNumber = 4;
    this.picToChange = false;
    this.movingDirection = ""; //can be "up", "down", "left", "right"
    this.cycleDuration = 30;

    this.maxHP = 350;
    this.hp = this.maxHP;
    this.hp = 100;
    this.hpLadder = [0, 25, 50, 75]; //Hp upgrades for each level
    this.exp = 0;

    // TODO this must be refactored to use the json
    // Maybe we don't have an object for each spell, or the objects are dynamically
    // created from the json?
    this.availableSpells = {
        "Pyroblast": pyroblast,
        "Ice Spike": iceSpike,
        "Lightning strike of doom": lightning,
        "Protect": shield1,
        "Toxic Cloud": toxicCloud,
        "Life Drain": lifeDrain,
        "Za Warudo": zaWarudo,
        "Dispell": dispell
    };
    this.currentSpell = noSpell;

    this.drawBattle = function () {
        colorRect((this.position.x - 4 - (this.img.width / this.imgNumber) / 2), (this.position.y - this.img.height - 44), 61, 41, "#e0ffff");
        colorRect((this.position.x - 3 - (this.img.width / this.imgNumber) / 2), (this.position.y - this.img.height - 43), 59, 39, "#4d004d");
        colorRect(this.position.x - (this.img.width/this.imgNumber) / 2, this.position.y - (47), 30, 5, "black");
        colorRect(this.position.x - (this.img.width/this.imgNumber) / 2, this.position.y - (47), (this.hp / this.maxHP) * 30, 5, "red");
        colorRect(this.position.x - (this.img.width / this.imgNumber) / 2, this.position.y - (42), ((this.currentSpell.currentCastWindow - this.currentSpell.timeElapsed) / this.currentSpell.currentCastWindow) * 30, 5, "green");
    };
    var idleBattleCycleDuration = 30;
    //This is the replacement of the state machine that the main character would get if it was really needed. Changes his animations depending on situations
    this.checkState = function () {
        if (this.picToChange) {
            if (this.isCasting) {
                this.setGraphics(castingPic, 1, idleBattleCycleDuration);
            }
            else if (!this.isCasting) {
                this.setGraphics(idlePic, 2, idleBattleCycleDuration);
            }
            if (this.isDead) {
                return; //todo
            }
        }
    };
}

Player.prototype = new Character(); //Note: prototype === inheritance in JS

var player = new Player();
