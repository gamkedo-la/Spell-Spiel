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
    this.isUnlocked = false;

    this.maxPower = 100;
    this.power = this.maxPower;
    this.powerLadder = [0,15,20,35,55];
    this.level = 1;

    this.levelUp = function () {
        this.level++;
        this.maxPower += this.powerLadder[this.level - 1];
        console.log("Level up! Now level: " + this.level);
        console.log(this.maxPower);
    }

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

    //Marks all previous letters as good when switching spells, hence "catching up", and marks progress of previous spell
    this.catchUp = function (progress) {
        for (i = 0; i < progress; i++) {
            this.rightOrWrong[i] = 1;
        }
        this.progress = progress;
    }

    this.checkProgress = function () {
        if (this.progress === this.text.length) {
            if (this.particle && this.particle.isAlive) {
                this.spellFailed();//kills the cast if the particle is alive. Gotta prevent that spam (and avoid dealing with multiple particles :P)
                return;
            }
            this.power = this.getPower();
            if (this.selfcast === true) { this.cast(player); } //Yay! :D
            else { this.cast(player.opponent);}
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
        return Math.round(this.maxPower * (tally / this.rightOrWrong.length));
    };

    this.cast = function (target) {
        return; //To override in subclasses
    };

    this.basicCast = function (target, multiplier, extraDelayFrames, effect) { //Deal damage based on power

        //effect is a string
        if (typeof multiplier === "undefined") { multiplier = 1;}
        if (typeof extraDelayFrames === "undefined") { extraDelayFrames = 0 }
        //if (typeof effect === "undefined") { effect = 0;}
        if (this.type === "Attack") {
            var dmgToPush = this.power * multiplier;
            if (this.particle) {
                target.delayedDamage.push([durationInMS(this.particle.duration+extraDelayFrames), dmgToPush]);
            }
            else { target.delayedDamage.push([0, dmgToPush]); }
        }
        if (this.type === "Shield") {
            var toShield = this.power * multiplier;
            target.shieldHP = toShield;
        }
        if (this.type === "Buff" || this.type === "Debuff" || this.type === "Special") {
            target.delayedEffect.push([(durationInMS(this.particle.duration + extraDelayFrames)), effect]);
        }
    };

    //These functions have yet to be made. Will be attached to sound/graphics components in place of subclasses
    this.playSound = function () {
        return;
    };

    this.spawnParticles = function (particle, fromEnemy) {

        // run an 8 frame spritesheet animation and move it
        if (!fromEnemy && this.particle) { // assume left to right (ie player cast)
            //party(45, 90, particletype, 70, 90);
            particle.party();
            
        }
        else
            return; //party(150,90,125,90);  // FIXME - we may need "MIRROR_BITMAP" in drawParticles()?

        return;
    };
}

function drawSpell(spell) {

    var spellTextStartX = 95;
    var currentTextWidth = 0;
    var fullTextWidth = scaledContext.measureText(spell.text).width;

    if (spell.name != "No spell") { colorRectScaled(spellTextStartX - 3, scaledCanvas.height / 2 - 108, fullTextWidth + 6, 66, "black"); }
    colorRectScaled(spellTextStartX, scaledCanvas.height / 2 - 105, fullTextWidth, 60, "#e0ffff"); 
    for (i = 0; i < spell.rightOrWrong.length; i++) {
        if (spell.rightOrWrong[i] == 0) {
            color = "#0a1566";
        }
        else if (spell.rightOrWrong[i] == 1) {
            color = "#07D800";
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
    for (var keyname in player.availableSpells) {
        toBoost = player.availableSpells[keyname];
        if (toBoost === player.currentSpell) { continue;}
        toBoost.currentCastWindow += 3;
        if (toBoost.currentCastWindow > toBoost.MAX_CAST_WINDOW) {
            toBoost.currentCastWindow = toBoost.MAX_CAST_WINDOW;
        }
    }
}

////////////////////////                Spell creation                  ///////////////////////////
Pyroblast = function () {
    this.name = "Pyroblast";
    this.text = "Pyroblast";
    this.type = "Attack";
    this.maxPower = 50;
    this.isUnlocked = true;
    this.particle = fireballParty;

    this.cast = function (target) { //Notice: checkProgress casts this function
        this.basicCast(target, player.attackMultiplier);
        screenshake(10, durationInMS(this.particle.duration));
        this.playSound();
        //this.spawnParticles();
        this.particle.party();
    };
    this.reset();
};
Pyroblast.prototype = new Spell();
pyroblast = new Pyroblast();

Lightning = function () {
    this.name = "Lightning";
    this.text = "Lightning Strike of Doom";
    this.type = "Attack";
    this.particle = lightningParty;
    this.maxPower = 150;
    this.MAX_CAST_WINDOW = 6500;
    this.isUnlocked = true;

    this.cast = function (target) {
        this.basicCast(target, player.attackMultiplier);
        screenshake(10, durationInMS(this.particle.duration));
        this.playSound();
        this.spawnParticles(this.particle);
    };
    this.reset();
};
Lightning.prototype = new Spell();
lightning = new Lightning();

IceSpike = function () {
    this.name = "Ice Spike";
    this.text = "Ice Spike";
    this.type = "Attack";
    this.particle = iceSpikeParty;
    this.isUnlocked = true;
    this.maxPower = 50;

    this.cast = function (target) {
        this.basicCast(target, player.attackMultiplier);
        screenshake(5, durationInMS(this.particle.duration))
        this.particle.party();
    };
    this.reset();
};
IceSpike.prototype = new Spell();
iceSpike = new IceSpike();

ToxicCloud = function () {
    this.name = "Toxic Cloud";
    this.text = "Toxic Cloud";
    this.type = "Attack";
    this.maxPower = 25;
    this.particle = toxicCloudParty;

    this.cast = function (target) { //Notice: checkProgress casts this function
        this.basicCast(target, player.attackMultiplier);
        screenshake(1, durationInMS(this.particle.duration));
        this.playSound();
        this.particle.party();
    };
    this.reset();
};
ToxicCloud.prototype = new Spell();
toxicCloud = new ToxicCloud();

LifeDrain = function () {
    this.name = "Life Drain";
    this.text = "Life Drain";
    this.type = "Attack";
    this.maxPower = 50;
    this.particle = lifeDrainParty;

    this.cast = function (target) { //Notice: checkProgress casts this function
        this.basicCast(target, player.attackMultiplier, -this.particle.duration);
        screenshake(1, durationInMS(this.particle.duration));
        this.playSound();
        this.particle.party();
        player.delayedDamage.push([durationInMS(this.particle.duration), -this.maxPower / 2]); //delayed healing
    };
    this.reset();
};
LifeDrain.prototype = new Spell();
lifeDrain = new LifeDrain();

Shield1 = function () {
    this.name = "Shield1";
    this.text = "Protect";
    this.type = "Shield";
    this.maxPower = 100;
    this.selfcast = true;
    this.isUnlocked = true;

    this.cast = function (target) {
        this.basicCast(target); //shields don't get buffed (or they might get op)
        this.playSound();
    };
    this.reset();
};
Shield1.prototype = new Spell();
shield1 = new Shield1();

Dispell = function () {
    this.name = "Dispell";
    this.text = "Dispell";
    this.type = "Special";
    this.maxPower = 0;
    this.particle = dispellParty;

    this.cast = function (target) {
        this.basicCast(target, player.attackMultiplier, 0, "castFailed");
        this.particle.party();
        this.playSound();
    };
    this.reset();
};
Dispell.prototype = new Spell();
dispell = new Dispell();

GetTilted = function () {
    this.name = "Get Tilted";
    this.text = "Time to show this guy";
    this.type = "Buff";
    this.maxPower = 0;
    this.particle = dispellParty;
    this.MAX_CAST_WINDOW = 6500;
    this.selfcast = true;

    this.cast = function (target) {
        this.basicCast(target, 1, 0, "Buff Attack 1.2");
        this.particle.party();
        this.playSound();
    };
    this.reset();
}
GetTilted.prototype = new Spell();
getTilted = new GetTilted();

DNDC = function () {
    this.name = "DNDC";
    this.text = "DNDC: don't know don't care";
    this.type = "Buff";
    this.maxPower = 0;
    this.particle = dispellParty;
    this.MAX_CAST_WINDOW = 8500;
    this.selfcast = true;

    this.cast = function (target) {
        this.basicCast(target, 1, 0, "Buff Defense 1.5");
        this.particle.party();
        this.playSound();
    };
    this.reset();
}
DNDC.prototype = new Spell();
dndc = new DNDC();

ZaWarudo = function () {
    this.name = "Za Warudo";
    this.text = "Za Warudo";
    this.type = "Attack";
    this.maxPower = 0;

    this.cast = function () {
        pauseState = !pauseState;
    };
    this.reset();
};
ZaWarudo.prototype = new Spell();
zaWarudo = new ZaWarudo();

//Fills the spot when no spell selected
noSpell = new Spell();
noSpell.name = "No spell";
noSpell.untilNext = 0;

//Page setups for menu
var page1 = {
    spells: [pyroblast, iceSpike, lightning, shield1],
    img : spellMenuPic
}
var page2 = {
    spells: [lifeDrain, dispell, toxicCloud, dndc],
    img: spellMenu2Pic
}
page1.next = page2;
page2.previous = page1;