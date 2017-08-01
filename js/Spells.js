//Everything about those sweet spells! :D

//Using the Subclass Sandbox pattern
function Spell() {
    this.name = "";
    this.text = "";
    this.progress = 0;
    this.rightOrWrong = [];
    this.numWrong = 0;
    var countdown; //Reference to the setTimeout
    this.timeElapsed = 0; //Time passed in millseconds
    this.MAX_CAST_WINDOW = 5000;
    this.currentCastWindow = 5000; //in milliseconds
    this.usedByAI = false; //TBD
    this.particle = null;

    this.MAX_POWER = 100;
    this.power = this.MAX_POWER;

    this.reset = function () {
        console.log("Resetting " + this.name);
        this.rightOrWrong = ArrayWithZeros(this.text.length);
        this.progress = 0;
        this.timeElapsed = 0;
        if (typeof player === "object") { //Big hack, checks if player exists because of script ordering...
            player.currentSpell = noSpell;
        }
    };

    this.updateResults = function (res) {
        if (res) {
            this.rightOrWrong[this.progress++] = 1;
        } else {
            this.rightOrWrong[this.progress] = -1;
            this.numWrong++; // Used to calculate effect
        }
        keyPressed.data = []; //Hopefully this isn't a mortal sin
    };

    this.checkProgress = function () {
        if (this.progress === this.text.length) {
            this.power = this.getPower();
            if (this.type === "Attack") { this.cast(player.opponent);}
            if (this.type === "Shield" || this.type === "Buff") { this.cast(player); } //Yay! :D
            this.currentCastWindow -= 1000;
            this.stopCountdown();
            this.reset();
            player.casting = false;
            battleState.currentSpell = "";
        }
    };
    this.spellFailed = function () {
        this.reset();
        battleState.currentSpell = "";
        console.log("Not quick enough!");
    };

    this.startCountdown = function () {
        this.countdown = setTimeout(this.spellFailed.bind(this), this.currentCastWindow);
    };
    this.stopCountdown = function () {
        clearTimeout(this.countdown);
    };

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
    };

    this.cast = function (target) {
        return; //To override in subclasses
    };
    this.basicCast = function (target) { //Deal damage based on power
        if (this.type === "Attack") {

            var toDeal;

            //Remove shield
            if (target.shieldHP != 0) {

                toDeal = this.power - target.shieldHP;
                if (toDeal < 0) {
                    toDeal = 0;
                }
                target.shieldHP = target.shieldHP - this.power;
                if (target.shieldHP < 0) {
                    target.shieldHP = 0;
                }
            }
            else { toDeal = this.power; }
            //Remove hp
            target.hp -= toDeal;
            if (target.hp <= 0) {
                target.hp = 0;
            }
        }
        if (this.type === "Shield") {
            var toShield = this.power;
            target.shieldHP = toShield;
        }
        if (this.type === "Buff") { //To do
            return;
        }
    };

    //These functions have yet to be made. Will be attached to sound/graphics components in place of subclasses
    this.playSound = function () {
        return;
    };

    this.spawnParticles = function (fromEnemy) {

        // run an 8 frame spritesheet animation and move it
        if (!fromEnemy && this.particle) // assume left to right (ie player cast)
            //party(45, 90, particletype, 70, 90);
            this.particle.party();
        else
            return; //party(150,90,125,90);  // FIXME - we may need "MIRROR_BITMAP" in drawParticles()?

        return;
    };
}

function drawSpell(spell) {

    var spellTextStartX = 95;
    var currentTextWidth = 0;

    for (i = 0; i < spell.rightOrWrong.length; i++) {
        if (spell.rightOrWrong[i] == 0) {
            color = "#0a1566";
        }
        else if (spell.rightOrWrong[i] == 1) {
            color = "#0b4709";
        }
        else if (spell.rightOrWrong[i] == -1) {
            color = "red";
        }
        colorText(spell.text[i], spellTextStartX + currentTextWidth, scaledCanvas.height / 2 - 60, color); //Need to change this
        currentTextWidth += scaledContext.measureText(spell.text[i]).width;
    }
    if (spell.name != "No spell") {
        spell.checkProgress(); //Checks if finished casting, casts if it is!
    }
}

function rechargeAllExceptCurrent() { //Refills the cooldowns of inactive spells each frame
    for (i = 0; i < player.availableSpells.length; i++) {
        toBoost = player.availableSpells[i];
        if (toBoost === player.currentSpell) { continue;}
        toBoost.currentCastWindow += 3;
        if (toBoost.currentCastWindow > toBoost.MAX_CAST_WINDOW) {
            toBoost.currentCastWindow = toBoost.MAX_CAST_WINDOW;
        }
    }
}

//Make spells here
Pyroblast = function () {
    this.name = "Pyroblast";
    this.text = "Pyroblast";
    this.type = "Attack";
    this.MAX_POWER = 50;
    this.particle = fireballParty;
    this.ANIM_FRAMES = 30;

    this.cast = function (target) { //Notice: checkProgress casts this function
        if (this.power >= this.MAX_POWER/2) { displayBattleMsg(player.battleMsg, msgFireGood.concat(msgNeutralGood)); } //Display good or bad message
        else if (this.power < this.MAX_POWER/2) { displayBattleMsg(player.battleMsg, msgFireBad.concat(msgNeutralBad)); }
        this.basicCast(target);
        screenshake(10,this.ANIM_FRAMES);
        this.playSound();
        this.spawnParticles(PARTICLE_FIREBALL);
    };
    this.reset();
};
Pyroblast.prototype = new Spell();
pyroblast = new Pyroblast();

Lightning = function () {
    this.name = "Lightning";
    this.text = "Lightning strike of doom";
    this.type = "Attack";
    this.ANIM_FRAMES = 30;
    this.particle = lightningParty;
    this.MAX_POWER = 200;

    this.cast = function (target) {
        if (this.power >= this.MAX_POWER / 2) { displayBattleMsg(player.battleMsg, msgLightningGood.concat(msgNeutralGood)); }
        else if (this.power < this.MAX_POWER / 2) { displayBattleMsg(player.battleMsg, msgLightningBad.concat(msgNeutralBad)); }
        this.basicCast(target);
        screenshake(10, this.ANIM_FRAMES);
        this.playSound();
        this.spawnParticles();
    };
    this.reset();
};
Lightning.prototype = new Spell();
lightning = new Lightning();

Blizzard = function () {
    this.name = "Blizzard";
    this.text = "Blizzard";
    this.type = "Attack";
    this.ANIM_FRAMES = 30;
    this.particle = iceSpikeParty;
    this.MAX_POWER = 50;

    this.cast = function (target) {
        if (this.power >= this.MAX_POWER / 2) { displayBattleMsg(player.battleMsg, msgIceGood.concat(msgNeutralGood)); }
        else if (this.power < this.MAX_POWER / 2) { displayBattleMsg(player.battleMsg, msgIceBad.concat(msgNeutralBad)); }
        this.basicCast(target);
        screenshake(10, this.ANIM_FRAMES);
        this.playSound();
        this.spawnParticles();
    };
    this.reset();
};
Blizzard.prototype = new Spell();
blizzard = new Blizzard();

Shield1 = function () {
    this.name = "Shield1";
    this.text = "Protect";
    this.type = "Shield";
    this.MAX_POWER = 250;

    this.cast = function (target) {
        //if (this.power >= this.MAX_POWER / 2) { displayBattleMsg(player.battleMsg, msgIceGood.concat(msgNeutralGood)); }
        //else if (this.power < this.MAX_POWER / 2) { displayBattleMsg(player.battleMsg, msgIceBad.concat(msgNeutralBad)); }
        this.basicCast(target);
        this.playSound();
        //this.spawnParticles(PARTICLE_FIREBALL); // FIXME
    };
    this.reset();
};
Shield1.prototype = new Spell();
shield1 = new Shield1();

//Fills the spot when no spell selected
noSpell = new Spell();
noSpell.name = "No spell";

