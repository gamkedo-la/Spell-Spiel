
function Character() { //"Character" == base class for anything that can fight

    this.name = "Character";
    this.x = 40;
    this.y = 125;
    this.speedX = 0;
    this.speedY = 0;
    this.img = null;

    this.shieldHP = 0;

    this.casting = false;

    //RELATED TO BATTLES

    //Eh, implement status effects later
    this.ticks = [
        {poison:0}
    ]

    this.opponent = null;

    this.reset = function () {
        this.hp = this.MAX_HP;
        this.shieldHP = 0;
        if (typeof this.attack !== "undefined") {
            clearInterval(this.attack);
            console.log("Stopped attacking!");
        }
    }

    //Graphics
    this.setGraphics = function (img) {
        this.img = img;
    }
    this.draw = function () { //On canvas
        canvasContext.drawImage(this.img, this.x - this.img.width / 2, this.y - this.img.height);
        if (this.shieldHP !== 0) {
            canvasContext.drawImage(shieldPic, this.x - this.img.width - 2, this.y - this.img.height - 21);
        }
        scaledContext.font = "normal 20pt Bookman";
        resetFont();
    }
    this.drawBattle = function () { //Override in player/enemy class
        return;
    }
    this.drawScaled = function () { //On scaled canvas
        colorText("HP: " + this.hp, (this.x - this.img.width / 2) * PIXEL_SCALE_UP, (this.y - this.img.height - 10) * PIXEL_SCALE_UP, "red");
        if (this.shieldHP !== 0) {
            colorText("Shield: " + this.shieldHP, (this.x - this.img.width / 2) * PIXEL_SCALE_UP, (this.y - this.img.height - 20) * PIXEL_SCALE_UP, "white");
        }
    }

    //Spell mechanics
    this.changeSpell = function (spell) {
        this.currentSpell.stopCountdown();
        spell.startCountdown();
        spell.reset();
        this.currentSpell = spell;
    }

    //Status effects
    this.isPoisoned = function () {
        this.ticks[0]["poison"] = 5;
        //console.log(this.ticks[0]["poison"]);
    }


    //RELATED TO OVERWORLD

    this.move = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

const MOVE_SPEED = 4; //In mini canvas pixels!

function Player() { //Defines the player object

    this.name = "Beam";
    this.img = standingPic; //player may or may not get a state machine of his own
    this.battleMsg = playerBattleMsg;

    this.MAX_HP = 350;
    this.hp = this.MAX_HP;

    this.availableSpells = [pyroblast, blizzard, lightning, shield1];
    this.spellCooldowns = ArrayWithZeros(this.availableSpells.length); //To implement
    this.currentSpell = noSpell;

    this.init = function () {
        this.battleMsg.x = this.x * PIXEL_SCALE_UP - scaledCanvas.width / 16; //EEHH. Numbers have no meaning, just placing on screen
        this.battleMsg.y = this.y * PIXEL_SCALE_UP + scaledCanvas.height / 17;
    }

    //var state_ = defaultState; //default state, changes during runtime

    this.drawBattle = function () {
        colorRect(this.x - this.img.width / 2, this.y - (37), (this.hp / this.MAX_HP) * 30, 5, "red");
        colorRect(this.x - this.img.width / 2, this.y - (32), ((this.currentSpell.currentCastWindow-this.currentSpell.timeElapsed) / this.currentSpell.currentCastWindow) * 30, 5, "green");
    }
}
Player.prototype = new Character(); //Note: prototype == inheritance in JS

var player = new Player();