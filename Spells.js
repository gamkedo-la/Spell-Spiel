//Everything about those sweet spells! :D

//Using the Subclass Sandbox pattern
function Spell() {
    this.name = "";
    this.text = "";
    this.progress = 0;
    this.rightOrWrong = [];
    this.usedByAI = false;

    this.MAX_POWER = 100;
    this.power = this.MAX_POWER;

    this.reset = function () {
        console.log("Resetting " + this.text);
        this.rightOrWrong = ArrayWithZeros(this.text.length);
        this.progress = 0;
        if (typeof player === "object") { //Big hack, checks if player exists because of script ordering...
            player.currentSpell = noSpell;
        }
    }

    this.checkLetters = function () {
        if (keyPressed.data.indexOf(this.text.charCodeAt(this.progress)) != -1) {
            this.rightOrWrong[this.progress] = 1;
        }
        else {
            this.rightOrWrong[this.progress] = -1;
        }
        this.progress += 1;
        keyPressed.data = [];
    }

    this.checkProgress = function () {
        if (this.progress === this.text.length) {
            this.power = this.getPower();
            if (this.usedByAI) { this.cast(player);}
            if (!this.usedByAI) { this.cast(player.opponent); } //Yay! :D
            this.reset();
        }
    }

    this.getPower = function () { //Called at the end to check how many right/wrong
        var tally = 0;
        for (i = 0; i < this.rightOrWrong.length; i++) {
            tally += this.rightOrWrong[i];
        }
        if (tally < 0) {
            tally = 0;
        }
        //console.log(tally);
        return Math.round(this.MAX_POWER * (tally / this.rightOrWrong.length));
    }

    this.cast = function (target) {
        return; //To override in subclasses
    }
    this.basicCast = function (target) { //Deal damage based on power
        var toDeal;
        //Remove shield
        if (target.shield != 0) {

            toDeal = -1 * (target.shield - this.power);
            target.shield = target.shield - this.power;
            if (target.shield <= 0) {
                target.shield = 0;
            }
        }
        else { toDeal = this.power };
        //Remove hp
        target.hp -= toDeal;
        if (target.hp <= 0) {
            target.hp = 0;
        }
    }

    //These functions have yet to be made. Will be attached to sound/graphics components in place of subclasses
    this.playSound = function () {
        return;
    }
    this.spawnParticles = function () {
        return;
    }
}

Pyroblast = function () {
    this.name = "Pyroblast";
    this.text = "Pyroblast";
    this.MAX_POWER = 50;

    this.cast = function (target) { //Note: checkProgress casts this function even if it it's in base Spell class
        if (this.power >= this.MAX_POWER/2) { battleMsg(player.battleMsg, msgFireGood.concat(msgNeutralGood)); }
        else if (this.power < this.MAX_POWER/2) { battleMsg(player.battleMsg, msgFireBad.concat(msgNeutralBad)); }
        this.basicCast(target);
        this.playSound();
        this.spawnParticles();
    }
    this.reset();
}
Pyroblast.prototype = new Spell();
pyroblast = new Pyroblast();

Lightning = function () {
    this.name = "Lightning";
    this.text = "Lightning pulverise";
    this.MAX_POWER = 85;

    this.cast = function (target) {
        if (this.power >= this.MAX_POWER / 2) { battleMsg(player.battleMsg, msgLightningGood.concat(msgNeutralGood)); }
        else if (this.power < this.MAX_POWER / 2) { battleMsg(player.battleMsg, msgLightningBad.concat(msgNeutralBad)); }
        this.basicCast(target);
        this.playSound();
        this.spawnParticles();
    }
    this.reset();
}
Lightning.prototype = new Spell();
lightning = new Lightning();

Blizzard = function () {
    this.name = "Blizzard";
    this.text = "Blizzard";
    this.MAX_POWER = 50;

    this.cast = function (target) { //Note: checkProgress casts this function even if it it's in base Spell class
        if (this.power >= this.MAX_POWER / 2) { battleMsg(player.battleMsg, msgIceGood.concat(msgNeutralGood)); }
        else if (this.power < this.MAX_POWER / 2) { battleMsg(player.battleMsg, msgIceBad.concat(msgNeutralBad)); }
        this.basicCast(target);
        this.playSound();
        this.spawnParticles();
    }
    this.reset();
}
Blizzard.prototype = new Spell();
blizzard = new Blizzard();

//Fills the spot when no spell selected
noSpell = new Spell();
noSpell.name = "No spell";


function drawSpell(spell) {

    //console.log(keyPressed.data);

    if (spell.name == "No spell") { //Do nothing if no spell selected
        return;
    }

    if (pressedKey === true) { //If no key pressed, we draw the same spell as last frame
        pressedKey = false;
        spell.checkLetters();
    }

    var spellTextStartX = 95;
    var currentTextWidth = 0;

    for (i = 0; i < spell.rightOrWrong.length; i++) {
        if (spell.rightOrWrong[i] == 0) {
            color = "black";
        }
        else if (spell.rightOrWrong[i] == 1) {
            color = "green";
        }
        else if (spell.rightOrWrong[i] == -1) {
            color = "red";
        }
        colorText(spell.text[i], spellTextStartX + currentTextWidth, scaledCanvas.height / 2 - 15, color); //Need to change this
        currentTextWidth += scaledContext.measureText(spell.text[i]).width;
    }
    spell.checkProgress(); //Checks if finished casting, casts if it is!
}
