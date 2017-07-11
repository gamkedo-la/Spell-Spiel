

function Character() { //"Character" == anything that can fight

    this.name = "Character";
    this.x = 40;
    this.y = 125;
    this.img = fillerPic;

    this.shield = 0;

    //Eh, implement status effects later
    this.ticks = [
        {poison:0}
    ]

    this.opponent = null;

    //Graphics
    this.setGraphics = function (img) {
        this.img = img;
    }
    this.draw = function () { //On canvas
        canvasContext.drawImage(this.img, this.x - this.img.width / 2, this.y - this.img.height);
        scaledContext.font = "normal 20pt Bookman";
        resetFont();
        colorRect(this.x - this.img.width / 2, this.y - (37), (this.hp / this.MAX_HP) * 30, 5, "red");
    }
    this.drawScaled = function () { //On scaled canvas
        colorText(this.hp, (this.x - this.img.width / 2) * PIXEL_SCALE_UP, (this.y - this.img.height - 10) * PIXEL_SCALE_UP, "red");
    }

    //Spell mechanics
    this.changeSpell = function (spell) {
        spell.reset();
        this.currentSpell = spell;
    }

    //Status effects
    this.isPoisoned = function () {
        this.ticks[0]["poison"] = 5;
        console.log(this.ticks[0]["poison"]);
    }
}
function Player() { //Defines the player object

    this.name = "Beam";
    this.img = standingPic; //player may or may not get a state machine of his own
    this.battleMsg = playerBattleMsg;

    this.MAX_HP = 350;
    this.hp = this.MAX_HP;

    this.availableSpells = [pyroblast, blizzard, lightning];
    this.spellCooldowns = ArrayWithZeros(this.availableSpells.length);
    this.currentSpell = noSpell;

    this.init = function () {
        this.battleMsg.x = this.x * PIXEL_SCALE_UP - scaledCanvas.width / 16; //EEHH. Numbers have no meaning, just placing on screen
        this.battleMsg.y = this.y * PIXEL_SCALE_UP + scaledCanvas.height / 17;
    }

    this.handleInput = function () {

        //Find a way to change this
        //console.log(keyPressed.data[keyPressed.data.length-1]); //get last array element and check if valid to change
        if (keyPressed.data[keyPressed.data.length - 1] == "1".charCodeAt(0)) {
            this.changeSpell(this.availableSpells[0]);
            resetKeypress();
        }
        if (keyPressed.data[keyPressed.data.length - 1] == "2".charCodeAt(0)) {
            this.changeSpell(this.availableSpells[1]);
            resetKeypress();
        }
        if (keyPressed.data[keyPressed.data.length - 1] == "3".charCodeAt(0)) {
            this.changeSpell(this.availableSpells[2]);
            resetKeypress();
        }
    }

    var state_ = defaultState; //default state, changes during runtime

}
Player.prototype = new Character();

var player = new Player();