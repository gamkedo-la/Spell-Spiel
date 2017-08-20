
function Character() { //"Character" == base class for anything that can fight

    this.name = "Character";
    this.x = 180;
    this.y = 85;
    this.speedX = 0;
    this.speedY = 0;
    this.img = null;

    this.level = 1;
    this.hpLadder = [0, 25, 50, 75]; //Hp upgrades for each level
    this.shieldHP = 0;

    this.isCasting = false;

    this.cycleImage = false;
    var cycleCurrent = 0;
    this.cycleDuration = 50; //frames
    var currentImg = 0;
    this.imgNumber = 1;

    //RELATED TO BATTLES

    //Eh, implement status effects later
    this.ticks = [
        {poison:0}
    ];

    this.delayedDamage = []; //2D array with [framesLeft, dmg]

    this.opponent = null;

    this.reset = function () {
        this.hp = this.maxHP;
        this.shieldHP = 0;
        if (typeof this.attack !== "undefined") {
            clearInterval(this.attack);
            console.log("Stopped attacking!");
        }
        if (!this.cycleImage) {
            currentImg = 0;
        }
    };
    this.dealDamage = function (amount) {
        var toDeal;
        //Remove shield
        if (this.shieldHP != 0) {
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
    };
    //Graphics
    this.setGraphics = function (img, imgNumber) {
        this.img = img;
        this.imgNumber = imgNumber; //# of images in spritesheet
    };
    this.draw = function () { //On canvas
        //colorRect(this.x, this.y, this.img.width, this.img.height, "red");
        var spriteWidth = this.img.width / this.imgNumber;
        canvasContext.drawImage(this.img, currentImg*spriteWidth, 0, spriteWidth, this.img.height, this.x - (this.img.width / this.imgNumber) / 2, this.y - this.img.height, spriteWidth, this.img.height);
        if (this.shieldHP !== 0) {
            canvasContext.drawImage(shieldPic, this.x - (this.img.width / this.imgNumber) - 2, this.y - this.img.height - 21);
        }
        scaledContext.font = "normal 20pt Bookman";
        resetFont();
    }; 
    this.drawBattle = function () { //Override in player/enemy class
        return;
    };
    this.drawScaled = function () { //On scaled canvas
        colorText("HP: " + this.hp, (this.x - (this.img.width / this.imgNumber) / 2) * PIXEL_SCALE_UP, (this.y - this.img.height - 10) * PIXEL_SCALE_UP, "red");
        if (this.shieldHP !== 0) {
            colorText("Shield: " + this.shieldHP, (this.x - (this.img.width / this.imgNumber) / 2) * PIXEL_SCALE_UP, (this.y - this.img.height - 20) * PIXEL_SCALE_UP, "white");
        }
        colorText(this.name, (this.x - (this.img.width / this.imgNumber) / 2 - 15) * PIXEL_SCALE_UP, (this.y - this.img.height -45) * PIXEL_SCALE_UP, "orange");
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
        if (spell.particle) { spell.particle.reset();}
        this.currentSpell = spell;
    };
    //Called from clicking a button in skills menu
    this.upgradeSpell = function (spell) {
        spell.levelUp();
        player.skillPoints--;
    };

    //Status effects
    this.isPoisoned = function () {
        this.ticks[0].poison = 5;
        //console.log(this.ticks[0]["poison"]);
    };


    //RELATED TO OVERWORLD

    this.move = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    };
}

const MOVE_SPEED = 4; //In mini canvas pixels!

function Player() { //Defines the player object

    this.name = "Beam";
    this.img = idlePic;
    this.picToChange = false;
    this.cycleDuration = 30;
    this.battleMsg = playerBattleMsg;

    this.maxHP = 350;
    this.hp = this.maxHP;

    console.log("imgwidth",this.img.width);
    console.log("imgheight",this.img.height);
    console.log("imgnum",this.imgNumber);
    this.collider = new Collider(this.x-this.img.width/2, this.y-this.img.height/2,
        this.img.width/ this.imgNumber, this.img.height / this.imgNumber);

    // TODO this must be refactored to use the json
    // Maybe we don't have an object for each spell, or the objects are dynamically
    // created from the json?
    this.availableSpells = {
        "Pyroblast": pyroblast,
        "Ice Spike": iceSpike,
        "Lightning strike of doom": lightning,
        "Protect": shield1,
        "Toxic Cloud": toxicCloud,
        "Za Warudo": zaWarudo,
    };
    console.log(this.availableSpells);
    //this.spellCooldowns = ArrayWithZeros(this.availableSpells.length); //To implement
    this.currentSpell = noSpell;

    //var state_ = defaultState; //default state, changes during runtime

    this.drawBattle = function () {
        colorRect(this.x - (this.img.width/this.imgNumber) / 2, this.y - (37), 30, 5, "black");
        colorRect(this.x - (this.img.width/this.imgNumber) / 2, this.y - (37), (this.hp / this.maxHP) * 30, 5, "red");
        colorRect(this.x - (this.img.width / this.imgNumber) / 2, this.y - (32), ((this.currentSpell.currentCastWindow - this.currentSpell.timeElapsed) / this.currentSpell.currentCastWindow) * 30, 5, "green");
    };

    //This is the replacement of the state machine that the main character would get if it was really needed. Changes his animations depending on situations
    this.checkState = function () {
        if (this.picToChange) {
            if (this.isCasting) {
                this.setGraphics(castingPic, 1);
            }
            else if (!this.isCasting) {
                this.setGraphics(idlePic, 2);
            }
            if (this.isDead) {
                return; //todo
            }
        }
    };
}

Player.prototype = new Character(); //Note: prototype === inheritance in JS

var player = new Player();
player.cycleImage = true;
player.imgNumber = 2;
